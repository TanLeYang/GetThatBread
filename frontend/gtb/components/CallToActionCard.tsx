interface CallToActionCardProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

const CallToActionCard: React.FunctionComponent<CallToActionCardProps> = ({
  title,
  subtitle,
  children
}) => {
  return (
    <div className="p-4 w-full text-center rounded-lg border shadow-md sm:p-8 bg-gray-800 border-gray-700">
      <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="mb-5 text-base sm:text-lg text-gray-400">{subtitle}</p>
      {children}
    </div>
  )
}

export default CallToActionCard
