#!/usr/bin/env python3
"""Owner-only testimonial operations. Requires SUPABASE_ACCESS_TOKEN.
Never publish this script's output, credentials, or exports in public/ or dist/.
"""
import argparse
import base64
import json
import os
from pathlib import Path
import sys
import urllib.error
import urllib.request
import uuid

PROJECT = 'qsutnjrqdkiwqounpdre'
ROOT = Path(__file__).resolve().parents[1]
BASE = f'https://api.supabase.com/v1/projects/{PROJECT}'


def api(path, data=None):
    token = os.environ.get('SUPABASE_ACCESS_TOKEN')
    if not token:
        raise RuntimeError('SUPABASE_ACCESS_TOKEN is required; do not put it in public files.')
    request = urllib.request.Request(BASE + path, data=json.dumps(data).encode() if data is not None else None,
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        # API SQL errors are useful; never print request headers or credentials.
        raise RuntimeError(f'API HTTP {error.code}: {error.read().decode()[:1200]}') from None


def query(sql, read_only=True):
    return api('/database/query', {'query': sql, 'read_only': read_only})


def public_key():
    for entry in api('/api-keys'):
        if entry.get('name') == 'anon':
            key = entry['api_key']
            claims = json.loads(base64.urlsafe_b64decode(key.split('.')[1] + '==='))
            if claims.get('role') != 'anon' or claims.get('ref') != PROJECT:
                raise RuntimeError('Refusing to publish a non-anon or wrong-project key.')
            return key
    raise RuntimeError('No legacy public anon key found.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['configure', 'migrate', 'verify', 'list', 'mark-test'])
    parser.add_argument('--id', action='append', default=[])
    parser.add_argument('--include-tests', action='store_true')
    args = parser.parse_args()
    if args.command == 'configure':
        config = {'url': f'https://{PROJECT}.supabase.co', 'anonKey': public_key()}
        target = ROOT / 'public/review/config.js'
        target.write_text('// Public anon credential. No SELECT access to testimonials.\nwindow.MVS_REVIEW_CONFIG = ' + json.dumps(config) + ';\n')
        print(f'Generated {target} with verified anon-only key.')
    elif args.command == 'migrate':
        existing = query("select schema_name from information_schema.schemata where schema_name = 'mvs_private'")
        if existing:
            raise RuntimeError('mvs_private already exists. Inspect before applying; migration is one-time.')
        print(json.dumps(query((ROOT / 'supabase/migrations/20261013_testimonials.sql').read_text(), read_only=False)))
    elif args.command == 'verify':
        sql = """select
          (select relrowsecurity from pg_class where oid = 'mvs_private.testimonials'::regclass) as rls_enabled,
          has_schema_privilege('anon','mvs_private','usage') as anon_schema_access,
          has_schema_privilege('authenticated','mvs_private','usage') as authenticated_schema_access,
          has_table_privilege('anon','mvs_private.testimonials','select') as anon_read,
          has_table_privilege('anon','mvs_private.testimonials','insert') as anon_direct_insert,
          has_table_privilege('authenticated','mvs_private.testimonials','select') as authenticated_read,
          has_function_privilege('anon','public.submit_mvs_testimonial(uuid,text,text,text,text,boolean,text,text)','execute') as anon_submit,
          (select prosecdef from pg_proc where oid = 'public.submit_mvs_testimonial(uuid,text,text,text,text,boolean,text,text)'::regprocedure) as security_definer;
        """
        result = query(sql)
        print(json.dumps(result, indent=2))
        expected = {'rls_enabled': True, 'anon_schema_access': False, 'authenticated_schema_access': False,
            'anon_read': False, 'anon_direct_insert': False, 'authenticated_read': False, 'anon_submit': True, 'security_definer': True}
        if result != [expected]:
            raise RuntimeError('Unexpected testimonial access privileges.')
        print('PASS: private storage, no public read/write access, submission RPC enabled.')
    elif args.command == 'list':
        where = '' if args.include_tests else "where status <> 'test'"
        rows = query('select id, created_at, name, email, business, testimonial, publication_permission, consent_version, permission_recorded_at, status from mvs_private.testimonials ' + where + ' order by created_at desc limit 100')
        print(json.dumps(rows, indent=2))
    elif args.command == 'mark-test':
        if not args.id:
            raise RuntimeError('Provide the exact test receipt IDs with --id.')
        ids = ','.join("'" + str(uuid.UUID(value)) + "'" for value in args.id)
        # Can only relabel clearly synthetic example.com records; no customer deletions.
        rows = query("update mvs_private.testimonials set status='test' where id in (" + ids + ") and email like 'mvs-e2e-%@example.com' returning id, status", read_only=False)
        verified = query('select id, status from mvs_private.testimonials where id in (' + ids + ')')
        if len(verified) != len(set(args.id)) or any(row['status'] != 'test' for row in verified):
            raise RuntimeError('Test classification read-back failed.')
        print(json.dumps(verified, indent=2))
        print(f'PASS: {len(rows)} synthetic submissions marked test, retained for audit.')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
