import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { CodeModifiedMessage, CodeExecutionMessage } from "../../constants/types/coding";
import { informCodeModifiedEvent } from "../../constants/socketEvents";
import Spinner from "../../components/Spinner";
import { PeerState, useVideoSocket } from "../../hooks/VideoSocket";
import { useCodingSocket } from "../../hooks/CodingSocket";
const CodeEditor = dynamic(import("../../components/CodeEditor"), {ssr: false})

interface RoomProps {
  roomCode: string
}

const Room: NextPage<RoomProps> = ({ roomCode }) => {

  const { code, output, isLoadingOutput, setIsLoadingOutput, codingSocketRef } = useCodingSocket(roomCode)
  const { myVideo, peers } = useVideoSocket(roomCode, "Ly")

  const onCodeChange = (newCode: string) => {
    const codeModifiedMessage: CodeModifiedMessage = {
      roomCode,
      codeState: {
        code: newCode,
        language: "PYTHON"
      }
    }

    codingSocketRef.current?.emit(informCodeModifiedEvent, codeModifiedMessage)
  }

  const onCodeSubmission = () => {
    setIsLoadingOutput(true)
    const codeState: CodeExecutionMessage = {
      roomCode,
      codeState: {
        code: code,
        language: "PYTHON"
      }
    }

    codingSocketRef.current?.emit("executeCode", codeState)
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roomCode = context.params?.roomCode as string || "ROOM CODE"

  return {
    props: {
      roomCode
    }
  }
}

export default Room