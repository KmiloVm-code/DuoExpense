import React from 'react'

type StatCardProps = {
  title: string
  value: string
  icon: React.ReactNode
  type?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, type }) => (
  <>
    {type === 'mainCard' ? (
      <article
        className={
          'flex flex-col relative p-6 bg-[#9333EA] rounded-2xl shadow-md lg:col-span-2'
        }
      >
        <span className="flex items-center justify-between mb-3 w-full space-x-2">
          <h3 className="text-white text-base lg:text-lg font-bold">{title}</h3>
          <figure className="p-1 border rounded-full bg-[#fff3]">{icon}</figure>
        </span>
        <p className="text-white text-xl md:text-2xl lg:text-3xl font-extrabold mb-12">
          {value}
        </p>
      </article>
    ) : (
      <article className="flex flex-col relative p-6 bg-white rounded-2xl shadow-md">
        <span className="flex items-center justify-between mb-3 w-full space-x-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <figure className="p-1 border rounded-full">{icon}</figure>
        </span>
        <p className="font-bold text-2xl mb-20">{value}</p>
      </article>
    )}
  </>
)

export default StatCard
