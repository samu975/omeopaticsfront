'use client'

import React from 'react'

interface SearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  placeholder?: string
}

const Search = ({ searchTerm, setSearchTerm, placeholder = "Buscar..." }: SearchProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex">
        <input 
          type="text" 
          placeholder={placeholder}
          className="input input-bordered w-full rounded-r-none" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-square rounded-l-none bg-success text-white">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Search 