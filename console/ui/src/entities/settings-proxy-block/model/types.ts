import { SETTINGS_FORM_FIELDS_NAMES } from '@entities/settings-proxy-block/model/constants.ts';

export interface SettingsFormValues {
  [SETTINGS_FORM_FIELDS_NAMES.HTTP_PROXY]: string;
  [SETTINGS_FORM_FIELDS_NAMES.HTTPS_PROXY]: string;
  [SETTINGS_FORM_FIELDS_NAMES.IS_EXPERT_MODE_ENABLED]: boolean;
}
