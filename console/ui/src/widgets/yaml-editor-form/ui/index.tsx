import { FC, useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import DefaultFormButtons from '@shared/ui/default-form-buttons';
import { useTranslation } from 'react-i18next';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  YAML_EDITOR_FORM_DEFAULT_VALUES,
  YAML_EDITOR_FORM_FIELD_NAMES,
} from '@widgets/yaml-editor-form/model/const.ts';
import { YamlEditorFormValues } from '@widgets/yaml-editor-form/model/types.ts';
import { Box, Stack, useTheme } from '@mui/material';
import * as YAML from 'yaml';
import ErrorBox from '@shared/ui/error-box/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { mapFormValuesToYamlEditor } from '@widgets/yaml-editor-form/lib/functions.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import ClusterSecretModal from '@features/cluster-secret-modal';
import { useFormSubmit } from '@widgets/yaml-editor-form/lib/hooks.tsx';
import { useGetSecretsQuery } from '@shared/api/api/secrets.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import { yamlFormSchema } from '@widgets/yaml-editor-form/model/validation.ts';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

const YamlEditorForm: FC = () => {
  const theme = useTheme();
  const { t } = useTranslation('clusters');
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const navigate = useNavigate();
  const currentProject = useAppSelector(selectCurrentProject);
  const [parsedYamlEditorValues, setParsedYamlEditorValues] = useState({});

  const { control, handleSubmit, formState, setValue } = useForm<YamlEditorFormValues>({
    mode: 'all',
    resolver: yupResolver(yamlFormSchema),
    defaultValues: YAML_EDITOR_FORM_DEFAULT_VALUES,
  });

  const watchUiValues = useWatch();
  const watchYamlFormValues = useWatch({ control });

  const secrets = useGetSecretsQuery({
    type: watchUiValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code,
    projectId: currentProject,
  });

  const [isFormSubmitting, submit] = useFormSubmit({ secrets: secrets.data });

  function handleEditorDidMount(editor: IStandaloneCodeEditor) {
    editorRef.current = editor;
    editorRef.current.focus();
  }

  const cancelHandler = () => navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));

  const { isValid, isSubmitting } = formState;

  useEffect(() => {
    setValue(
      YAML_EDITOR_FORM_FIELD_NAMES.EDITOR,
      YAML.stringify(mapFormValuesToYamlEditor(watchUiValues), { sortMapEntries: true }),
      { shouldValidate: true },
    );
  }, []);

  useEffect(() => {
    try {
      setParsedYamlEditorValues(YAML.parse(watchYamlFormValues[YAML_EDITOR_FORM_FIELD_NAMES.EDITOR]));
    } catch (e) {
      console.error(e);
    }
  }, [watchYamlFormValues]);

  const submitHandler = () =>
    submit({
      values: watchUiValues,
      customExtraVars: parsedYamlEditorValues,
    });

  return (
    <ErrorBoundary fallback={<ErrorBox />}>
      <Box width="100%">
        <form
          onSubmit={
            watchUiValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code !== PROVIDERS.LOCAL && secrets?.data?.length !== 1
              ? undefined
              : handleSubmit(submitHandler)
          }>
          <Stack gap={2}>
            <Controller
              control={control}
              name={YAML_EDITOR_FORM_FIELD_NAMES.EDITOR}
              render={({ field }) => (
                <Editor
                  {...field}
                  defaultLanguage="yaml"
                  height="75vh"
                  onMount={handleEditorDidMount}
                  theme={theme.palette.mode === 'light' ? 'vs' : 'vs-dark'}
                />
              )}
            />
            {(watchUiValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code !== PROVIDERS.LOCAL ||
              parsedYamlEditorValues?.cloud_provider) &&
            secrets?.data?.length !== 1 ? (
              <ClusterSecretModal isClusterFormDisabled={!isValid} yamlEditorValues={parsedYamlEditorValues} />
            ) : (
              <DefaultFormButtons
                isDisabled={!isValid}
                isSubmitting={isSubmitting || isFormSubmitting}
                cancelHandler={cancelHandler}
                submitButtonLabel={t('createCluster')}
              />
            )}
          </Stack>
        </form>
      </Box>
    </ErrorBoundary>
  );
};

export default YamlEditorForm;
