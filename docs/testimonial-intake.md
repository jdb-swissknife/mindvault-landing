# MindVault Studio testimonial intake

## Live link

https://trustmvs.com/review (redirects to /review/)

Launched 2026-10-13 at JB's request. This is a first-party testimonial form, not a Google review form. The business currently operates entirely remotely; do not imply GBP eligibility or fabricate a Google review link.

## What happens

- Required: name, email, honest feedback (20–4,000 characters).
- Optional: business name and an UNCHECKED website-publication checkbox.
- No rating gate, incentive, account requirement, photo, or logo collection.
- Permission is only for trustmvs.com with the entered name/business, NOT email, logos, photos, ads, or social posts.
- A successful submission returns a persisted UUID receipt. Network failures keep the entered text and do not claim success. Retrying an identical request is idempotent.
- All submissions begin `pending_review`, including permission-on submissions. Nothing publishes automatically.
- Names/emails are self-reported, not identity-verified. JB must verify authenticity before featuring a testimonial. Never publish test submissions.
- Consent wording, version, boolean choice, and server timestamp are saved. Wording changes require matching frontend/backend version updates.
- Withdrawal/deletion/contact address: jb@trustmvs.com. Removal from this website does not promise removal from third-party caches.

## Hosting and data

- Actual current host: GitHub Pages, repository `jdb-swissknife/mindvault-landing`, branch `gh-pages` (not the Cloudflare Pages host described in older skills).
- Source: `public/review/`, `public/privacy.html`.
- Existing Supabase project: `qsutnjrqdkiwqounpdre` (open-brain), already used by the landing website. No new subscription or project was created.
- Private data: `mvs_private.testimonials`. Schema is not exposed through REST; RLS enabled; no anon/authenticated schema, table read, or direct insert privileges.
- Public RPC: `public.submit_mvs_testimonial`. Security-definer with fixed search path; grants only EXECUTE. Validates bounds/types/consent, honeypot, retry identity, and limits submissions to 3 per email per day and 30 total per hour (excluding marked tests). Basic spam controls, not a CAPTCHA or proof of identity.
- `public/review/config.js` contains ONLY the verified public `anon` key. No service-role or management credential belongs in public assets.
- Existing homepage and bundled assets were left byte-for-byte unchanged during this deploy. The privacy page was extended specifically for testimonials.
- The static form loads no third-party JS, fonts, or paid widget. Its only submission destination is the existing Supabase project.

## Owner access / manual review

There is no email/Telegram notification automation or owner web-inbox UI in v1. Do not imply either exists. JB can ask Hermes to show the submitted testimonials. Hermes reads them using:

    python3 scripts/testimonial-admin.py list

Requires the existing `SUPABASE_ACCESS_TOKEN` in the environment. Default output omits test records, returns newest 100, and includes contact info, full feedback, permission choice, timestamp and review status. Do not forward this raw private output to a group or publish it. If the result reaches the 100-row limit, paginate with an owner-only database query rather than assuming the list is exhaustive.

Alternative: signed-in project owner can use the Supabase SQL editor at:
https://supabase.com/dashboard/project/qsutnjrqdkiwqounpdre/sql/new

    select id, created_at, name, email, business, testimonial,
           publication_permission, consent_text, consent_version, status
    from mvs_private.testimonials
    where status <> 'test'
    order by created_at desc;

Before publication: verify real customer identity, check permission is true and not withdrawn, get JB's approval, and preserve the customer's meaning. The current site does NOT render this table. Status changes alone cannot publish anything. Use a separate reviewed homepage change to feature an approved testimonial. If a customer asks to withdraw permission, remove any manually published copy and record the withdrawal privately.

## Reproducible tests

From the repo root, with Node/npm and Python 3:

    npm ci
    npm run build
    npm run lint
    python3 scripts/testimonial-admin.py verify
    REVIEW_TEST_URL=https://trustmvs.com/review/ node scripts/testimonial-e2e.mjs
    python3 scripts/testimonial-verify.py /tmp/mvs-e2e-<run>/receipts.json

E2E creates clearly synthetic `mvs-e2e-...@example.com` entries. The verify step reads back exact persisted fields, tests denial paths, and marks the exact browser receipts `test` (retaining audit evidence, not deleting customer data). The server rate-limit test is transactional and rolls back all of its rows. If the browser test aborts before writing receipts, inspect the exact synthetic entry and mark it with:

    python3 scripts/testimonial-admin.py mark-test --id <exact-receipt>

This only relabels `mvs-e2e-%@example.com` rows. Always read back afterward.

Tests cover desktop, 390px mobile, 320px layout; loaded logo; console/page errors; optional/default-off permission; real API writes; success states; network-failure UI; retry deduplication; exact stored consent text; server invalid-input/honeypot checks; email rate limit; anonymous public/private-schema read denials. Link navigation is also checked in the live browser.

## Initial production verification

- Pages deploy commit: `f6003005eea5e6f9a43293b7688a1f3383ba6593`.
- GitHub Pages API read-back: `built`, exact commit, 2026-10-13T21:49:48Z.
- Bare share URL redirects to the canonical path and returns HTTP 200.
- Live HTML, JS, CSS, public config, privacy policy, homepage HTML and existing main JS/CSS all matched the expected on-disk deployment bytes.
- Local browser test evidence: `/tmp/mvs-e2e-1791928045361/`.
- Live browser test evidence: `/tmp/mvs-e2e-1791928198258/` (screenshots and synthetic receipt payloads).
- Exact live receipt read-back verified both opt-out and opt-in records; both retained with `status=test` afterward.
- Production owner inbox read-back: empty after excluding synthetic test records.
- Build and lint: PASS. `npm ci` reported existing dependency audit warnings (24: 1 low, 2 moderate, 21 high); dependencies were not changed or bundled into the new standalone page. Separate dependency remediation is outside this feature's scope.

## Safe future deployment

Use a clean worktree from the current remote `gh-pages`. Copy ONLY `public/review/` to `review/`, and `public/privacy.html` to `privacy.html`. Commit and fast-forward push to `gh-pages`. Do not replace all Pages artifacts with a new `dist/` without first reconciling existing artifacts and build environment; the historical homepage bundles and resources must be preserved. Check remote HEAD before pushing; never force-push. Source changes should remain tracked through the main repository PR workflow.

Verify the exact Pages build commit, live canonical/bare links, asset bytes, and browser submission + database read-back after deployment. Do not re-run the one-time database migration: it deliberately refuses if the dedicated schema already exists.
