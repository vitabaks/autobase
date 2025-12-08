-- +goose Up
insert into public.postgres_versions (major_version, release_date, end_of_life)
  values (18, '2025-09-25', '2030-11-14');

-- +goose Down
delete from public.postgres_versions
where major_version = 18;
