import Link from 'next/link'
import React from 'react'
import { FaHome } from "react-icons/fa";

const GoHome = () => {
  return (
    <Link href='/'>
      <FaHome className='w-6 h-6' />
    </Link>
  )
}

export default GoHome