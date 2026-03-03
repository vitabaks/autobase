-- +goose Up

-- Update AWS Cloud Images for Ubuntu 24.04 LTS (Creation Date: 2026-02-18)

-- ap-south-2
update public.cloud_images set
	image = '{"server_image": "ami-0fb67e6212e8ff822"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-south-2'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-south-1
update public.cloud_images set
	image = '{"server_image": "ami-0a14f53a6fe4dfcd1"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-south-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- eu-south-1
update public.cloud_images set
	image = '{"server_image": "ami-0bbdb93491708e313"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'eu-south-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- eu-south-2
update public.cloud_images set
	image = '{"server_image": "ami-0c3a83484bc055a2d"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'eu-south-2'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- me-central-1
update public.cloud_images set
	image = '{"server_image": "ami-021ddb3a2c3b73eff"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'me-central-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- il-central-1
update public.cloud_images set
	image = '{"server_image": "ami-05a5f95a77432f4be"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'il-central-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ca-central-1
update public.cloud_images set
	image = '{"server_image": "ami-0f5ec6dfce1d71ca7"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ca-central-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- eu-central-1
update public.cloud_images set
	image = '{"server_image": "ami-005f97cc4a61dd3b4"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'eu-central-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- eu-central-2
update public.cloud_images set
	image = '{"server_image": "ami-00b2865eaa0b06568"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'eu-central-2'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- us-west-1
update public.cloud_images set
	image = '{"server_image": "ami-06b527a1e4cb6f265"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'us-west-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- us-west-2
update public.cloud_images set
	image = '{"server_image": "ami-0e5e1413a3bf2d262"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'us-west-2'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- af-south-1
update public.cloud_images set
	image = '{"server_image": "ami-058c1bfce526cdcc2"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'af-south-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- eu-north-1
update public.cloud_images set
	image = '{"server_image": "ami-0974a2c5ddf10f442"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'eu-north-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- eu-west-3
update public.cloud_images set
	image = '{"server_image": "ami-0bb8b77ad97138af1"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'eu-west-3'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- eu-west-2
update public.cloud_images set
	image = '{"server_image": "ami-0c17cb8e234335014"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'eu-west-2'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- eu-west-1
update public.cloud_images set
	image = '{"server_image": "ami-01d0334e94e895e89"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'eu-west-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-northeast-3
update public.cloud_images set
	image = '{"server_image": "ami-0ea874b1ea1d9ee7c"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-northeast-3'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-northeast-2
update public.cloud_images set
	image = '{"server_image": "ami-04f851a80be515079"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-northeast-2'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- me-south-1
update public.cloud_images set
	image = '{"server_image": "ami-0913d2bad3cb84d85"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'me-south-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-northeast-1
update public.cloud_images set
	image = '{"server_image": "ami-04ae19f2563b23082"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-northeast-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- sa-east-1
update public.cloud_images set
	image = '{"server_image": "ami-032ab7316dbf1ea74"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'sa-east-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-east-1
update public.cloud_images set
	image = '{"server_image": "ami-0752a85106a974158"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-east-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ca-west-1
update public.cloud_images set
	image = '{"server_image": "ami-077f338e4ec5157d1"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ca-west-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-southeast-1
update public.cloud_images set
	image = '{"server_image": "ami-0ed0867532b47cc2c"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-southeast-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-southeast-2
update public.cloud_images set
	image = '{"server_image": "ami-0312bcacbe51d03c8"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-southeast-2'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-southeast-3
update public.cloud_images set
	image = '{"server_image": "ami-07746edc25b4b8771"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-southeast-3'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- ap-southeast-4
update public.cloud_images set
	image = '{"server_image": "ami-04a57bb171a5e0828"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'ap-southeast-4'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- us-east-1
update public.cloud_images set
	image = '{"server_image": "ami-0071174ad8cbb9e17"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'us-east-1'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- us-east-2
update public.cloud_images set
	image = '{"server_image": "ami-0198cdf7458a7a932"}',
	updated_at = '2026-02-18'
where cloud_provider = 'aws'
	and region = 'us-east-2'
	and arch = 'amd64'
	and os_name = 'Ubuntu'
	and os_version = '24.04 LTS';

-- +goose Down
