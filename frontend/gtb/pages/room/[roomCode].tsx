import { NextPage } from "next";
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { useState, useEffect, useCallback } from "react"
import { io, Socket } from "socket.io-client";
import { CodeModifiedMessage, CodeState } from "../../constants/types/coding";
const CodeEditor = dynamic(import("../../components/CodeEditor"), {ssr: false})

const Room: NextPage = () => {

  const router = useRouter()
  const { roomCode } = router.query

  const [code, setCode] = useState("")
  const [socket, setSocket] = useState<Socket|null>(null)

  useEffect(() => {
    const newSocket = io("ws://localhost:5000")

    newSocket.emit("joinRoom", "abc")

    newSocket.on("codeModified", (codeState: CodeState) => {
      console.log("hi!", codeState.code)
      setCode(codeState.code)
    })

    setSocket(newSocket)
  }, [setSocket])


  const onCodeChange = (newCode: string) => {
    console.log(newCode)
    // setCode(newCode)
    const codeModifiedMessage: CodeModifiedMessage = {
      roomCode: "abc",
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

export default Room