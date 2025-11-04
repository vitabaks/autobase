import { FC, useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import DefaultFormButtons from '@shared/ui/default-form-buttons';
import { useTranslation } from 'react-i18next';
import { generateAbsoluteRouterPath, handleRequestErrorCatch } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  YAML_EDITOR_FORM_DEFAULT_VALUES,
  YAML_EDITOR_FORM_FIELD_NAMES,
} from '@widgets/yaml-editor-form/modal/const.ts';
import { YamlEditorFormValues } from '@widgets/yaml-editor-form/modal/types.ts';
import { RequestClusterCreate, usePostClustersMutation } from '@/shared/api/api/clusters';
import { Box, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import * as YAML from 'yaml';
import ErrorBox from '@shared/ui/error-box/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { mapFormValuesToYamlEditor } from '@widgets/yaml-editor-form/lib/functions.ts';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

const YamlEditorForm: FC = () => {
  const { t } = useTranslation('clusters');
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const navigate = useNavigate();

  const values = useWatch();

  const [postClusterTrigger, postClusterTriggerState] = usePostClustersMutation();

  const { control, handleSubmit, formState, setValue } = useForm<YamlEditorFormValues>({
    mode: 'all',
    defaultValues: YAML_EDITOR_FORM_DEFAULT_VALUES,
  });

  function handleEditorDidMount(editor: IStandaloneCodeEditor) {
    editorRef.current = editor;
    editorRef.current.focus();
  }

  const onSubmit = async (values: YamlEditorFormValues) => {
    try {
      await postClusterTrigger({
        requestClusterCreate: YAML.parse(values[YAML_EDITOR_FORM_FIELD_NAMES.EDITOR]) as RequestClusterCreate,
      }).unwrap();
      toast.info(t('clusterSuccessfullyCreated', { ns: 'toasts' }));
      await navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  const cancelHandler = () => navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));

  const { isValid, isSubmitting } = formState;

  useEffect(() => {
    setValue(YAML_EDITOR_FORM_FIELD_NAMES.EDITOR, YAML.stringify(mapFormValuesToYamlEditor(values)));
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorBox />}>
      <Box width="100%">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  theme="vs-dark"
                />
              )}
            />
            <DefaultFormButtons
              isDisabled={!isValid}
              isSubmitting={isSubmitting || postClusterTriggerState.isLoading}
              cancelHandler={cancelHandler}
              submitButtonLabel={t('createCluster')}
            />
          </Stack>
        </form>
      </Box>
    </ErrorBoundary>
  );
};

export default YamlEditorForm;
