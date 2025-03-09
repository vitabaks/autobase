-- +goose Up
-- Create extensions
create schema if not exists extensions;

create extension if not exists moddatetime schema extensions;

create extension if not exists pgcrypto schema extensions;

-- cloud_providers
create table public.cloud_providers (
  provider_name text not null,
  provider_description text not null,
  provider_image text
);

comment on table public.cloud_providers is 'Table containing cloud providers information';

comment on column public.cloud_providers.provider_name is 'The name of the cloud provider';

comment on column public.cloud_providers.provider_description is 'A description of the cloud provider';

insert into public.cloud_providers (provider_name, provider_description, provider_image)
  values ('aws', 'Amazon Web Services', 'aws.png'),
  ('gcp', 'Google Cloud Platform', 'gcp.png'),
  ('azure', 'Microsoft Azure', 'azure.png'),
  ('digitalocean', 'DigitalOcean', 'digitalocean.png'),
  ('hetzner', 'Hetzner Cloud', 'hetzner.png');

alter table only public.cloud_providers
  add constraint cloud_providers_pkey primary key (provider_name);

-- cloud_regions
create table public.cloud_regions (
  cloud_provider text not null,
  region_group text not null,
  region_name text not null,
  region_description text not null
);

comment on table public.cloud_regions is 'Table containing cloud regions information for various cloud providers';

comment on column public.cloud_regions.cloud_provider is 'The name of the cloud provider';

comment on column public.cloud_regions.region_group is 'The geographical group of the cloud region';

comment on column public.cloud_regions.region_name is 'The specific name of the cloud region';

comment on column public.cloud_regions.region_description is 'A description of the cloud region';

insert into public.cloud_regions (cloud_provider, region_group, region_name, region_description)
  values ('aws', 'Africa', 'af-south-1', 'Africa (Cape Town)'),
  ('aws', 'Asia Pacific', 'ap-east-1', 'Asia Pacific (Hong Kong)'),
  ('aws', 'Asia Pacific', 'ap-south-1', 'Asia Pacific (Mumbai)'),
  ('aws', 'Asia Pacific', 'ap-south-2', 'Asia Pacific (Hyderabad)'),
  ('aws', 'Asia Pacific', 'ap-southeast-3', 'Asia Pacific (Jakarta)'),
  ('aws', 'Asia Pacific', 'ap-southeast-4', 'Asia Pacific (Melbourne)'),
  ('aws', 'Asia Pacific', 'ap-northeast-1', 'Asia Pacific (Tokyo)'),
  ('aws', 'Asia Pacific', 'ap-northeast-2', 'Asia Pacific (Seoul)'),
  ('aws', 'Asia Pacific', 'ap-northeast-3', 'Asia Pacific (Osaka)'),
  ('aws', 'Asia Pacific', 'ap-southeast-1', 'Asia Pacific (Singapore)'),
  ('aws', 'Asia Pacific', 'ap-southeast-2', 'Asia Pacific (Sydney)'),
  ('aws', 'Europe', 'eu-central-1', 'Europe (Frankfurt)'),
  ('aws', 'Europe', 'eu-west-1', 'Europe (Ireland)'),
  ('aws', 'Europe', 'eu-west-2', 'Europe (London)'),
  ('aws', 'Europe', 'eu-west-3', 'Europe (Paris)'),
  ('aws', 'Europe', 'eu-north-1', 'Europe (Stockholm)'),
  ('aws', 'Europe', 'eu-south-1', 'Europe (Milan)'),
  ('aws', 'Europe', 'eu-south-2', 'Europe (Spain)'),
  ('aws', 'Europe', 'eu-central-2', 'Europe (Zurich)'),
  ('aws', 'Middle East', 'me-south-1', 'Middle East (Bahrain)'),
  ('aws', 'Middle East', 'me-central-1', 'Middle East (UAE)'),
  ('aws', 'North America', 'us-east-1', 'US East (N. Virginia)'),
  ('aws', 'North America', 'us-east-2', 'US East (Ohio)'),
  ('aws', 'North America', 'us-west-1', 'US West (N. California)'),
  ('aws', 'North America', 'us-west-2', 'US West (Oregon)'),
  ('aws', 'North America', 'ca-central-1', 'Canada (Central)'),
  ('aws', 'North America', 'ca-west-1', 'Canada (Calgary)'),
  ('aws', 'South America', 'sa-east-1', 'South America (São Paulo)'),
  ('gcp', 'Africa', 'africa-south1', 'Johannesburg'),
  ('gcp', 'Asia Pacific', 'asia-east1', 'Taiwan'),
  ('gcp', 'Asia Pacific', 'asia-east2', 'Hong Kong'),
  ('gcp', 'Asia Pacific', 'asia-northeast1', 'Tokyo'),
  ('gcp', 'Asia Pacific', 'asia-northeast2', 'Osaka'),
  ('gcp', 'Asia Pacific', 'asia-northeast3', 'Seoul'),
  ('gcp', 'Asia Pacific', 'asia-south1', 'Mumbai'),
  ('gcp', 'Asia Pacific', 'asia-south2', 'Delhi'),
  ('gcp', 'Asia Pacific', 'asia-southeast1', 'Singapore'),
  ('gcp', 'Asia Pacific', 'asia-southeast2', 'Jakarta'),
  ('gcp', 'Australia', 'australia-southeast1', 'Sydney'),
  ('gcp', 'Australia', 'australia-southeast2', 'Melbourne'),
  ('gcp', 'Europe', 'europe-central2', 'Warsaw'),
  ('gcp', 'Europe', 'europe-north1', 'Finland'),
  ('gcp', 'Europe', 'europe-southwest1', 'Madrid'),
  ('gcp', 'Europe', 'europe-west1', 'Belgium'),
  ('gcp', 'Europe', 'europe-west10', 'Berlin'),
  ('gcp', 'Europe', 'europe-west12', 'Turin'),
  ('gcp', 'Europe', 'europe-west2', 'London'),
  ('gcp', 'Europe', 'europe-west3', 'Frankfurt'),
  ('gcp', 'Europe', 'europe-west4', 'Netherlands'),
  ('gcp', 'Europe', 'europe-west6', 'Zurich'),
  ('gcp', 'Europe', 'europe-west8', 'Milan'),
  ('gcp', 'Europe', 'europe-west9', 'Paris'),
  ('gcp', 'Middle East', 'me-central1', 'Doha'),
  ('gcp', 'Middle East', 'me-central2', 'Dammam'),
  ('gcp', 'Middle East', 'me-west1', 'Tel Aviv'),
  ('gcp', 'North America', 'northamerica-northeast1', 'Montréal'),
  ('gcp', 'North America', 'northamerica-northeast2', 'Toronto'),
  ('gcp', 'North America', 'us-central1', 'Iowa'),
  ('gcp', 'North America', 'us-east1', 'South Carolina'),
  ('gcp', 'North America', 'us-east4', 'Northern Virginia'),
  ('gcp', 'North America', 'us-east5', 'Columbus'),
  ('gcp', 'North America', 'us-south1', 'Dallas'),
  ('gcp', 'North America', 'us-west1', 'Oregon'),
  ('gcp', 'North America', 'us-west2', 'Los Angeles'),
  ('gcp', 'North America', 'us-west3', 'Salt Lake City'),
  ('gcp', 'North America', 'us-west4', 'Las Vegas'),
  ('gcp', 'South America', 'southamerica-east1', 'São Paulo'),
  ('gcp', 'South America', 'southamerica-west1', 'Santiago'),
  ('azure', 'Africa', 'southafricanorth', 'South Africa North (Johannesburg)'),
  ('azure', 'Africa', 'southafricawest', 'South Africa West (Cape Town)'),
  ('azure', 'Asia Pacific', 'australiacentral', 'Australia Central (Canberra)'),
  ('azure', 'Asia Pacific', 'australiacentral2', 'Australia Central 2 (Canberra)'),
  ('azure', 'Asia Pacific', 'australiaeast', 'Australia East (New South Wales)'),
  ('azure', 'Asia Pacific', 'australiasoutheast', 'Australia Southeast (Victoria)'),
  ('azure', 'Asia Pacific', 'centralindia', 'Central India (Pune)'),
  ('azure', 'Asia Pacific', 'eastasia', 'East Asia (Hong Kong)'),
  ('azure', 'Asia Pacific', 'japaneast', 'Japan East (Tokyo, Saitama)'),
  ('azure', 'Asia Pacific', 'japanwest', 'Japan West (Osaka)'),
  ('azure', 'Asia Pacific', 'jioindiacentral', 'Jio India Central (Nagpur)'),
  ('azure', 'Asia Pacific', 'jioindiawest', 'Jio India West (Jamnagar)'),
  ('azure', 'Asia Pacific', 'koreacentral', 'Korea Central (Seoul)'),
  ('azure', 'Asia Pacific', 'koreasouth', 'Korea South (Busan)'),
  ('azure', 'Asia Pacific', 'southeastasia', 'Southeast Asia (Singapore)'),
  ('azure', 'Asia Pacific', 'southindia', 'South India (Chennai)'),
  ('azure', 'Asia Pacific', 'westindia', 'West India (Mumbai)'),
  ('azure', 'Europe', 'francecentral', 'France Central (Paris)'),
  ('azure', 'Europe', 'francesouth', 'France South (Marseille)'),
  ('azure', 'Europe', 'germanynorth', 'Germany North (Berlin)'),
  ('azure', 'Europe', 'germanywestcentral', 'Germany West Central (Frankfurt)'),
  ('azure', 'Europe', 'italynorth', 'Italy North (Milan)'),
  ('azure', 'Europe', 'northeurope', 'North Europe (Ireland)'),
  ('azure', 'Europe', 'norwayeast', 'Norway East (Norway)'),
  ('azure', 'Europe', 'norwaywest', 'Norway West (Norway)'),
  ('azure', 'Europe', 'polandcentral', 'Poland Central (Warsaw)'),
  ('azure', 'Europe', 'swedencentral', 'Sweden Central (Gävle)'),
  ('azure', 'Europe', 'switzerlandnorth', 'Switzerland North (Zurich)'),
  ('azure', 'Europe', 'switzerlandwest', 'Switzerland West (Geneva)'),
  ('azure', 'Europe', 'uksouth', 'UK South (London)'),
  ('azure', 'Europe', 'ukwest', 'UK West (Cardiff)'),
  ('azure', 'Europe', 'westeurope', 'West Europe (Netherlands)'),
  ('azure', 'Mexico', 'mexicocentral', 'Mexico Central (Querétaro State)'),
  ('azure', 'Middle East', 'qatarcentral', 'Qatar Central (Doha)'),
  ('azure', 'Middle East', 'uaecentral', 'UAE Central (Abu Dhabi)'),
  ('azure', 'Middle East', 'uaenorth', 'UAE North (Dubai)'),
  ('azure', 'South America', 'brazilsouth', 'Brazil South (Sao Paulo State)'),
  ('azure', 'South America', 'brazilsoutheast', 'Brazil Southeast (Rio)'),
  ('azure', 'North America', 'centralus', 'Central US (Iowa)'),
  ('azure', 'North America', 'eastus', 'East US (Virginia)'),
  ('azure', 'North America', 'eastus2', 'East US 2 (Virginia)'),
  ('azure', 'North America', 'eastusstg', 'East US STG (Virginia)'),
  ('azure', 'North America', 'northcentralus', 'North Central US (Illinois)'),
  ('azure', 'North America', 'southcentralus', 'South Central US (Texas)'),
  ('azure', 'North America', 'westcentralus', 'West Central US (Wyoming)'),
  ('azure', 'North America', 'westus', 'West US (California)'),
  ('azure', 'North America', 'westus2', 'West US 2 (Washington)'),
  ('azure', 'North America', 'westus3', 'West US 3 (Phoenix)'),
  ('azure', 'North America', 'canadaeast', 'Canada East (Quebec)'),
  ('azure', 'North America', 'canadacentral', 'Canada Central (Toronto)'),
  ('azure', 'South America', 'brazilus', 'Brazil US (South America)'),
  ('digitalocean', 'Asia Pacific', 'sgp1', 'Singapore (Datacenter 1)'),
  ('digitalocean', 'Asia Pacific', 'blr1', 'Bangalore (Datacenter 1)'),
  ('digitalocean', 'Australia', 'syd1', 'Sydney (Datacenter 1)'),
  ('digitalocean', 'Europe', 'ams3', 'Amsterdam (Datacenter 3)'),
  ('digitalocean', 'Europe', 'lon1', 'London (Datacenter 1)'),
  ('digitalocean', 'Europe', 'fra1', 'Frankfurt (Datacenter 1)'),
  ('digitalocean', 'North America', 'nyc1', 'New York (Datacenter 1)'),
  ('digitalocean', 'North America', 'nyc3', 'New York (Datacenter 3)'),
  ('digitalocean', 'North America', 'sfo2', 'San Francisco (Datacenter 2)'),
  ('digitalocean', 'North America', 'sfo3', 'San Francisco (Datacenter 3)'),
  ('digitalocean', 'North America', 'tor1', 'Toronto (Datacenter 1)'),
  ('hetzner', 'Europe', 'nbg1', 'Nuremberg'),
  ('hetzner', 'Europe', 'fsn1', 'Falkenstein'),
  ('hetzner', 'Europe', 'hel1', 'Helsinki'),
  ('hetzner', 'North America', 'hil', 'Hillsboro, OR'),
  ('hetzner', 'North America', 'ash', 'Ashburn, VA'),
  ('hetzner', 'Asia Pacific', 'sin', 'Singapore');

