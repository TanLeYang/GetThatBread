import http from "http"
import { Server, Socket } from "socket.io"
import { CodeState } from "./coding";

export interface ServerToClientEvents {
  codeModified: (newCodeState: CodeState) => void
  initialState: (initialCodeState: CodeState) => void
  codeExecutionResult: (output: string) => void
}

export interface ClientToServerEvents {
  joinRoom: (roomCode: string) => void
  informCodeModified: (codeState: CodeModifiedMessage) => void
  saveCode: (codeState: SaveCodeMessage) => void
  executeCode: (codeState: CodeState) => void
}

export type CodeModifiedMessage = {
  roomCode: string
  codeState: CodeState
}

export type SaveCodeMessage = {
  roomCode: string
  codeState: CodeState
}

export type SocketServerType = Server<ClientToServerEvents, ServerToClientEvents>
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents>

export function initializeSocketServer(
  server: http.Server,
): SocketServerType {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  })
  return io
}
