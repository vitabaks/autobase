-- +goose Up
comment on column public.servers.lag is 'The Postgres replication lag in bytes';

-- +goose Down
comment on column public.servers.lag is 'The lag in MB of the Postgres';