alter table only public.cloud_regions
  add constraint cloud_regions_pkey primary key (cloud_provider, region_group, region_name);

alter table only public.cloud_regions
  add constraint cloud_regions_cloud_provider_fkey foreign key (cloud_provider) references public.cloud_providers (provider_name);

-- cloud_instances
create table public.cloud_instances (
  cloud_provider text not null,
  instance_group text not null,
  instance_name text not null,
  arch text default 'amd64' not null,
  cpu integer not null,
  ram integer not null,
  price_hourly numeric not null,
  price_monthly numeric not null,
  currency char(1) default '$' not null,
  updated_at timestamp default current_timestamp
);

comment on table public.cloud_instances is 'Table containing cloud instances information for various cloud providers';

comment on column public.cloud_instances.cloud_provider is 'The name of the cloud provider';

comment on column public.cloud_instances.instance_group is 'The group of the instance size';

comment on column public.cloud_instances.instance_name is 'The specific name of the cloud instance';

comment on column public.cloud_instances.arch is 'The architecture of the instance';

comment on column public.cloud_instances.cpu is 'The number of CPUs of the instance';

comment on column public.cloud_instances.ram is 'The amount of RAM (in GB) of the instance';

comment on column public.cloud_instances.price_hourly is 'The hourly price of the instance';

comment on column public.cloud_instances.price_monthly is 'The monthly price of the instance';

comment on column public.cloud_instances.currency is 'The currency of the price (default: $)';

comment on column public.cloud_instances.updated_at is 'The date when the instance information was last updated';

