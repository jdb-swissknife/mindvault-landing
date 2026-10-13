-- Private-by-default testimonial intake. Does not change existing site tables.
begin;
create schema if not exists mvs_private;
revoke all on schema mvs_private from public, anon, authenticated;

create table mvs_private.testimonials (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  business text not null default '' check (char_length(business) <= 150),
  testimonial text not null check (char_length(testimonial) between 20 and 4000),
  publication_permission boolean not null default false,
  consent_version text not null default '2026-10-13-v1',
  consent_text text not null,
  permission_recorded_at timestamptz not null default now(),
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'declined', 'withdrawn', 'test')),
  source text not null default 'trustmvs.com/review',
  check (status <> 'approved' or publication_permission)
);
alter table mvs_private.testimonials enable row level security;
revoke all on mvs_private.testimonials from public, anon, authenticated;
create index testimonials_email_created on mvs_private.testimonials (email, created_at desc);
create index testimonials_created on mvs_private.testimonials (created_at desc);

create function public.submit_mvs_testimonial(
  p_id uuid, p_name text, p_email text, p_business text, p_testimonial text,
  p_permission boolean, p_consent_version text, p_website text default ''
) returns jsonb
language plpgsql security definer
set search_path = pg_catalog
as $$
declare
  v_name text := btrim(p_name);
  v_email text := lower(btrim(p_email));
  v_business text := btrim(coalesce(p_business, ''));
  v_testimonial text := btrim(p_testimonial);
  v_existing mvs_private.testimonials%rowtype;
begin
  if coalesce(p_website, '') <> '' then
    raise exception using errcode = '22023', message = 'Unable to accept submission.';
  end if;
  if p_id is null or v_name is null or char_length(v_name) not between 1 and 100
    or v_email is null or char_length(v_email) > 254
    or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or char_length(v_business) > 150
    or v_testimonial is null or char_length(v_testimonial) not between 20 and 4000
    or p_permission is null or p_consent_version is distinct from '2026-10-13-v1'
  then
    raise exception using errcode = '22023', message = 'Please check the form fields and refresh the page.';
  end if;

  -- Serialize this tiny intake to make the limits and retry handling race-safe.
  perform pg_advisory_xact_lock(19761013, 1);
  select * into v_existing from mvs_private.testimonials where id = p_id;
  if found then
    if v_existing.name = v_name and v_existing.email = v_email
      and v_existing.business = v_business and v_existing.testimonial = v_testimonial
      and v_existing.publication_permission = p_permission then
      return jsonb_build_object('accepted', true, 'receipt', p_id);
    end if;
    raise exception using errcode = '22023', message = 'Please refresh before submitting again.';
  end if;
  if (select count(*) from mvs_private.testimonials
      where email = v_email and created_at > now() - interval '24 hours' and status <> 'test') >= 3
    or (select count(*) from mvs_private.testimonials
      where created_at > now() - interval '1 hour' and status <> 'test') >= 30 then
    raise exception using errcode = 'P0001', message = 'Submissions are temporarily limited. Please try again later or email jb@trustmvs.com.';
  end if;
  insert into mvs_private.testimonials
    (id, name, email, business, testimonial, publication_permission, consent_text)
  values (p_id, v_name, v_email, v_business, v_testimonial, p_permission,
    'Yes, MindVault Studio may publish my testimonial on trustmvs.com, credited to the name and business I entered. My email will remain private. This does not include permission to use my photo or company logo. I can withdraw permission by emailing jb@trustmvs.com.');
  return jsonb_build_object('accepted', true, 'receipt', p_id);
end;
$$;
revoke all on function public.submit_mvs_testimonial(uuid,text,text,text,text,boolean,text,text) from public, anon, authenticated;
grant execute on function public.submit_mvs_testimonial(uuid,text,text,text,text,boolean,text,text) to anon, authenticated;
comment on table mvs_private.testimonials is 'Private intake only. Verify authenticity and written permission before any manual publication. No public SELECT or automatic publishing.';
notify pgrst, 'reload schema';
commit;
