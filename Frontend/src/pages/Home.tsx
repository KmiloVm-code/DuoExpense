import { useAuth } from '../contexts/AuthContext'

function Home () {
  const { user } = useAuth()
  const username = user.nombre

  return (
    <div className="flex flex-col items-center justify-center w-1/2 m-auto h-screen gap-5">
      <h1 className="text-4xl font-bold">Welcome {username}</h1>
    </div>
  )
}

export default Home
