'use client'
import { useState, useEffect } from 'react'



export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }
  return (
   <>
    <div>
      
    </div>
   </>
  );
}