-- The price is approximate because it is specified for one region and may differ in other regions.
-- aws, gcp, azure: the price is for the region 'US East'
insert into public.cloud_instances (cloud_provider, instance_group, instance_name, cpu, ram, price_hourly, price_monthly, currency, updated_at)
  values ('aws', 'Small Size', 't3.small', 2, 2, 0.021, 14.976, '$', '2024-05-15'),
  ('aws', 'Small Size', 't3.medium', 2, 4, 0.042, 29.952, '$', '2024-05-15'),
  ('aws', 'Small Size', 'm6i.large', 2, 8, 0.096, 69.120, '$', '2024-05-15'),
  ('aws', 'Small Size', 'r6i.large', 2, 16, 0.126, 90.720, '$', '2024-05-15'),
  ('aws', 'Small Size', 'm6i.xlarge', 4, 16, 0.192, 138.240, '$', '2024-05-15'),
  ('aws', 'Small Size', 'r6i.xlarge', 4, 32, 0.252, 181.440, '$', '2024-05-15'),
  ('aws', 'Medium Size', 'm6i.2xlarge', 8, 32, 0.384, 276.480, '$', '2024-05-15'),
  ('aws', 'Medium Size', 'r6i.2xlarge', 8, 64, 0.504, 362.880, '$', '2024-05-15'),
  ('aws', 'Medium Size', 'm6i.4xlarge', 16, 64, 0.768, 552.960, '$', '2024-05-15'),
  ('aws', 'Medium Size', 'r6i.4xlarge', 16, 128, 1.008, 725.760, '$', '2024-05-15'),
  ('aws', 'Medium Size', 'm6i.8xlarge', 32, 128, 1.536, 1105.920, '$', '2024-05-15'),
  ('aws', 'Medium Size', 'r6i.8xlarge', 32, 256, 2.016, 1451.520, '$', '2024-05-15'),
  ('aws', 'Medium Size', 'm6i.12xlarge', 48, 192, 2.304, 1658.880, '$', '2024-05-15'),
  ('aws', 'Medium Size', 'r6i.12xlarge', 48, 384, 3.024, 2177.280, '$', '2024-05-15'),
  ('aws', 'Large Size', 'm6i.16xlarge', 64, 256, 3.072, 2211.840, '$', '2024-05-15'),
  ('aws', 'Large Size', 'r6i.16xlarge', 64, 512, 4.032, 2903.040, '$', '2024-05-15'),
  ('aws', 'Large Size', 'm6i.24xlarge', 96, 384, 4.608, 3317.760, '$', '2024-05-15'),
  ('aws', 'Large Size', 'r6i.24xlarge', 96, 768, 6.048, 4354.560, '$', '2024-05-15'),
  ('aws', 'Large Size', 'm6i.32xlarge', 128, 512, 6.144, 4423.680, '$', '2024-05-15'),
  ('aws', 'Large Size', 'r6i.32xlarge', 128, 1024, 8.064, 5806.080, '$', '2024-05-15'),
  ('aws', 'Large Size', 'm7i.48xlarge', 192, 768, 9.677, 6967.296, '$', '2024-05-15'),
  ('aws', 'Large Size', 'r7i.48xlarge', 192, 1536, 12.701, 9144.576, '$', '2024-05-15'),
  ('gcp', 'Small Size', 'e2-small', 2, 2, 0.017, 12.228, '$', '2024-05-15'),
  ('gcp', 'Small Size', 'e2-medium', 2, 4, 0.034, 24.457, '$', '2024-05-15'),
  ('gcp', 'Small Size', 'n2-standard-2', 2, 8, 0.097, 70.896, '$', '2024-05-15'),
  ('gcp', 'Small Size', 'n2-highmem-2', 2, 16, 0.131, 95.640, '$', '2024-05-15'),
  ('gcp', 'Small Size', 'n2-standard-4', 4, 16, 0.194, 141.792, '$', '2024-05-15'),
  ('gcp', 'Small Size', 'n2-highmem-4', 4, 32, 0.262, 191.280, '$', '2024-05-15'),
  ('gcp', 'Medium Size', 'n2-standard-8', 8, 32, 0.388, 283.585, '$', '2024-05-15'),
  ('gcp', 'Medium Size', 'n2-highmem-8', 8, 64, 0.524, 382.561, '$', '2024-05-15'),
  ('gcp', 'Medium Size', 'n2-standard-16', 16, 64, 0.777, 567.169, '$', '2024-05-15'),
  ('gcp', 'Medium Size', 'n2-highmem-16', 16, 128, 1.048, 765.122, '$', '2024-05-15'),
  ('gcp', 'Medium Size', 'n2-standard-32', 32, 128, 1.554, 1134.338, '$', '2024-05-15'),
  ('gcp', 'Medium Size', 'n2-highmem-32', 32, 256, 2.096, 1530.244, '$', '2024-05-15'),
  ('gcp', 'Medium Size', 'n2-standard-48', 48, 192, 2.331, 1701.507, '$', '2024-05-15'),
  ('gcp', 'Medium Size', 'n2-highmem-48', 48, 384, 3.144, 2295.365, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'n2-standard-64', 64, 256, 3.108, 2268.676, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'n2-highmem-64', 64, 512, 4.192, 3060.487, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'n2-standard-80', 80, 320, 3.885, 2835.846, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'n2-highmem-80', 80, 640, 5.241, 3825.609, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'n2-standard-96', 96, 384, 4.662, 3403.015, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'n2-highmem-96', 96, 768, 6.289, 4590.731, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'n2-standard-128', 128, 512, 6.216, 4537.353, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'n2-highmem-128', 128, 864, 7.707, 5626.092, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'c3-standard-176', 176, 704, 9.188, 6706.913, '$', '2024-05-15'),
  ('gcp', 'Large Size', 'c3-highmem-176', 176, 1408, 12.394, 9047.819, '$', '2024-05-15'),
  ('azure', 'Small Size', 'Standard_B1ms', 1, 2, 0.021, 15.111, '$', '2024-05-15'),
  ('azure', 'Small Size', 'Standard_B2s', 2, 4, 0.042, 30.368, '$', '2024-05-15'),
  ('azure', 'Small Size', 'Standard_D2s_v5', 2, 8, 0.096, 70.080, '$', '2024-05-15'),
  ('azure', 'Small Size', 'Standard_E2s_v5', 2, 16, 0.126, 91.980, '$', '2024-05-15'),
  ('azure', 'Small Size', 'Standard_D4s_v5', 4, 16, 0.192, 140.160, '$', '2024-05-15'),
  ('azure', 'Small Size', 'Standard_E4s_v5', 4, 32, 0.252, 183.960, '$', '2024-05-15'),
  ('azure', 'Medium Size', 'Standard_D8s_v5', 8, 32, 0.384, 280.320, '$', '2024-05-15'),
  ('azure', 'Medium Size', 'Standard_E8s_v5', 8, 64, 0.504, 367.920, '$', '2024-05-15'),
  ('azure', 'Medium Size', 'Standard_D16s_v5', 16, 64, 0.768, 560.640, '$', '2024-05-15'),
  ('azure', 'Medium Size', 'Standard_E16s_v5', 16, 128, 1.008, 735.840, '$', '2024-05-15'),
  ('azure', 'Medium Size', 'Standard_D32s_v5', 32, 128, 1.536, 1121.280, '$', '2024-05-15'),
  ('azure', 'Medium Size', 'Standard_E32s_v5', 32, 256, 2.016, 1471.680, '$', '2024-05-15'),
  ('azure', 'Large Size', 'Standard_D48s_v5', 48, 192, 2.304, 1681.920, '$', '2024-05-15'),
  ('azure', 'Large Size', 'Standard_E48s_v5', 48, 384, 3.024, 2207.520, '$', '2024-05-15'),
  ('azure', 'Large Size', 'Standard_D64s_v5', 64, 256, 3.072, 2242.560, '$', '2024-05-15'),
  ('azure', 'Large Size', 'Standard_E64s_v5', 64, 512, 4.032, 2943.360, '$', '2024-05-15'),
  ('azure', 'Large Size', 'Standard_D96s_v5', 96, 384, 4.608, 3363.840, '$', '2024-05-15'),
  ('azure', 'Large Size', 'Standard_E96s_v5', 96, 672, 6.048, 4415.040, '$', '2024-05-15'),
  ('digitalocean', 'Small Size', 's-2vcpu-2gb', 2, 2, 0.027, 18.000, '$', '2024-05-15'),
  ('digitalocean', 'Small Size', 's-2vcpu-4gb', 2, 4, 0.036, 24.000, '$', '2024-05-15'),
  ('digitalocean', 'Small Size', 'g-2vcpu-8gb', 2, 8, 0.094, 63.000, '$', '2024-05-15'),
  ('digitalocean', 'Small Size', 'm-2vcpu-16gb', 2, 16, 0.125, 84.000, '$', '2024-05-15'),
  ('digitalocean', 'Small Size', 'g-4vcpu-16gb', 4, 16, 0.188, 126.000, '$', '2024-05-15'),
  ('digitalocean', 'Small Size', 'm-4vcpu-32gb', 4, 32, 0.250, 168.000, '$', '2024-05-15'),
  ('digitalocean', 'Medium Size', 'g-8vcpu-32gb', 8, 32, 0.375, 252.000, '$', '2024-05-15'),
  ('digitalocean', 'Medium Size', 'm-8vcpu-64gb', 8, 64, 0.500, 336.000, '$', '2024-05-15'),
  ('digitalocean', 'Medium Size', 'g-16vcpu-64gb', 16, 64, 0.750, 504.000, '$', '2024-05-15'),
  ('digitalocean', 'Medium Size', 'm-16vcpu-128gb', 16, 128, 1.000, 672.000, '$', '2024-05-15'),
  ('digitalocean', 'Medium Size', 'g-32vcpu-128gb', 32, 128, 1.500, 1008.000, '$', '2024-05-15'),
  ('digitalocean', 'Medium Size', 'm-32vcpu-256gb', 32, 256, 2.000, 1344.000, '$', '2024-05-15'),
  ('digitalocean', 'Medium Size', 'g-48vcpu-192gb', 48, 192, 2.699, 1814.000, '$', '2024-05-15'),
  ('hetzner', 'Small Size', 'CPX11', 2, 2, 0.007, 5.180, '€', '2024-07-21'),
  ('hetzner', 'Small Size', 'CPX21', 3, 4, 0.010, 8.980, '€', '2024-07-21'),
  ('hetzner', 'Small Size', 'CCX13', 2, 8, 0.024, 14.860, '€', '2024-05-15'),
  ('hetzner', 'Small Size', 'CCX23', 4, 16, 0.047, 29.140, '€', '2024-05-15'),
  ('hetzner', 'Medium Size', 'CCX33', 8, 32, 0.093, 57.700, '€', '2024-05-15'),
  ('hetzner', 'Medium Size', 'CCX43', 16, 64, 0.184, 114.820, '€', '2024-05-15'),
  ('hetzner', 'Medium Size', 'CCX53', 32, 128, 0.367, 229.060, '€', '2024-05-15'),
  ('hetzner', 'Medium Size', 'CCX63', 48, 192, 0.550, 343.300, '€', '2024-05-15');

