-- +goose Up

-- Add missing cloud regions
insert into public.cloud_regions (cloud_provider, region_group, region_name, region_description)
values
	('aws', 'Middle East', 'il-central-1', 'Israel (Tel Aviv)'),
	('aws', 'Asia Pacific', 'ap-east-2', 'Asia Pacific (Taipei)'),
	('aws', 'North America', 'mx-central-1', 'Mexico (Central)'),
	('aws', 'Asia Pacific', 'ap-southeast-5', 'Asia Pacific (Malaysia)'),
	('aws', 'Asia Pacific', 'ap-southeast-6', 'Asia Pacific (New Zealand)'),
	('aws', 'Asia Pacific', 'ap-southeast-7', 'Asia Pacific (Thailand)'),
	('gcp', 'Asia Pacific', 'asia-southeast3', 'Kuala Lumpur'),
	('gcp', 'Europe', 'europe-north2', 'Stockholm'),
	('gcp', 'North America', 'northamerica-south1', 'Querétaro'),
	('azure', 'Asia Pacific', 'indonesiacentral', 'Indonesia Central (Jakarta)'),
	('azure', 'Asia Pacific', 'malaysiawest', 'Malaysia West (Kuala Lumpur)'),
	('azure', 'Asia Pacific', 'newzealandnorth', 'New Zealand North (Auckland)'),
	('azure', 'Europe', 'austriaeast', 'Austria East (Vienna)'),
	('azure', 'Europe', 'belgiumcentral', 'Belgium Central (Brussels)'),
	('azure', 'Europe', 'denmarkeast', 'Denmark East (Copenhagen)'),
	('azure', 'Europe', 'spaincentral', 'Spain Central (Madrid)'),
	('azure', 'South America', 'chilecentral', 'Chile Central (Santiago)'),
	('azure', 'Middle East', 'israelcentral', 'Israel Central (Israel)'),
	('azure', 'North America', 'eastus2euap', 'East US 2 EUAP'),
	('azure', 'North America', 'centraluseuap', 'Central US EUAP'),
	('azure', 'North America', 'southcentralusstg', 'South Central US STG (Texas)'),
	('digitalocean', 'North America', 'nyc2', 'New York (Datacenter 2)'),
	('digitalocean', 'North America', 'atl1', 'Atlanta (Datacenter 1)'),
	('digitalocean', 'North America', 'ric1', 'Richmond (Datacenter 1)')
on conflict (cloud_provider, region_group, region_name) do nothing;

-- Refresh AWS AMI images for Ubuntu 24.04 LTS (amd64)
delete from public.cloud_images where cloud_provider = 'aws';
insert into public.cloud_images (cloud_provider, region, image, arch, os_name, os_version, updated_at)
values
	('aws', 'ap-south-2', '{"server_image": "ami-0f1eb51c8a4c3ac60"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-south-1', '{"server_image": "ami-0c6a8bbb64f907189"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'eu-south-1', '{"server_image": "ami-05f89ccb4827b5234"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'eu-south-2', '{"server_image": "ami-0bd1c60023dc3e9c9"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'me-central-1', '{"server_image": "ami-037440f09b2e6279a"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'il-central-1', '{"server_image": "ami-0370e3af9df72345d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ca-central-1', '{"server_image": "ami-0e48eec08dac66ad2"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-east-2', '{"server_image": "ami-037cfddefa7e6b601"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'mx-central-1', '{"server_image": "ami-0d1705881c1e1eb08"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'eu-central-1', '{"server_image": "ami-0a34e782429d5097d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'eu-central-2', '{"server_image": "ami-09bb8015a8496d989"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'us-west-1', '{"server_image": "ami-0cf73781b6c6cd5f9"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'us-west-2', '{"server_image": "ami-09222573bc99a7788"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'af-south-1', '{"server_image": "ami-09acf924bcf7f590d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'eu-north-1', '{"server_image": "ami-0dab98137e5c11cb8"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'eu-west-3', '{"server_image": "ami-08c0fc05da0179c6e"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'eu-west-2', '{"server_image": "ami-04ad8503c515466ae"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'eu-west-1', '{"server_image": "ami-03957e4cfe042cca1"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-northeast-3', '{"server_image": "ami-0e1ef3a35b4c32c61"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-northeast-2', '{"server_image": "ami-06a2a4eea59e6fc7c"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'me-south-1', '{"server_image": "ami-0913d2bad3cb84d85"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-northeast-1', '{"server_image": "ami-0c20109cc7514960f"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'sa-east-1', '{"server_image": "ami-029d90a463a4708ca"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-east-1', '{"server_image": "ami-00ed01983bf9b75d2"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ca-west-1', '{"server_image": "ami-00900251f26ac94ea"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-southeast-1', '{"server_image": "ami-0d17372de612983fe"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-southeast-2', '{"server_image": "ami-095e8c26af3940dc2"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-southeast-3', '{"server_image": "ami-010a26be9c9a6481d"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-southeast-4', '{"server_image": "ami-091bd5fffa5c5898a"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'us-east-1', '{"server_image": "ami-04eaa218f1349d88b"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-southeast-5', '{"server_image": "ami-0cbf74fed29804bdc"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-southeast-6', '{"server_image": "ami-0f196951ed21791f3"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'us-east-2', '{"server_image": "ami-0d6d5a1f326b57cb0"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21'),
	('aws', 'ap-southeast-7', '{"server_image": "ami-0c17d76d9d655128e"}', 'amd64', 'Ubuntu', '24.04 LTS', '2026-03-21');

-- +goose Down
