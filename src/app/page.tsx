'use client'
import React, { useEffect, useState } from 'react'
import AdminDashboard from './doctorScreen/page'
import UserDashboard from './userScreen/page'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()
  const [role, setRole] = useState<string>('')

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    } else {
      try {
        const userData = JSON.parse(user)
        setRole(userData.user.role)
      } catch (error) {
        console.error('Error parsing user data:', error)
        router.push("/login")
      }
    }
  }, [])

  console.log(role)

  if (!role) return null

  return (
    <div>
      {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </div>
  )
}

export default page