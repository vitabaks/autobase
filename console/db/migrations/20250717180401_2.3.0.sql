-- +goose Up

-- Update AWS Cloud Images for Ubuntu 24.04 LTS
-- ap-south-2
update public.cloud_images set
  image = '{"server_image": "ami-03b47157da4a18cde"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-south-2'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-south-1
update public.cloud_images set
  image = '{"server_image": "ami-008a9f4478d7401d4"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-south-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- eu-south-1
update public.cloud_images set
  image = '{"server_image": "ami-07d7afd2acb82e70e"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'eu-south-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- eu-south-2
update public.cloud_images set
  image = '{"server_image": "ami-00a59fc51fd75463c"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'eu-south-2'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- me-central-1
update public.cloud_images set
  image = '{"server_image": "ami-09538722b5b793ca3"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'me-central-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- il-central-1
update public.cloud_images set
  image = '{"server_image": "ami-0cd79dbb3eaef0045"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'il-central-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ca-central-1
update public.cloud_images set
  image = '{"server_image": "ami-057553de36b2a6c5b"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ca-central-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- eu-central-1
update public.cloud_images set
  image = '{"server_image": "ami-0083ee179c14acc6a"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'eu-central-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- eu-central-2
update public.cloud_images set
  image = '{"server_image": "ami-063ea77defbf3727d"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'eu-central-2'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- us-west-1
update public.cloud_images set
  image = '{"server_image": "ami-025a9b1af952cc749"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'us-west-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- us-west-2
update public.cloud_images set
  image = '{"server_image": "ami-01c276c8e835125d1"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'us-west-2'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- af-south-1
update public.cloud_images set
  image = '{"server_image": "ami-063bef57e63e86367"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'af-south-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- eu-north-1
update public.cloud_images set
  image = '{"server_image": "ami-081c358c86e68b9f9"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'eu-north-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- eu-west-3
update public.cloud_images set
  image = '{"server_image": "ami-030826f078c241671"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'eu-west-3'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- eu-west-2
update public.cloud_images set
  image = '{"server_image": "ami-0f265232bb30eb888"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'eu-west-2'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- eu-west-1
update public.cloud_images set
  image = '{"server_image": "ami-0416cbe3c21834f41"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'eu-west-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-northeast-3
update public.cloud_images set
  image = '{"server_image": "ami-0e5b7ca16b8086726"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-northeast-3'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-northeast-2
update public.cloud_images set
  image = '{"server_image": "ami-0ba850ad6ad32d6e0"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-northeast-2'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- me-south-1
update public.cloud_images set
  image = '{"server_image": "ami-0e02ffe41fa738e87"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'me-south-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-northeast-1
update public.cloud_images set
  image = '{"server_image": "ami-0e456f26c8741e2b4"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-northeast-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- sa-east-1
update public.cloud_images set
  image = '{"server_image": "ami-09b393c8db1fbb755"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'sa-east-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-east-1
update public.cloud_images set
  image = '{"server_image": "ami-0b5e9dc3f79ec7359"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-east-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ca-west-1
update public.cloud_images set
  image = '{"server_image": "ami-0b1a03dab6443eac7"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ca-west-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-southeast-1
update public.cloud_images set
  image = '{"server_image": "ami-0b874c2ac1b5e9957"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-southeast-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-southeast-2
update public.cloud_images set
  image = '{"server_image": "ami-06b9ad502c09cc0dc"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-southeast-2'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-southeast-3
update public.cloud_images set
  image = '{"server_image": "ami-046d78da06d17839a"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-southeast-3'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- ap-southeast-4
update public.cloud_images set
  image = '{"server_image": "ami-082c6a6fdad2ce260"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'ap-southeast-4'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- us-east-1
update public.cloud_images set
  image = '{"server_image": "ami-034568121cfdea9c3"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'us-east-1'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- us-east-2
update public.cloud_images set
  image = '{"server_image": "ami-0057c7861f0e3dfa1"}',
  updated_at = '2025-06-27'
where cloud_provider = 'aws'
  and region = 'us-east-2'
  and arch = 'amd64'
  and os_name = 'Ubuntu'
  and os_version = '24.04 LTS';

-- +goose Down
