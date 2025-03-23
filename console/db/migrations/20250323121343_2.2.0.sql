-- +goose Up
-- Extensions
update
  public.extensions
set
  postgres_max_version = '17'
where
  extension_name = 'citus';

-- +goose Down
