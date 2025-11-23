'use client'

import { createClient } from '@/app/_lib/client'
import { Button } from '@/app/_components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return <Button onClick={logout}>Logout</Button>
}
