import React from 'react'
import GoBack from './GoBack'
import GoHome from './GoHome'

const NavBar = () => {
  return (
    <div className='flex justify-between items-center bg-base-200 p-4 w-full'>
      <GoBack />
      <GoHome /> 
    </div>
  )
}

export default NavBar