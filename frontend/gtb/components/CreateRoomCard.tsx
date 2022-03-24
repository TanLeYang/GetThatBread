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
      <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <button className="w-full sm:w-auto focus:ring-4 focus:outline-none  text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700">
          onClick={onCreateRoomClick}
          <svg
            className="mr-3 w-7 h-7"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="apple"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              fill="currentColor"
              d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
            ></path>
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
    </CallToActionCard>
  )
}

export default CreateRoomCard
