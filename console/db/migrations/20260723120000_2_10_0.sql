-- +goose Up

-- Update Hetzner Cloud instance prices after the adjustment effective 15 June 2026.
-- Prices use the Germany rates, include a Primary IPv4 (€0.0008/hour, €0.50/month),
-- and include 19% German VAT, matching the prices displayed by Hetzner Console.
update public.cloud_instances as ci
set
  price_hourly = prices.price_hourly,
  price_monthly = prices.price_monthly,
  updated_at = date '2026-07-23'
from (
  values
    ('CPX22', 0.0381, 23.79),
    ('CPX32', 0.0687, 42.83),
    ('CPX42', 0.1335, 83.29),
    ('CPX52', 0.1925, 120.18),
    ('CPX62', 0.2488, 155.28),
    ('CCX13', 0.0829, 51.75),
    ('CCX23', 0.1649, 102.92),
    ('CCX33', 0.2650, 165.40),
    ('CCX43', 0.5273, 329.02),
    ('CCX53', 1.0184, 635.45),
    ('CCX63', 1.6286, 1016.25)
) as prices(instance_name, price_hourly, price_monthly)
where ci.cloud_provider = 'hetzner'
  and ci.instance_name = prices.instance_name;

-- Add a new Hetzner Cloud instance type, CPX12, which is a cost-optimized plan with 1 vCPU and 2 GB RAM.
insert into public.cloud_instances (cloud_provider, instance_group, instance_name, arch, cpu, ram, price_hourly, price_monthly, currency, updated_at, shared_cpu)
values
  ('hetzner', 'Small Size', 'CPX12', 'amd64', 1, 2, 0.0228, 14.27, '$', '2026-07-23', true);

-- Cost-Optimized plans have limited availability and are unsuitable for reliable automated cluster provisioning.
delete from public.cloud_instances
where cloud_provider = 'hetzner'
  and instance_name in (
    'CX23', 'CX33', 'CX43', 'CX53',
    'CAX11', 'CAX21', 'CAX31', 'CAX41'
  );


-- +goose Down
delete from public.cloud_instances
where cloud_provider = 'hetzner'
  and instance_name = 'CPX12';

update public.cloud_instances as ci
set
  price_hourly = prices.price_hourly,
  price_monthly = prices.price_monthly,
  updated_at = date '2025-11-22'
from (
  values
    ('CAX11', 0.0088, 5.46),
    ('CAX21', 0.0145, 9.03),
    ('CAX31', 0.0269, 16.77),
    ('CAX41', 0.0527, 32.83),
    ('CCX13', 0.0269, 16.77),
    ('CCX23', 0.0518, 32.24),
    ('CCX33', 0.1032, 64.37),
    ('CCX43', 0.2053, 128.03),
    ('CCX53', 0.4083, 254.77),
    ('CCX63', 0.6114, 381.50),
    ('CPX22', 0.0145, 9.03),
    ('CPX32', 0.0240, 14.98),
    ('CPX42', 0.0431, 26.88),
    ('CPX52', 0.0613, 38.19),
    ('CPX62', 0.0832, 51.87),
    ('CX23', 0.0079, 4.87),
    ('CX33', 0.0126, 7.84),
    ('CX43', 0.0200, 12.60),
    ('CX53', 0.0374, 23.31)
) as prices(instance_name, price_hourly, price_monthly)
where ci.cloud_provider = 'hetzner'
  and ci.instance_name = prices.instance_name;

insert into public.cloud_instances (
  cloud_provider,
  instance_group,
  instance_name,
  arch,
  cpu,
  ram,
  price_hourly,
  price_monthly,
  currency,
  updated_at,
  shared_cpu
)
values
  ('hetzner', 'Small Size', 'CX23', 'amd64', 2, 4, 0.0079, 4.87, '$', '2025-11-22', true),
  ('hetzner', 'Small Size', 'CX33', 'amd64', 4, 8, 0.0126, 7.84, '$', '2025-11-22', true),
  ('hetzner', 'Medium Size', 'CX43', 'amd64', 8, 16, 0.0200, 12.60, '$', '2025-11-22', true),
  ('hetzner', 'Medium Size', 'CX53', 'amd64', 16, 32, 0.0374, 23.31, '$', '2025-11-22', true),
  ('hetzner', 'Small Size', 'CAX11', 'arm64', 2, 4, 0.0088, 5.46, '$', '2025-11-22', true),
  ('hetzner', 'Small Size', 'CAX21', 'arm64', 4, 8, 0.0145, 9.03, '$', '2025-11-22', true),
  ('hetzner', 'Medium Size', 'CAX31', 'arm64', 8, 16, 0.0269, 16.77, '$', '2025-11-22', true),
  ('hetzner', 'Medium Size', 'CAX41', 'arm64', 16, 32, 0.0527, 32.83, '$', '2025-11-22', true);
