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
    <>
      <CodeEditor
        value={code}
        onChange={onCodeChange}
      />
    </>
  )
}

export default Room