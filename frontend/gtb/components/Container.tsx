const Container: React.FunctionComponent = ({ children }) => {
  return (
    <div className="bg-gray-700 h-full w-full fixed top-0 bottom-0 z-50">
      {children}
    </div>
  )
}

export default Container