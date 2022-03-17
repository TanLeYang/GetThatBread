export type CodeLanguage = "PYTHON" | ""

export type CodeState = {
  code: string
  language: CodeLanguage
}

export type CodeModifiedMessage = {
  roomCode: string
  codeState: CodeState
}

export type CodeExecutionMessage = {
  roomCode: string
  codeState: CodeState
}

export type SaveCodeMessage = {
  roomCode: string
  codeState: CodeState
}