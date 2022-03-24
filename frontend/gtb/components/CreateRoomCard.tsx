import { useRouter } from "next/router"
import { useState } from "react"
import { createRoom } from "../services/room"
import CallToActionCard from "./CallToActionCard"

const CreateRoomCard: React.FunctionComponent = ({}) => {
  const router = useRouter()

  const [showingRoomCreationWarning, setShowingRoomCreationWarning] =
    useState(false)

  const onCreateRoomClick = async () => {
    const roomCode = await createRoom()
    if (!roomCode) {
      setShowingRoomCreationWarning(true)
      return
    }

    router.push(`/room/${roomCode}`)
  }

  return (
    <CallToActionCard
      title="Create a new Room"
      subtitle="Get started by creating a new room and giving your interview buddies the unique Room Code!"
    >
      <>
        <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
          <button
            className="w-full sm:w-auto focus:ring-4 focus:outline-none text-white rounded-lg inline-flex
              items-center justify-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700"
            onClick={onCreateRoomClick}
          >
            <svg
              className="mr-3 w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              viewBox="0 0 24 24"
              role="img"
              data-name="Layer 1"
            >
              <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" />
            </svg>
            <div className="text-left">
              <div className="mb-1 text-xs"> Create Room </div>
            </div>
          </button>
        </div>
        {showingRoomCreationWarning && (
          <h1 className="text-red-400">
            Sorry, something went wrong, please try again
          </h1>
        )}
      </>
    </CallToActionCard>
  )
}

export default CreateRoomCard
