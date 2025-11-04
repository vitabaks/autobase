-- +goose Up
-- Update AWS and GCP instance types to 4th Intel Xeon CPU generation (Sapphire Rapids)
insert into public.cloud_instances (cloud_provider, instance_group, instance_name, cpu, ram, price_hourly, price_monthly, currency, updated_at)
values
  ('aws', 'Small Size', 'm7i.large', 2, 8, 0.1008, 73.584, '$', '2025-11-03'),
  ('aws', 'Small Size', 'r7i.large', 2, 16, 0.1323, 96.579, '$', '2025-11-03'),
  ('aws', 'Small Size', 'm7i.xlarge', 4, 16, 0.2016, 147.168, '$', '2025-11-03'),
  ('aws', 'Small Size', 'r7i.xlarge', 4, 32, 0.2646, 193.158, '$', '2025-11-03'),
  ('aws', 'Small Size', 'm7i.2xlarge', 8, 32, 0.4032, 294.336, '$', '2025-11-03'),
  ('aws', 'Small Size', 'r7i.2xlarge', 8, 64, 0.5292, 386.316, '$', '2025-11-03'),
  ('aws', 'Medium Size', 'm7i.4xlarge', 16, 64, 0.8064, 588.672, '$', '2025-11-03'),
  ('aws', 'Medium Size', 'r7i.4xlarge', 16, 128, 1.0584, 772.632, '$', '2025-11-03'),
  ('aws', 'Medium Size', 'm7i.8xlarge', 32, 128, 1.6128, 1177.344, '$', '2025-11-03'),
  ('aws', 'Medium Size', 'r7i.8xlarge', 32, 256, 2.1168, 1545.264, '$', '2025-11-03'),
  ('aws', 'Medium Size', 'm7i.12xlarge', 48, 192, 2.4192, 1766.016, '$', '2025-11-03'),
  ('aws', 'Medium Size', 'r7i.12xlarge', 48, 384, 3.1752, 2317.896, '$', '2025-11-03'),
  ('aws', 'Large Size', 'm7i.16xlarge', 64, 256, 3.2256, 2354.688, '$', '2025-11-03'),
  ('aws', 'Large Size', 'r7i.16xlarge', 64, 512, 4.2336, 3090.528, '$', '2025-11-03'),
  ('aws', 'Large Size', 'm7i.24xlarge', 96, 384, 4.8384, 3532.032, '$', '2025-11-03'),
  ('aws', 'Large Size', 'r7i.24xlarge', 96, 768, 6.3504, 4635.792, '$', '2025-11-03'),
  ('aws', 'Large Size', 'm7i.48xlarge', 192, 768, 9.6768, 7064.064, '$', '2025-11-03'),
  ('aws', 'Large Size', 'r7i.48xlarge', 192, 1536, 12.7008, 9271.584, '$', '2025-11-03'),
  ('gcp', 'Small Size', 'c3-standard-4', 4, 16, 0.201608, 147.17384, '$', '2025-11-03'),
  ('gcp', 'Small Size', 'c3-highmem-4', 4, 32, 0.264616, 193.16968, '$', '2025-11-03'),
  ('gcp', 'Small Size', 'c3-standard-8', 8, 32, 0.403216, 294.34768, '$', '2025-11-03'),
  ('gcp', 'Small Size', 'c3-highmem-8', 8, 64, 0.529232, 386.33936, '$', '2025-11-03'),
  ('gcp', 'Medium Size', 'c3-standard-22', 22, 88, 1.108844, 809.45612, '$', '2025-11-03'),
  ('gcp', 'Medium Size', 'c3-highmem-22', 22, 176, 1.455388, 1062.43324, '$', '2025-11-03'),
  ('gcp', 'Medium Size', 'c3-standard-44', 44, 176, 2.217688, 1618.91224, '$', '2025-11-03'),
  ('gcp', 'Medium Size', 'c3-highmem-44', 44, 352, 2.910776, 2124.86648, '$', '2025-11-03'),
  ('gcp', 'Medium Size', 'c3-standard-88', 88, 352, 4.435376, 3237.82448, '$', '2025-11-03'),
  ('gcp', 'Medium Size', 'c3-highmem-88', 88, 704, 5.821552, 4249.73296, '$', '2025-11-03'),
  ('gcp', 'Large Size', 'c3-standard-176', 176, 704, 8.870752, 6475.64896, '$', '2025-11-03'),
  ('gcp', 'Large Size', 'c3-highmem-176', 176, 1408, 11.643104, 8499.46592, '$', '2025-11-03'),
  ('gcp', 'Large Size', 'c3-standard-192-metal', 192, 768, 9.677184, 7064.34432, '$', '2025-11-03'),
  ('gcp', 'Large Size', 'c3-highmem-192-metal', 192, 1536, 12.701568, 9272.14464, '$', '2025-11-03');

-- Remove old AWS and GCP instance types (Ice Lake)
delete from public.cloud_instances
where cloud_provider = 'aws'
and (instance_name like 'm6i%' or instance_name like 'r6i%');

delete from public.cloud_instances
where cloud_provider = 'gcp'
and instance_name like 'n2%';

-- Update PostgreSQL max version for third-party extensions
update
  public.extensions
set
  postgres_max_version = '18'
where
  extension_name in ('pgaudit', 'pg_cron', 'pg_partman', 'pg_repack', 'pg_stat_kcache', 'pg_wait_sampling',
    'pgvector', 'postgis', 'pgrouting', 'timescaledb');

-- Update PostgreSQL max version for contrib extensions 
update
  public.extensions
set
  postgres_max_version = '16'
where
  extension_name in ('adminpack', 'old_snapshot');

-- Add new contrib extension
insert into public.extensions (extension_name, extension_description, postgres_min_version, postgres_max_version, extension_url, extension_image, contrib)
  values ('pg_logicalinspect', 'functions to inspect logical decoding components', 18, null, null, null, true);

-- +goose Down
