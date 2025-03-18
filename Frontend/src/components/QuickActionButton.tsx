import React from 'react'

type QuickActionButtonProps = {
  label: string
  icon: React.ReactNode
  bgColor: string
  onClick: () => void
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  icon,
  bgColor,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 py-1 px-2 rounded-lg ${bgColor} text-white`}
  >
    {icon}
    {label}
  </button>
)

export default QuickActionButton
