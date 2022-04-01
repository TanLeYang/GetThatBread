interface OfflineModalProps {
  show: boolean
  onClose: () => void
}

const OfflineModal: React.FunctionComponent<OfflineModalProps> = ({ show, onClose }) => {
  const showHideClassName = show ? "" : "hidden"

  return (
    <div
      aria-hidden="true"
      className={`${showHideClassName} overflow-y-auto overflow-x-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50`}
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="relative rounded-lg shadow bg-gray-600">
          <div className="flex justify-between items-start p-5 rounded-t border-b border-gray-600">
            <h3 className="text-xl font-semibold lg:text-2xl text-white">Sorry, we are offline!</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-base leading-relaxed text-gray-400">
              Due to server costs, the application is currently not running
            </p>
            <p className="text-base leading-relaxed text-gray-400">
              {"You can check out the GitHub repo "}
              <a className="text-white" href="https://github.com/TanLeYang/GetThatBread">
                here
              </a>
            </p>
            <p className="text-base leading-relaxed text-gray-400">
              {"Or check out the video demo "}
              <a className="text-white" href="https://youtu.be/2Yz3tOgO2xQ">
                here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfflineModal
