import React, { useState } from 'react'

const Search = ({ setNewSearch }) => {
  const [search, setsearch] = useState('')
  const handleSearch = event => {
    setsearch(event.target.value)
    setNewSearch(event.target.value)
  }

  return <>filter shown with <input value={search} onChange={handleSearch} /></>
}

export default Search