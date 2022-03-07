export type CodeLanguage = "PYTHON" | ""

export type CodeState = {
  code: string
  language: CodeLanguage
}

export type CodeModifiedMessage = {
  roomCode: string
  codeState: CodeState
}