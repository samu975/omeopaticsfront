'use client'

import React from 'react'
import { GoArrowLeft } from "react-icons/go";
import { useRouter } from 'next/navigation'

const GoBack = () => {
  const router = useRouter()

  return (
    <button className="btn btn-ghost btn-circle" onClick={() => router.back()}>
      <GoArrowLeft className="w-6 h-6" />
    </button>
  )
}

export default GoBack