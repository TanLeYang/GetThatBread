import { NextPage } from "next";
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { useState } from "react"
const CodeEditor = dynamic(import("../../components/CodeEditor"), {ssr: false})

const Room: NextPage = () => {

  const router = useRouter()
  const { roomCode } = router.query

  const [code, setCode] = useState("")

  const onCodeChange = (newCode: string) => {
    console.log(newCode)
    setCode(newCode)
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