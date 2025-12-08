import * as yup from 'yup';
import { YAML_EDITOR_FORM_FIELD_NAMES } from '@widgets/yaml-editor-form/model/const.ts';
import * as YAML from 'yaml';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';

export const yamlFormSchema = yup.object({
  [YAML_EDITOR_FORM_FIELD_NAMES.EDITOR]: yup
    .string()
    .when(CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE, ([creationType], schema) =>
      creationType !== 'yaml'
        ? schema.test('shouldBeCorrectYaml', (value) => {
            try {
              if (value?.length) {
                YAML.parse(value);
                return true;
              }
              return false;
            } catch (e) {
              console.error(e);
              return false;
            }
          })
        : schema.notRequired(),
    ),
});
