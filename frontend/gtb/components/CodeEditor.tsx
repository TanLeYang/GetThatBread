import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

interface CodeEditorProps {
  value: string,
  onChange: (newValue: string) => void
}

const CodeEditor: React.FunctionComponent<CodeEditorProps> = ({ value, onChange }) => {
  return (
    <AceEditor
      placeholder="Start Coding!"
      mode="python"
      theme="monokai"
      name="blah2"
      onChange={onChange}
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={value}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  )
}

export default CodeEditor