alter table only public.cloud_instances
  add constraint cloud_instances_pkey primary key (cloud_provider, instance_group, instance_name);

alter table only public.cloud_instances
  add constraint cloud_instances_cloud_provider_fkey foreign key (cloud_provider) references public.cloud_providers (provider_name);

-- this trigger will set the "updated_at" column to the current timestamp for every update
create trigger handle_updated_at
  before update on public.cloud_instances for each row
  execute function extensions.moddatetime (updated_at);

-- cloud_volumes
create table public.cloud_volumes (
  cloud_provider text not null,
  volume_type text not null,
  volume_description text not null,
  volume_min_size integer not null,
  volume_max_size integer not null,
  price_monthly numeric not null,
  currency char(1) default '$' not null,
  is_default boolean not null default false,
  updated_at timestamp default current_timestamp
);

comment on table public.cloud_volumes is 'Table containing cloud volume information for various cloud providers';

comment on column public.cloud_volumes.cloud_provider is 'The name of the cloud provider';

comment on column public.cloud_volumes.volume_type is 'The type of the volume (the name provided by the API)';

comment on column public.cloud_volumes.volume_description is 'Description of the volume';

comment on column public.cloud_volumes.volume_min_size is 'The minimum size of the volume (in GB)';

comment on column public.cloud_volumes.volume_max_size is 'The maximum size of the volume (in GB)';

comment on column public.cloud_volumes.price_monthly is 'The monthly price per GB of the volume';

comment on column public.cloud_volumes.currency is 'The currency of the price (default: $)';

comment on column public.cloud_volumes.is_default is 'Indicates if the volume type is the default';

comment on column public.cloud_volumes.updated_at is 'The date when the volume information was last updated';

-- The price is approximate because it is specified for one region and may differ in other regions.
-- aws, gcp, azure: the price is for the region 'US East'
insert into public.cloud_volumes (cloud_provider, volume_type, volume_description, volume_min_size, volume_max_size, price_monthly, currency, is_default, updated_at)
  values ('aws', 'st1', 'Throughput Optimized HDD Disk (Max throughput: 500 MiB/s, Max IOPS: 500)', 125, 16000, 0.045, '$', false, '2024-05-15'),
  ('aws', 'gp3', 'General Purpose SSD Disk (Max throughput: 1,000 MiB/s, Max IOPS: 16,000)', 10, 16000, 0.080, '$', true, '2024-05-15'),
  ('aws', 'io2', 'Provisioned IOPS SSD Disk (Max throughput: 4,000 MiB/s, Max IOPS: 256,000)', 10, 64000, 0.125, '$', false, '2024-05-15'),
  ('gcp', 'pd-standard', 'Standard Persistent HDD Disk (Max throughput: 180 MiB/s, Max IOPS: 3,000)', 10, 64000, 0.040, '$', false, '2024-05-15'),
  ('gcp', 'pd-balanced', 'Balanced Persistent SSD Disk (Max throughput: 240 MiB/s, Max IOPS: 15,000)', 10, 64000, 0.100, '$', false, '2024-05-15'),
  ('gcp', 'pd-ssd', 'SSD Persistent Disk (Max throughput: 1,200 MiB/s, Max IOPS: 100,000)', 10, 64000, 0.170, '$', true, '2024-05-15'),
  ('gcp', 'pd-extreme', 'Extreme Persistent SSD Disk (Max throughput: 2,400 MiB/s, Max IOPS: 120,000)', 500, 64000, 0.125, '$', false, '2024-05-15'),
  ('azure', 'Standard_LRS', 'Standard HDD (Max throughput: 500 MiB/s, Max IOPS: 2,000)', 10, 32000, 0.040, '$', false, '2024-05-15'),
  ('azure', 'StandardSSD_LRS', 'Standard SSD (Max throughput: 750 MiB/s, Max IOPS: 6,000)', 10, 32000, 0.075, '$', true, '2024-05-15'),
  ('azure', 'Premium_LRS', 'Premium SSD (Max throughput: 900 MiB/s, Max IOPS: 20,000)', 10, 32000, 0.132, '$', false, '2024-05-15'),
  ('azure', 'UltraSSD_LRS', 'Ultra SSD (Max throughput: 10,000 MiB/s, Max IOPS: 400,000)', 10, 64000, 0.120, '$', false, '2024-05-15'),
  ('digitalocean', 'ssd', 'SSD Block Storage (Max throughput: 300 MiB/s, Max IOPS: 7,500)', 10, 16000, 0.100, '$', true, '2024-05-15'),
  ('hetzner', 'ssd', 'SSD Block Storage (Max throughput: N/A MiB/s, Max IOPS: N/A)', 10, 10000, 0.052, '€', true, '2024-05-15');

alter table only public.cloud_volumes
  add constraint cloud_volumes_pkey primary key (cloud_provider, volume_type);

alter table only public.cloud_volumes
  add constraint cloud_volumes_cloud_provider_fkey foreign key (cloud_provider) references public.cloud_providers (provider_name);

create trigger handle_updated_at
  before update on public.cloud_volumes for each row
  execute function extensions.moddatetime (updated_at);

