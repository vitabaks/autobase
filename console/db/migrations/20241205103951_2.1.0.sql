-- +goose Up
-- Postgres versions
insert into public.postgres_versions (major_version, release_date, end_of_life)
  values (17, '2024-09-26', '2029-11-08');

-- Extensions
update
  public.extensions
set
  postgres_max_version = '17'
where
  extension_name in ('pgaudit', 'pg_cron', 'pg_partman', 'pg_repack', 'pg_stat_kcache', 'pg_wait_sampling', 'pgvector', 'postgis',
    'pgrouting', 'timescaledb');

-- Adds shared_cpu BOOLEAN field to cloud_instances
-- ref: https://github.com/vitabaks/autobase/issues/784
alter table only public.cloud_instances
  add column shared_cpu boolean default false;

-- Update AWS shared vCPU instances
update
  public.cloud_instances
set
  shared_cpu = true
where
  cloud_provider = 'aws'
  and instance_name in ('t3.small', 't3.medium');

-- Update GCP shared vCPU instances
update
  public.cloud_instances
set
  shared_cpu = true
where
  cloud_provider = 'gcp'
  and instance_name in ('e2-small', 'e2-medium');

-- Update Azure shared vCPU instances
update
  public.cloud_instances
set
  shared_cpu = true
where
  cloud_provider = 'azure'
  and instance_name in ('Standard_B1ms', 'Standard_B2s');

-- Update DigitalOcean shared vCPU instances
update
  public.cloud_instances
set
  shared_cpu = true
where
  cloud_provider = 'digitalocean'
  and instance_name in ('s-2vcpu-2gb', 's-2vcpu-4gb');

-- Extends 20240520144338_2.0.0_initial_scheme_setup.sql#L217 with more cloud instance types
-- Heztner price is for the region 'Geremany / Finland', other regions may vary in price.
insert into public.cloud_instances (cloud_provider, instance_group, instance_name, cpu, ram, price_hourly, price_monthly, currency, updated_at, shared_cpu)
  values ('hetzner', 'Small Size', 'CX22', 2, 4, 0.0074, 4.59, '$', '2024-12-10', true),
  ('hetzner', 'Small Size', 'CX32', 4, 8, 0.0127, 7.59, '$', '2024-12-10', true),
  ('hetzner', 'Medium Size', 'CX42', 8, 16, 0.0304, 18.59, '$', '2024-12-10', true),
  ('hetzner', 'Medium Size', 'CX52', 16, 32, 0.0611, 36.09, '$', '2024-12-10', true),
  ('hetzner', 'Small Size', 'CPX31', 4, 8, 0.025, 15.59, '$', '2024-12-10', true),
  ('hetzner', 'Medium Size', 'CPX41', 8, 16, 0.0464, 28.09, '$', '2024-12-10', true),
  ('hetzner', 'Medium Size', 'CPX51', 16, 32, 0.0979, 61.09, '$', '2024-12-10', true);

-- Update all existing Hetzner instances to use USD instead of EUR for easy comparison to other IaaS Providers.
-- Update prices and other relevant fields for Hetzner cloud instances indludes an IPv4 address
update
  public.cloud_instances
set
  price_hourly = 0.0082,
  price_monthly = 5.09,
  currency = '$',
  updated_at = '2024-12-10',
  shared_cpu = true
where
  cloud_provider = 'hetzner'
  and instance_name = 'CPX11';

update
  public.cloud_instances
set
  price_hourly = 0.0138,
  price_monthly = 8.59,
  currency = '$',
  updated_at = '2024-12-10',
  shared_cpu = true
where
  cloud_provider = 'hetzner'
  and instance_name = 'CPX21';

update
  public.cloud_instances
set
  price_hourly = 0.0226,
  price_monthly = 14.09,
  currency = '$',
  updated_at = '2024-12-10',
  shared_cpu = false
where
  cloud_provider = 'hetzner'
  and instance_name = 'CCX13';

update
  public.cloud_instances
set
  price_hourly = 0.0435,
  price_monthly = 27.09,
  currency = '$',
  updated_at = '2024-12-10',
  shared_cpu = false
where
  cloud_provider = 'hetzner'
  and instance_name = 'CCX23';

update
  public.cloud_instances
set
  price_hourly = 0.0867,
  price_monthly = 54.09,
  currency = '$',
  updated_at = '2024-12-10',
  shared_cpu = false
where
  cloud_provider = 'hetzner'
  and instance_name = 'CCX33';

update
  public.cloud_instances
set
  price_hourly = 0.1725,
  price_monthly = 107.59,
  currency = '$',
  updated_at = '2024-12-10',
  shared_cpu = false
where
  cloud_provider = 'hetzner'
  and instance_name = 'CCX43';

update
  public.cloud_instances
set
  price_hourly = 0.3431,
  price_monthly = 214.09,
  currency = '$',
  updated_at = '2024-12-10',
  shared_cpu = false
where
  cloud_provider = 'hetzner'
  and instance_name = 'CCX53';

update
  public.cloud_instances
set
  price_hourly = 0.5138,
  price_monthly = 320.59,
  currency = '$',
  updated_at = '2024-12-10',
  shared_cpu = false
where
  cloud_provider = 'hetzner'
  and instance_name = 'CCX63';

-- cloud_volumes
-- Update prices and other relevant fields for Hetzner cloud volume
update
  public.cloud_volumes
set
  price_monthly = 0.05,
  currency = '$',
  updated_at = '2024-12-10'
where
  cloud_provider = 'hetzner';

-- +goose Down
delete from public.postgres_versions
where major_version = 17;
