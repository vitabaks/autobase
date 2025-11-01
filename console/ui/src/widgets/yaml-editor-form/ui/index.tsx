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
import { mapFormValuesToRequestFields } from '@features/cluster-secret-modal/lib/functions.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import * as YAML from 'yaml';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

const YamlEditorForm: FC = () => {
  const { t } = useTranslation('clusters');
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const navigate = useNavigate();

  const currentProject = useAppSelector(selectCurrentProject);
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
      await postClusterTrigger({ requestClusterCreate: values as RequestClusterCreate }).unwrap();
      toast.info(t('clusterSuccessfullyCreated', { ns: 'toasts' }));
      await navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  const cancelHandler = () => navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));

  const { isValid, isSubmitting } = formState;

  useEffect(() => {
    setValue(
      YAML_EDITOR_FORM_FIELD_NAMES.EDITOR,
      YAML.stringify(
        mapFormValuesToRequestFields({
          values,
          secretId: Number(values[CLUSTER_FORM_FIELD_NAMES.SECRET_ID]),
          projectId: Number(currentProject),
        }),
      ),
    );
  }, []);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <Controller
            control={control}
            name={YAML_EDITOR_FORM_FIELD_NAMES.EDITOR}
            render={({ field }) => (
              <Editor {...field} defaultLanguage="yaml" height="70vh" onMount={handleEditorDidMount} theme="vs-dark" />
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
  );
};

export default YamlEditorForm;
