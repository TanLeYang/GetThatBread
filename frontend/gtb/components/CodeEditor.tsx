import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";

interface CodeEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const CodeEditor: React.FunctionComponent<CodeEditorProps> = ({
  value,
  onChange,
}) => {
  return (
    <AceEditor
      className="flex-grow"
      placeholder="Start Coding!"
      mode="python"
      theme="twilight"
      name="codeEditor"
      onChange={onChange}
      fontSize={16}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      value={value}
      setOptions={{
        showLineNumbers: true,
        behavioursEnabled: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        tabSize: 2,
      }}
      wrapEnabled={true}
      height="95%"
    />
  );
};

export default CodeEditor;
