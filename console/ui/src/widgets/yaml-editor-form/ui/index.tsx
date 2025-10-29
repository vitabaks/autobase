import { FC, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Box } from '@mui/material';
import { editor } from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

const YamlEditorForm: FC = () => {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: IStandaloneCodeEditor) {
    editorRef.current = editor;
    editorRef.current.focus();
  }

  return (
    <Box height="90vh">
      <Editor defaultLanguage="yaml" height="90vh" defaultValue="// some comment" onMount={handleEditorDidMount} />
    </Box>
  );
};

export default YamlEditorForm;
