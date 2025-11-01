import AWSIcon from '../assets/aws.svg';
import GCPIcon from '../assets/gcp.svg';
import AzureIcon from '../assets/azure.svg';
import DigitalOceanIcon from '../assets/digitalocean.svg';
import HetznerIcon from '../assets/hetzner.svg';
import { PROVIDERS } from '@shared/config/constants.ts';

export const useNameIconProvidersMap = () => ({
  // TODO: refactor into moving from hooks to constant
  [PROVIDERS.AWS]: AWSIcon,
  [PROVIDERS.GCP]: GCPIcon,
  [PROVIDERS.AZURE]: AzureIcon,
  [PROVIDERS.DIGITAL_OCEAN]: DigitalOceanIcon,
  [PROVIDERS.HETZNER]: HetznerIcon,
});
