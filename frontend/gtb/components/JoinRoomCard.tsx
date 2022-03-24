import { useRouter } from "next/router"
import { useState } from "react"
import { checkRoomExists } from "../services/room"
import CallToActionCard from "./CallToActionCard"

const JoinRoomCard: React.FunctionComponent = () => {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [showingRoomCodeWarning, setShowingRoomCodeWarning] = useState(false)

  const onJoinRoomClick = async () => {
    const roomExists = await checkRoomExists(roomCode)
    if (!roomExists) {
      setShowingRoomCodeWarning(true)
      return
    }

    router.push(`room/${roomCode}`)
  }

  return (
    <CallToActionCard
      title={"Join an existing Room"}
      subtitle={"Join an existing room by entering the unique Room Code!"}
    >
      <>
        <div className="flex justify-center space-x-14">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Room Code
            <input
              type="text"
              className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400
          text-white focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setRoomCode(e.target.value)}
              required
            />
          </label>
          <button
            className="w-full sm:w-auto focus:ring-4 focus:outline-none text-white rounded-lg inline-flex
          items-center justify-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700"
            onClick={onJoinRoomClick}
          >
            <svg
              className="mr-3 w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g id="_01_align_center" data-name="01 align center">
                <path d="M2,21V3A1,1,0,0,1,3,2H8V0H3A3,3,0,0,0,0,3V21a3,3,0,0,0,3,3H8V22H3A1,1,0,0,1,2,21Z" />
                <path d="M24,13l0-2-16.444.031,4.323-4.324L10.463,5.293,5.877,9.879a3,3,0,0,0,0,4.242l4.586,4.586,1.414-1.414L7.614,13.03Z" />
              </g>
            </svg>
            <div className="text-left">
              <div className="mb-1 text-xs"> Join Room </div>
            </div>
          </button>
        </div>
        {showingRoomCodeWarning && (
          <h1 className="text-red-400 mt-3">
            No room found, please check the room code again
          </h1>
        )}
      </>
    </CallToActionCard>
  )
}

export default JoinRoomCard
