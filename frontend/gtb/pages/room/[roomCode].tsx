import { NextPage } from "next";
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { io, Socket } from "socket.io-client";
import { CodeModifiedMessage, CodeState, SaveCodeMessage } from "../../constants/types/coding";
import { codeExecutionResultEvent, codeModifiedEvent, informCodeModifiedEvent, initialStateEvent, joinRoomEvent, saveCodeEvent } from "../../constants/types/socket_events";
const CodeEditor = dynamic(import("../../components/CodeEditor"), {ssr: false})

const Room: NextPage = () => {

  const saveCodeInterval = 5000
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [socket, setSocket] = useState<Socket|null>(null)

  useEffect(() => {
    if (!router.isReady) return

    const { roomCode } = router.query
    const roomCodeStr = getRoomCodeStr(roomCode)
    setRoomCode(roomCodeStr)

    const codingSocket = io("ws://localhost:5001")

    codingSocket.emit(joinRoomEvent, roomCodeStr)

    codingSocket.on(codeModifiedEvent, (codeState: CodeState) => {
      setCode(codeState.code)
    })

    codingSocket.on(initialStateEvent, (codeState: CodeState) => {
      setCode(codeState.code)
    })

    codingSocket.on(codeExecutionResultEvent, (newOutput: string) => {
      setOutput(output + "\n" + newOutput)
    })

    setSocket(codingSocket)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, setSocket])

  // periodically save code
  useEffect(() => {
    if (socket == null || roomCode == "") return

    const saveCodeMessage: SaveCodeMessage = {
      roomCode,
      codeState: {
        code: code,
        language: "PYTHON"
      }
    }

    const interval = setInterval(() => {
      socket.emit(saveCodeEvent, saveCodeMessage)
    }, saveCodeInterval)

    return () => {
      clearInterval(interval)
    }
  }, [socket, code, roomCode])

  const onCodeChange = (newCode: string) => {
    const codeModifiedMessage: CodeModifiedMessage = {
      roomCode: getRoomCodeStr(roomCode),
      codeState: {
        code: newCode,
        language: "PYTHON"
      }
    }

    socket?.emit(informCodeModifiedEvent, codeModifiedMessage)
  }

  const onCodeSubmission = () => {
    const codeState: CodeState = {
      code: code,
      language: "PYTHON"
    }

    socket?.emit("executeCode", codeState)
  }

  return (
    <div className="bg-gray-700 h-screen w-screen flex flex-col">
      <h3 className="text-white lg:text-left m-5"> Room Code: {roomCode} </h3>
      <div className="flex h-4/5">
        <CodeEditor
          value={code}
          onChange={onCodeChange}
        />

        <h1> VIDEO SECTION HERE! </h1>
      </div>
      <div className="flex flex-row">
        <div className="bg-gray-500 mr-5 p-1 flex-grow max-h-24 overflow-y-auto overflow-x-hidden">
          {output}
        </div>
        <div className="mr-20">
          <button
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300
                font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700
              dark:focus:ring-green-800"
            onClick={onCodeSubmission}
          >
            Run
          </button>
        </div>
      </div>
    </div>
  )
}

const getRoomCodeStr = (roomCode: string | string[] | undefined): string => {
  if (roomCode == undefined || Array.isArray(roomCode)) {
    return ""
  }

  return roomCode
}

export default Room