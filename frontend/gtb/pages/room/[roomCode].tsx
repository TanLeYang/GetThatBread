import { NextPage } from "next";
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { useState, useEffect, useCallback } from "react"
import { io, Socket } from "socket.io-client";
import { CodeModifiedMessage, CodeState } from "../../constants/types/coding";
import { codeModifiedEvent, joinRoomEvent } from "../../constants/types/socket_api";
const CodeEditor = dynamic(import("../../components/CodeEditor"), {ssr: false})

const Room: NextPage = () => {

  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [code, setCode] = useState("")
  const [socket, setSocket] = useState<Socket|null>(null)

  useEffect(() => {
    if (!router.isReady) return

    const { roomCode } = router.query
    const roomCodeStr = getRoomCodeStr(roomCode)
    setRoomCode(roomCodeStr)

    const newSocket = io("ws://localhost:5000")

    newSocket.emit(joinRoomEvent, roomCodeStr)

    newSocket.on(codeModifiedEvent, (codeState: CodeState) => {
      setCode(codeState.code)
    })

    setSocket(newSocket)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, setSocket])

  const onCodeChange = (newCode: string) => {
    const codeModifiedMessage: CodeModifiedMessage = {
      roomCode: getRoomCodeStr(roomCode),
      codeState: {
        code: newCode,
        language: "PYTHON"
      }
    }

    socket?.emit("informCodeModified", codeModifiedMessage)
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