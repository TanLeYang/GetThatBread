import { NextPage } from "next";
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client";
import { CodeModifiedMessage, CodeState, SaveCodeMessage, CodeExecutionMessage } from "../../constants/types/coding";
import { codeExecutionResultEvent, codeModifiedEvent, informCodeModifiedEvent, initialStateEvent, joinRoomEvent, saveCodeEvent } from "../../constants/socketEvents";
import Spinner from "../../components/Spinner";
import { PeerState, useVideoSocket } from "../../hooks/VideoSocket";
const CodeEditor = dynamic(import("../../components/CodeEditor"), {ssr: false})

const Room: NextPage = () => {

  const saveCodeInterval = 5000
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isLoadingOutput, setIsLoadingOutput] = useState(false)
  const [socket, setSocket] = useState<Socket|null>(null)
  const { myVideo, peers } = useVideoSocket("abc", "Ly")

  const latestOutput = useRef(output)

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
      setIsLoadingOutput(false)
      setOutput(prev => {
        latestOutput.current = prev + "\n" + newOutput
        return latestOutput.current
      })
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
    setIsLoadingOutput(true)
    const codeState: CodeExecutionMessage = {
      roomCode: getRoomCodeStr(roomCode),
      codeState: {
        code: code,
        language: "PYTHON"
      }
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

        <div>
          <video className="h-20 w-20" muted autoPlay playsInline ref={myVideo}/>
          { peers.map((peer, idx) => {
            return (
              <Video key={idx} peer={peer}/>
            )
          })}
        </div>
      </div>
      <div className="flex flex-row">
        <div className="bg-gray-500 mr-5 p-1 flex-grow max-h-24 overflow-y-auto overflow-x-hidden">
          <p className="whitespace-pre-wrap">
            {output}
          </p>
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

          { isLoadingOutput && <Spinner/> }
        </div>
      </div>
    </div>
  )
}

interface VideoProps {
  peer: PeerState
}

const Video: React.FunctionComponent<VideoProps> = ({ peer } ) => {
  const ref = useRef<any>()

  useEffect(() => {
    peer.instance.on("stream", (stream: MediaStream) => {
      if (ref.current) {
        ref.current.srcObject = stream
      }
    })
  })

  return (
    <video className="h-20 w-20" playsInline autoPlay ref={ref} />
  )
}

const getRoomCodeStr = (roomCode: string | string[] | undefined): string => {
  if (roomCode == undefined || Array.isArray(roomCode)) {
    return ""
  }

  return roomCode
}

export default Room