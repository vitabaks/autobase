import { SSH_KEY_BLOCK_FIELD_NAMES } from '@entities/cluster/ssh-key-block/model/const.ts';

export interface SshKeyBlockValues {
  [SSH_KEY_BLOCK_FIELD_NAMES.SSH_PUBLIC_KEY]?: string;
}