-- cloud_images
create table public.cloud_images (
  cloud_provider text not null,
  region text not null,
  image jsonb not null,
  arch text default 'amd64' not null,
  os_name text not null,
  os_version text not null,
  updated_at timestamp default current_timestamp
);

comment on table public.cloud_images is 'Table containing cloud images information for various cloud providers';

comment on column public.cloud_images.cloud_provider is 'The name of the cloud provider';

comment on column public.cloud_images.region is 'The region where the image is available';

comment on column public.cloud_images.image is 'The image details in JSON format {"variable_name": "value"}';

comment on column public.cloud_images.arch is 'The architecture of the operating system (default: amd64)';

comment on column public.cloud_images.os_name is 'The name of the operating system';

comment on column public.cloud_images.os_version is 'The version of the operating system';

comment on column public.cloud_images.updated_at is 'The date when the image information was last updated';

-- For all cloud providers except AWS, the image is the same for all regions.
-- For AWS, the image must be specified for each specific region.
-- The value of the "image" column is set in the format: '{"variable_name": "value"}'
-- This format provides flexibility to specify different variables for different cloud providers.
-- For example, Azure requires four variables instead of a single "server_image":
-- azure_vm_image_offer, azure_vm_image_publisher, azure_vm_image_sku, azure_vm_image_version.
insert into public.cloud_images (cloud_provider, region, image, arch, os_name, os_version, updated_at)
  values ('aws', 'ap-south-2', '{"server_image": "ami-07c29982fe3ae5d4a"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-south-1', '{"server_image": "ami-01c893e7f232d634f"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'eu-south-1', '{"server_image": "ami-0ef03f8ff5bbf854c"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'eu-south-2', '{"server_image": "ami-0e37953c2e92990cd"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'me-central-1', '{"server_image": "ami-028258249d6efbb44"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ca-central-1', '{"server_image": "ami-0019e788a5e62c6e4"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'eu-central-1', '{"server_image": "ami-0ac67c1f8689447a6"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'eu-central-2', '{"server_image": "ami-0ac79a44f0ec70fe1"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'us-west-1', '{"server_image": "ami-0947011e21ec8788d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'us-west-2', '{"server_image": "ami-0ca5d4e146b3ba5bf"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'af-south-1', '{"server_image": "ami-0ff5d1627e39b443d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'eu-north-1', '{"server_image": "ami-035542f8c972d7edf"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'eu-west-3', '{"server_image": "ami-0ba794d79cd225039"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'eu-west-2', '{"server_image": "ami-0bc743bd935283b7f"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'eu-west-1', '{"server_image": "ami-09c7c04446217191d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-northeast-3', '{"server_image": "ami-0bfe27a707728ee11"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-northeast-2', '{"server_image": "ami-02d2c9994ab378951"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'me-south-1', '{"server_image": "ami-009d9f02cfb388154"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-northeast-1', '{"server_image": "ami-0aa80c152f0b55a7e"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'sa-east-1', '{"server_image": "ami-0f381f7a86e649eb5"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-east-1', '{"server_image": "ami-0bb44258f22410dc4"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ca-west-1', '{"server_image": "ami-042df192e435e6fb3"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-southeast-1', '{"server_image": "ami-01568ec8f5b6dc989"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-southeast-2', '{"server_image": "ami-0c5b9ab59f97ceca7"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-southeast-3', '{"server_image": "ami-01c86258ba749f015"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'ap-southeast-4', '{"server_image": "ami-0afd313fa12d9bcf0"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'us-east-1', '{"server_image": "ami-063fb82b183efe67d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('aws', 'us-east-2', '{"server_image": "ami-0dc168b827060282d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-09'),
  ('gcp', 'all', '{"server_image": "projects/ubuntu-os-cloud/global/images/family/ubuntu-2404-lts-amd64"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-12'),
  ('azure', 'all', '{"azure_vm_image_offer": "ubuntu-24_04-lts", "azure_vm_image_publisher": "Canonical", "azure_vm_image_sku": "server", "azure_vm_image_version": "latest"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-12'),
  ('digitalocean', 'all', '{"server_image": "ubuntu-24-04-x64"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-12'),
  ('hetzner', 'all', '{"server_image": "ubuntu-24.04"}', 'amd64', 'Ubuntu', '24.04 LTS', '2024-08-12');

alter table only public.cloud_images
  add constraint cloud_images_pkey primary key (cloud_provider, image);

alter table only public.cloud_images
  add constraint cloud_images_cloud_provider_fkey foreign key (cloud_provider) references public.cloud_providers (provider_name);

create trigger handle_updated_at
  before update on public.cloud_images for each row
  execute function extensions.moddatetime (updated_at);

-- Projects
create table public.projects (
  project_id bigserial primary key,
  project_name varchar(50) not null unique,
  project_description varchar(150),
  created_at timestamp default current_timestamp,
  updated_at timestamp
);

comment on table public.projects is 'Table containing information about projects';

comment on column public.projects.project_name is 'The name of the project';

comment on column public.projects.project_description is 'A description of the project';

comment on column public.projects.created_at is 'The timestamp when the project was created';

comment on column public.projects.updated_at is 'The timestamp when the project was last updated';

create trigger handle_updated_at
  before update on public.projects for each row
  execute function extensions.moddatetime (updated_at);

insert into public.projects (project_name)
  values ('default');

-- Environments
create table public.environments (
  environment_id bigserial primary key,
  environment_name varchar(20) not null,
  environment_description text,
  created_at timestamp default current_timestamp,
  updated_at timestamp
);

comment on table public.environments is 'Table containing information about environments';

comment on column public.environments.environment_name is 'The name of the environment';

comment on column public.environments.environment_description is 'A description of the environment';

comment on column public.environments.created_at is 'The timestamp when the environment was created';

comment on column public.environments.updated_at is 'The timestamp when the environment was last updated';

create trigger handle_updated_at
  before update on public.environments for each row
  execute function extensions.moddatetime (updated_at);

create index environments_name_idx on public.environments (environment_name);

insert into public.environments (environment_name)
  values ('production');

insert into public.environments (environment_name)
  values ('staging');

insert into public.environments (environment_name)
  values ('test');

insert into public.environments (environment_name)
  values ('dev');

insert into public.environments (environment_name)
  values ('benchmarking');

-- Secrets
create table public.secrets (
  secret_id bigserial primary key,
  project_id bigint references public.projects (project_id),
  secret_type text not null,
  secret_name text not null unique,
  secret_value bytea not null, -- Encrypted data
  created_at timestamp default current_timestamp,
  updated_at timestamp
);

comment on table public.secrets is 'Table containing secrets for accessing cloud providers and servers';

comment on column public.secrets.project_id is 'The ID of the project to which the secret belongs';

comment on column public.secrets.secret_type is 'The type of the secret (e.g., cloud_secret, ssh_key, password)';

comment on column public.secrets.secret_name is 'The name of the secret';

comment on column public.secrets.secret_value is 'The encrypted value of the secret';

comment on column public.secrets.created_at is 'The timestamp when the secret was created';

comment on column public.secrets.updated_at is 'The timestamp when the secret was last updated';

create trigger handle_updated_at
  before update on public.secrets for each row
  execute function extensions.moddatetime (updated_at);

create index secrets_type_name_idx on public.secrets (secret_type, secret_name);

create index secrets_id_project_idx on public.secrets (secret_id, project_id);

create index secrets_project_idx on public.secrets (project_id);

-- +goose StatementBegin
create or replace function add_secret (p_project_id bigint, p_secret_type text, p_secret_name text, p_secret_value json, p_encryption_key text)
  returns bigint
  as $$
declare
  v_inserted_secret_id bigint;
begin
  insert into public.secrets (project_id, secret_type, secret_name, secret_value)
    values (p_project_id, p_secret_type, p_secret_name, extensions.pgp_sym_encrypt(p_secret_value::text, p_encryption_key, 'cipher-algo=aes256'))
  returning
    secret_id into v_inserted_secret_id;
  return v_inserted_secret_id;
end;
$$
language plpgsql;
-- +goose StatementEnd

-- +goose StatementBegin
create or replace function update_secret (p_secret_id bigint, p_secret_type text default null, p_secret_name text default null, p_secret_value json default
  null, p_encryption_key text default null)
  returns table (
    project_id bigint,
    secret_id bigint,
    secret_type text,
    secret_name text,
    created_at timestamp,
    updated_at timestamp,
    used boolean,
    used_by_clusters text,
    used_by_servers text
  )
  as $$
begin
  if p_secret_value is not null and p_encryption_key is null then
    raise exception 'Encryption key must be provided when updating secret value';
  end if;
  update
    public.secrets
  set
    secret_name = coalesce(p_secret_name, public.secrets.secret_name),
    secret_type = coalesce(p_secret_type, public.secrets.secret_type),
    secret_value = case when p_secret_value is not null then
      extensions.pgp_sym_encrypt(p_secret_value::text, p_encryption_key, 'cipher-algo=aes256')
    else
      public.secrets.secret_value
    end
  where
    public.secrets.secret_id = p_secret_id;
  return QUERY
  select
    s.project_id,
    s.secret_id,
    s.secret_type,
    s.secret_name,
    s.created_at,
    s.updated_at,
    s.used,
    s.used_by_clusters,
    s.used_by_servers
  from
    public.v_secrets_list s
  where
    s.secret_id = p_secret_id;
end;
$$
language plpgsql;
-- +goose StatementEnd

-- +goose StatementBegin
create or replace function get_secret (p_secret_id bigint, p_encryption_key text)
  returns json
  as $$
declare
  decrypted_value json;
begin
  select
    extensions.pgp_sym_decrypt(secret_value, p_encryption_key)::json into decrypted_value
  from
    public.secrets
  where
    secret_id = p_secret_id;
  return decrypted_value;
end;
$$
language plpgsql;
-- +goose StatementEnd

-- An example of using a function to insert a secret (value in JSON format)
-- select add_secret(<project_id>, 'ssh_key', '<secret_name>', '{"private_key": "<CONTENT>"}', '<encryption_key>');
-- select add_secret(<project_id>, 'password', '<secret_name>', '{"username": "<CONTENT>", "password": "<CONTENT>"}', '<encryption_key>');
-- select add_secret(<project_id>, 'aws', '<secret_name>', '{"AWS_ACCESS_KEY_ID": "<CONTENT>", "AWS_SECRET_ACCESS_KEY": "<CONTENT>"}', '<encryption_key>');
-- An example of using the function to update a secret
-- select update_secret(<secret_id>, '<new_secret_type>', '<new_secret_name>', '<new_secret_value>', '<encryption_key>');
-- An example of using a function to get a secret
-- select get_secret(<secret_id>, '<encryption_key>');

-- Clusters
create table public.clusters (
  cluster_id bigserial primary key,
  project_id bigint references public.projects (project_id),
  environment_id bigint references public.environments (environment_id),
  secret_id bigint references public.secrets (secret_id),
  cluster_name text not null unique,
  cluster_status text default 'deploying',
  cluster_description text,
  cluster_location text,
  connection_info jsonb,
  extra_vars jsonb,
  inventory jsonb,
  server_count integer default 0,
  postgres_version integer,
  created_at timestamp default current_timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  flags integer default 0
);

comment on table public.clusters is 'Table containing information about Postgres clusters';

comment on column public.clusters.project_id is 'The ID of the project to which the cluster belongs';

comment on column public.clusters.environment_id is 'The environment in which the cluster is deployed (e.g., production, development, etc)';

comment on column public.clusters.cluster_name is 'The name of the cluster (it must be unique)';

comment on column public.clusters.cluster_status is 'The status of the cluster (e.q., deploying, failed, healthy, unhealthy, degraded)';

comment on column public.clusters.cluster_description is 'A description of the cluster (optional)';

comment on column public.clusters.connection_info is 'The cluster connection info';

comment on column public.clusters.extra_vars is 'Extra variables for Ansible specific to this cluster';

comment on column public.clusters.inventory is 'The Ansible inventory for this cluster';

comment on column public.clusters.cluster_location is 'The region/datacenter where the cluster is located';

comment on column public.clusters.server_count is 'The number of servers associated with the cluster';

comment on column public.clusters.postgres_version is 'The Postgres major version';

comment on column public.clusters.secret_id is 'The ID of the secret for accessing the cloud provider';

comment on column public.clusters.created_at is 'The timestamp when the cluster was created';

comment on column public.clusters.updated_at is 'The timestamp when the cluster was last updated';

comment on column public.clusters.deleted_at is 'The timestamp when the cluster was (soft) deleted';

comment on column public.clusters.flags is 'Bitmask field for storing various status flags related to the cluster';

create trigger handle_updated_at
  before update on public.clusters for each row
  execute function extensions.moddatetime (updated_at);

create index clusters_id_project_id_idx on public.clusters (cluster_id, project_id);

create index clusters_project_idx on public.clusters (project_id);

create index clusters_environment_idx on public.clusters (environment_id);

create index clusters_name_idx on public.clusters (cluster_name);

create index clusters_secret_id_idx on public.clusters (secret_id);

-- +goose StatementBegin
create or replace function get_cluster_name ()
  returns text
  as $$
declare
  new_name text;
  counter int := 1;
begin
  loop
    new_name := 'postgres-cluster-' || to_char(counter, 'FM00');
    -- Check if such a cluster name already exists
    if not exists (
      select
        1
      from
        public.clusters
      where
        cluster_name = new_name) then
    return new_name;
  end if;
  counter := counter + 1;
end loop;
end;
$$
language plpgsql;
-- +goose StatementEnd

-- Servers
create table public.servers (
  server_id bigserial primary key,
  cluster_id bigint references public.clusters (cluster_id),
  server_name text not null,
  server_location text,
  server_role text default 'N/A',
  server_status text default 'N/A',
  ip_address inet not null,
  timeline bigint,
  lag bigint,
  tags jsonb,
  pending_restart boolean default false,
  created_at timestamp default current_timestamp,
  updated_at timestamp
);

comment on table public.servers is 'Table containing information about servers within a Postgres cluster';

comment on column public.servers.cluster_id is 'The ID of the cluster to which the server belongs';

comment on column public.servers.server_name is 'The name of the server';

comment on column public.servers.server_location is 'The region/datacenter where the server is located';

comment on column public.servers.server_role is 'The role of the server (e.g., primary, replica)';

comment on column public.servers.server_status is 'The current status of the server';

comment on column public.servers.ip_address is 'The IP address of the server';

comment on column public.servers.timeline is 'The timeline of the Postgres';

comment on column public.servers.lag is 'The lag in MB of the Postgres';

comment on column public.servers.tags is 'The tags associated with the server';

comment on column public.servers.pending_restart is 'Indicates whether a restart is pending for the Postgres';

comment on column public.servers.created_at is 'The timestamp when the server was created';

comment on column public.servers.updated_at is 'The timestamp when the server was last updated';

create trigger handle_updated_at
  before update on public.servers for each row
  execute function extensions.moddatetime (updated_at);

create unique index servers_cluster_id_ip_address_idx on public.servers (cluster_id, ip_address);

-- +goose StatementBegin
create or replace function update_server_count ()
  returns trigger
  as $$
begin
  update
    public.clusters
  set
    server_count = (
      select
        count(*)
      from
        public.servers
      where
        public.servers.cluster_id = new.cluster_id)
  where
    cluster_id = new.cluster_id;
  return NEW;
end;
$$
language plpgsql;
-- +goose StatementEnd

-- Trigger to update server_count on changes in servers
create trigger update_server_count_trigger
  after insert or update or delete on public.servers for each row
  execute function update_server_count ();

-- Secrets view
create view public.v_secrets_list as
select
  s.project_id,
  s.secret_id,
  s.secret_name,
  s.secret_type,
  s.created_at,
  s.updated_at,
  case when count(c.secret_id) > 0 then
    true
  else
    false
  end as used,
  coalesce(string_agg(distinct c.cluster_name, ', '), '') as used_by_clusters
from
  public.secrets s
  left join lateral (
    select
      cluster_name,
      secret_id
    from
      public.clusters
    where
      secret_id = s.secret_id
      and project_id = s.project_id) c on true
group by
  s.project_id,
  s.secret_id,
  s.secret_name,
  s.secret_type,
  s.created_at,
  s.updated_at;

-- Extensions
create table public.extensions (
  extension_name text primary key,
  extension_description varchar(150) not null,
  extension_url text,
  extension_image text,
  postgres_min_version text,
  postgres_max_version text,
  contrib boolean not null
);

comment on table public.extensions is 'Table containing available extensions for different Postgres versions';

comment on column public.extensions.extension_name is 'The name of the extension';

comment on column public.extensions.extension_description is 'The description of the extension';

comment on column public.extensions.postgres_min_version is 'The minimum Postgres version where the extension is available';

comment on column public.extensions.postgres_max_version is 'The maximum Postgres version where the extension is available';

comment on column public.extensions.contrib is 'Indicates if the extension is a contrib module or third-party extension';

-- The table stores information about Postgres extensions, including name, description, supported Postgres version range,
-- and whether the extension is a contrib module or third-party.
-- postgres_min_version and postgres_max_version define the range of Postgres versions supported by extensions.
-- If the postgres_max_version is NULL, it is assumed that the extension is still supported by new versions of Postgres.
insert into public.extensions (extension_name, extension_description, postgres_min_version, postgres_max_version, extension_url, extension_image, contrib)
  values ('adminpack', 'administrative functions for PostgreSQL', null, null, null, null, true),
  ('amcheck', 'functions for verifying relation integrity', null, null, null, null, true),
  ('autoinc', 'functions for autoincrementing fields', null, null, null, null, true),
  ('bloom', 'bloom access method - signature file based index', null, null, null, null, true),
  ('btree_gin', 'support for indexing common datatypes in GIN', null, null, null, null, true),
  ('btree_gist', 'support for indexing common datatypes in GiST', null, null, null, null, true),
  ('chkpass', 'data type for auto-encrypted passwords', null, '10', null, null, true),
  ('citext', 'data type for case-insensitive character strings', null, null, null, null, true),
  ('cube', 'data type for multidimensional cubes', null, null, null, null, true),
  ('dblink', 'connect to other PostgreSQL databases from within a database', null, null, null, null, true),
  ('dict_int', 'text search dictionary template for integers', null, null, null, null, true),
  ('dict_xsyn', 'text search dictionary template for extended synonym processing', null, null, null, null, true),
  ('earthdistance', 'calculate great-circle distances on the surface of the Earth', null, null, null, null, true),
  ('file_fdw', 'foreign-data wrapper for flat file access', null, null, null, null, true),
  ('fuzzystrmatch', 'determine similarities and distance between strings', null, null, null, null, true),
  ('hstore', 'data type for storing sets of (key, value) pairs', null, null, null, null, true),
  ('insert_username', 'functions for tracking who changed a table', null, null, null, null, true),
  ('intagg', 'integer aggregator and enumerator (obsolete)', null, null, null, null, true),
  ('intarray', 'functions, operators, and index support for 1-D arrays of integers', null, null, null, null, true),
  ('isn', 'data types for international product numbering standards', null, null, null, null, true),
  ('lo', 'Large Object maintenance', null, null, null, null, true),
  ('ltree', 'data type for hierarchical tree-like structures', null, null, null, null, true),
  ('moddatetime', 'functions for tracking last modification time', null, null, null, null, true),
  ('old_snapshot', 'utilities in support of old_snapshot_threshold', '14', null, null, null, true),
  ('pageinspect', 'inspect the contents of database pages at a low level', null, null, null, null, true),
  ('pg_buffercache', 'examine the shared buffer cache', null, null, null, null, true),
  ('pg_freespacemap', 'examine the free space map (FSM)', null, null, null, null, true),
  ('pg_prewarm', 'prewarm relation data', null, null, null, null, true),
  ('pg_stat_statements', 'track planning and execution statistics of all SQL statements executed', null, null, null, null, true),
  ('pg_surgery', 'extension to perform surgery on a damaged relation', '14', null, null, null, true),
  ('pg_trgm', 'text similarity measurement and index searching based on trigrams', null, null, null, null, true),
  ('pg_visibility', 'examine the visibility map (VM) and page-level visibility info', null, null, null, null, true),
  ('pg_walinspect', 'functions to inspect contents of PostgreSQL Write-Ahead Log', '15', null, null, null, true),
  ('pgcrypto', 'cryptographic functions', null, null, null, null, true),
  ('pgrowlocks', 'show row-level locking information', null, null, null, null, true),
  ('pgstattuple', 'show tuple-level statistics', null, null, null, null, true),
  ('plpgsql', 'PL/pgSQL procedural language', null, null, null, null, true),
  ('postgres_fdw', 'foreign-data wrapper for remote PostgreSQL servers', null, null, null, null, true),
  ('refint', 'functions for implementing referential integrity (obsolete)', null, null, null, null, true),
  ('seg', 'data type for representing line segments or floating-point intervals', null, null, null, null, true),
  ('sslinfo', 'information about SSL certificates', null, null, null, null, true),
  ('tablefunc', 'functions that manipulate whole tables, including crosstab', null, null, null, null, true),
  ('tcn', 'Triggered change notifications', null, null, null, null, true),
  ('timetravel', 'functions for implementing time travel', null, '11', null, null, true),
  ('tsm_system_rows', 'TABLESAMPLE method which accepts number of rows as a limit', null, null, null, null, true),
  ('tsm_system_time', 'TABLESAMPLE method which accepts time in milliseconds as a limit', null, null, null, null, true),
  ('unaccent', 'text search dictionary that removes accents', null, null, null, null, true),
  ('uuid-ossp', 'generate universally unique identifiers (UUIDs)', null, null, null, null, true),
  ('xml2', 'XPath querying and XSLT', null, null, null, null, true),
  -- Third-Party Extensions
  ('citus', 'Citus is a PostgreSQL extension that transforms Postgres into a distributed database—so you can achieve high performance at any scale', 11, 16, 'https://github.com/citusdata/citus', 'citus.png', false),
  ('pgaudit', 'The PostgreSQL Audit Extension provides detailed session and/or object audit logging via the standard PostgreSQL logging facility', 10, 16, 'https://github.com/pgaudit/pgaudit', 'pgaudit.png', false),
  ('pg_cron', 'Job scheduler for PostgreSQL', 10, 16, 'https://github.com/citusdata/pg_cron', 'pg_cron.png', false),
  ('pg_partman', 'pg_partman is an extension to create and manage both time-based and number-based table partition sets', 10, 16, 'https://github.com/pgpartman/pg_partman', 'pg_partman.png', false),
  ('pg_repack', 'Reorganize tables in PostgreSQL databases with minimal locks', 10, 16, 'https://github.com/reorg/pg_repack', 'pg_repack.png', false),
  ('pg_stat_kcache', 'Gather statistics about physical disk access and CPU consumption done by backends', 10, 16, 'https://github.com/powa-team/pg_stat_kcache', null, false),
  ('pg_wait_sampling', 'Sampling based statistics of wait events', 10, 16, 'https://github.com/postgrespro/pg_wait_sampling', null, false),
  ('pgvector', 'Open-source vector similarity search for Postgres (vector data type and ivfflat and hnsw access methods)', 11, 16, 'https://github.com/pgvector/pgvector', 'pgvector.png', false),
  ('postgis', 'PostGIS extends the capabilities of the PostgreSQL relational database by adding support for storing, indexing, and querying geospatial data', 10, 16, 'https://postgis.net', 'postgis.png', false),
  ('pgrouting', 'pgRouting extends the PostGIS / PostgreSQL geospatial database to provide geospatial routing functionality', 10, 16, 'https://pgrouting.org', 'pgrouting.png', false),
  ('timescaledb', 'TimescaleDB is an open-source database designed to make SQL scalable for time-series data (Community Edition)', 12, 16, 'https://github.com/timescale/timescaledb', 'timescaledb.png', false);

-- +goose StatementBegin
create or replace function get_extensions (p_postgres_version float, p_extension_type text default 'all')
  returns json
  as $$
declare
  extensions json;
begin
  select
    json_agg(row_to_json(e)) into extensions
  from (
    select
      e.extension_name,
      e.extension_description,
      e.extension_url,
      e.extension_image,
      e.postgres_min_version,
      e.postgres_max_version,
      e.contrib
    from
      public.extensions e
    where (e.postgres_min_version is null
      or e.postgres_min_version::float <= p_postgres_version)
    and (e.postgres_max_version is null
      or e.postgres_max_version::float >= p_postgres_version)
    and (p_extension_type = 'all'
      or (p_extension_type = 'contrib'
        and e.contrib = true)
      or (p_extension_type = 'third_party'
        and e.contrib = false))
  order by
    e.contrib,
    e.extension_image is null,
    e.extension_name) e;
  return extensions;
end;
$$
language plpgsql;
-- +goose StatementEnd

-- An example of using a function to get a list of available extensions (all or 'contrib'/'third_party' only)
-- select get_extensions(16);
-- select get_extensions(16, 'contrib');
-- select get_extensions(16, 'third_party');

-- Operations
create table public.operations (
  id bigserial,
  project_id bigint references public.projects (project_id),
  cluster_id bigint references public.clusters (cluster_id),
  docker_code varchar(80) not null,
  cid uuid,
  operation_type text not null,
  operation_status text not null check (operation_status in ('in_progress', 'success', 'failed')),
  operation_log text,
  created_at timestamp with time zone default current_timestamp,
  updated_at timestamp with time zone
);

comment on table public.operations is 'Table containing logs of operations performed on clusters';

comment on column public.operations.id is 'The ID of the operation from the backend';

comment on column public.clusters.project_id is 'The ID of the project to which the operation belongs';

comment on column public.operations.cluster_id is 'The ID of the cluster related to the operation';

comment on column public.operations.docker_code is 'The CODE of the operation related to the docker daemon';

comment on column public.operations.cid is 'The correlation_id related to the operation';

comment on column public.operations.operation_type is 'The type of operation performed (e.g., deploy, edit, update, restart, delete, etc.)';

comment on column public.operations.operation_status is 'The status of the operation (in_progress, success, failed)';

comment on column public.operations.operation_log is 'The log details of the operation';

comment on column public.operations.created_at is 'The timestamp when the operation was created';

comment on column public.operations.updated_at is 'The timestamp when the operation was last updated';

create trigger handle_updated_at
  before update on public.operations for each row
  execute function extensions.moddatetime (updated_at);

-- add created_at as part of the primary key to be able to create a hypertable
alter table only public.operations
  add constraint operations_pkey primary key (created_at, id);

create index operations_project_id_idx on public.operations (project_id);

create index operations_cluster_id_idx on public.operations (cluster_id);

create index operations_project_cluster_id_idx on public.operations (project_id, cluster_id, created_at);

create index operations_project_cluster_id_operation_type_idx on public.operations (project_id, cluster_id, operation_type, created_at);

-- Check if the timescaledb extension is available and create hypertable if it is
-- +goose StatementBegin
do $$
begin
  if exists (
    select
      1
    from
      pg_extension
    where
      extname = 'timescaledb') then
  -- Convert the operations table to a hypertable
  perform
    create_hypertable ('public.operations', 'created_at', chunk_time_interval => interval '1 month');
  -- Check if the license allows compression policy
  if current_setting('timescaledb.license', true) = 'timescale' then
    -- Enable compression on the operations hypertable, segmenting by project_id and cluster_id
    alter table public.operations set (timescaledb.compress, timescaledb.compress_orderby = 'created_at desc, id desc, operation_type, operation_status', timescaledb.compress_segmentby = 'project_id, cluster_id');
    -- Compressing chunks older than one month
    perform
      add_compression_policy ('public.operations', interval '1 month');
  else
    raise notice 'Timescaledb license does not support compression policy. Skipping compression setup.';
  end if;
else
  raise notice 'Timescaledb extension is not available. Skipping hypertable and compression setup.';
end if;
end
$$;
-- +goose StatementEnd

create or replace view public.v_operations as
select
  op.project_id,
  op.cluster_id,
  op.id,
  op.created_at as "started",
  op.updated_at as "finished",
  op.operation_type as "type",
  op.operation_status as "status",
  cl.cluster_name as "cluster",
  env.environment_name as "environment"
from
  public.operations op
  join public.clusters cl on op.cluster_id = cl.cluster_id
  join public.projects pr on op.project_id = pr.project_id
  join public.environments env on cl.environment_id = env.environment_id;

-- Postgres versions
create table public.postgres_versions (
  major_version integer primary key,
  release_date date,
  end_of_life date
);

comment on table public.postgres_versions is 'Table containing the major PostgreSQL versions supported by the autobase';

comment on column public.postgres_versions.major_version is 'The major version of PostgreSQL';

comment on column public.postgres_versions.release_date is 'The release date of the PostgreSQL version';

comment on column public.postgres_versions.end_of_life is 'The end of life date for the PostgreSQL version';

insert into public.postgres_versions (major_version, release_date, end_of_life)
  values (10, '2017-10-05', '2022-11-10'),
  (11, '2018-10-18', '2023-11-09'),
  (12, '2019-10-03', '2024-11-14'),
  (13, '2020-09-24', '2025-11-13'),
  (14, '2021-09-30', '2026-11-12'),
  (15, '2022-10-13', '2027-11-11'),
  (16, '2023-09-14', '2028-11-09');

-- Settings
create table public.settings (
  id bigserial primary key,
  setting_name text not null unique,
  setting_value jsonb not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp
);

comment on table public.settings is 'Table containing configuration parameters, including console and other component settings';

comment on column public.settings.setting_name is 'The key of the setting';

comment on column public.settings.setting_value is 'The value of the setting';

comment on column public.settings.created_at is 'The timestamp when the setting was created';

comment on column public.settings.updated_at is 'The timestamp when the setting was last updated';

create trigger handle_updated_at
  before update on public.settings for each row
  execute function extensions.moddatetime (updated_at);

create index settings_name_idx on public.settings (setting_name);

-- +goose Down
-- Drop triggers
drop trigger update_server_count_trigger on public.servers;

drop trigger handle_updated_at on public.servers;

drop trigger handle_updated_at on public.clusters;

drop trigger handle_updated_at on public.environments;

drop trigger handle_updated_at on public.projects;

drop trigger handle_updated_at on public.secrets;

drop trigger handle_updated_at on public.cloud_images;

drop trigger handle_updated_at on public.cloud_volumes;

drop trigger handle_updated_at on public.cloud_instances;

drop trigger handle_updated_at on public.operations;

-- Drop functions
drop function update_server_count;

drop function get_extensions;

drop function get_secret;

drop function add_secret;

drop function get_cluster_name;

-- Drop views
drop view public.v_operations;

drop view public.v_secrets_list;

-- Drop tables
drop table public.postgres_versions;

drop table public.operations;

drop table public.extensions;

drop table public.servers;

drop table public.clusters;

drop table public.secrets;

drop table public.environments;

drop table public.projects;

drop table public.cloud_images;

drop table public.cloud_volumes;

drop table public.cloud_instances;

drop table public.cloud_regions;

drop table public.cloud_providers;

drop table public.settings;
