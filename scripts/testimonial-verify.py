#!/usr/bin/env python3
"""Read back browser receipts, verify exact saved consent, test denied public access."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import urllib.error
import urllib.request
import uuid

spec = importlib.util.spec_from_file_location('admin', Path(__file__).with_name('testimonial-admin.py'))
assert spec is not None and spec.loader is not None
admin = importlib.util.module_from_spec(spec)
spec.loader.exec_module(admin)
receipts = json.loads(Path(sys.argv[1]).read_text())
key = admin.public_key()
base = f'https://{admin.PROJECT}.supabase.co/rest/v1'
headers = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}


def request(path, payload=None, extra=None):
    req = urllib.request.Request(base + path, data=json.dumps(payload).encode() if payload is not None else None,
        headers={**headers, **(extra or {})})
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as error:
        return error.code, json.loads(error.read())


for item in receipts:
    identifier = str(uuid.UUID(item['receipt']))
    rows = admin.query("select * from mvs_private.testimonials where id='" + identifier + "'")
    assert len(rows) == 1, 'Each receipt must identify exactly one row (including retry).'
    row, payload = rows[0], item['payload']
    for field in ['name', 'email', 'business', 'testimonial']:
        assert row[field] == payload['p_' + field], field
    assert row['publication_permission'] == payload['p_permission']
    assert row['consent_text'] == item['consent']
    assert row['consent_version'] == payload['p_consent_version']
    assert row['status'] == 'pending_review'
    assert row['created_at'] and row['permission_recorded_at']
    print(f'PASS: exact stored text + permission + consent version + pending_review for {identifier}')

payload = receipts[0]['payload']
for label, changes in [
    ('invalid email', {'p_email': 'invalid'}),
    ('blank name', {'p_name': '   '}),
    ('short feedback', {'p_testimonial': 'Too short'}),
    ('overlong feedback', {'p_testimonial': 'a' * 4001}),
    ('missing permission choice', {'p_permission': None}),
    ('invalid consent version', {'p_consent_version': 'not-the-consent-seen'}),
    ('honeypot', {'p_website': 'https://spam.example.com'}),
]:
    status, _ = request('/rpc/submit_mvs_testimonial', {**payload, 'p_id': str(uuid.uuid4()), **changes})
    assert status == 400, (label, status)
    print(f'PASS: server rejected {label}')
status, _ = request('/rpc/submit_mvs_testimonial', {**payload, 'p_testimonial': 'Different content must not silently overwrite the original record.'})
assert status == 400
print('PASS: same receipt cannot overwrite an existing submission')
for label, path, extra in [
    ('public table', '/testimonials?select=*', {}),
    ('private schema', '/testimonials?select=*', {'Accept-Profile': 'mvs_private'}),
]:
    status, _ = request(path, extra=extra)
    assert status in (401, 403, 404, 406), (label, status)
    print(f'PASS: anonymous read denied ({label}, HTTP {status})')

# Test the email rate limit inside a transaction that is fully rolled back.
rate_email = 'mvs-e2e-rate-' + str(uuid.uuid4()) + '@example.com'
sql = f"""begin;
do $test$
declare i integer; was_limited boolean := false;
begin
  for i in 1..3 loop
    perform public.submit_mvs_testimonial(gen_random_uuid(), 'MVS E2E rate test', '{rate_email}', '', 'SYNTHETIC RATE LIMIT TEST ONLY: never publish this.', false, '2026-10-13-v1', '');
  end loop;
  begin
    perform public.submit_mvs_testimonial(gen_random_uuid(), 'MVS E2E rate test', '{rate_email}', '', 'SYNTHETIC RATE LIMIT TEST ONLY: never publish this.', false, '2026-10-13-v1', '');
  exception when sqlstate 'P0001' then
    if sqlerrm like 'Submissions are temporarily limited.%' then was_limited := true; else raise; end if;
  end;
  if not was_limited then raise exception 'Rate limit failed'; end if;
end $test$;
rollback;
"""
admin.query(sql, read_only=False)
assert admin.query("select id from mvs_private.testimonials where email='" + rate_email + "'") == []
print('PASS: server email rate limit, rolled-back test rows absent')
subprocess.run([sys.executable, str(Path(__file__).with_name('testimonial-admin.py')), 'mark-test', *sum([['--id', item['receipt']] for item in receipts], [])], check=True)
print('PASS: all browser receipts verified and synthetic records excluded from real inbox.')
