create table if not exists public.planner_calendars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  name text not null default '내 일정',
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.planner_calendars enable row level security;

revoke all on table public.planner_calendars from anon;
grant select, insert, update, delete
  on table public.planner_calendars
  to authenticated;

drop policy if exists "본인 일정 조회" on public.planner_calendars;
create policy "본인 일정 조회"
on public.planner_calendars
for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "본인 일정 생성" on public.planner_calendars;
create policy "본인 일정 생성"
on public.planner_calendars
for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "본인 일정 수정" on public.planner_calendars;
create policy "본인 일정 수정"
on public.planner_calendars
for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "본인 일정 삭제" on public.planner_calendars;
create policy "본인 일정 삭제"
on public.planner_calendars
for delete to authenticated
using ((select auth.uid()) = owner_id);
