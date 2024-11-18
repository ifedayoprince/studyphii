import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/server/auth'

export default async function LandingPage() {
  const session = await getServerAuthSession()

  console.log(session)
  if (session) {
    redirect('/session')
  }

  return (
    <></>
  )
}
