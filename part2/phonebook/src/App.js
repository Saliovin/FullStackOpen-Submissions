import React, { useState, useEffect } from 'react'
import Phonebook from './components/Phonebook'
import PhonebookForm from './components/PhonebookForm'
import Search from './components/Search'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [search, setSearch] = useState('')
  const [notif, setNotif] = useState({ message: null, className: 'successNotif' })
  const numbersToShow = search
    ? persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
    : persons

  useEffect(() => {
    personService.getAll().then(persons => {
      setPersons(persons)
    })
  }, [])
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notif={notif} />
      <Search setNewSearch={setSearch} />
      <h2>add a new</h2>
      <PhonebookForm persons={persons} setPersons={setPersons} personService={personService} setNotif={setNotif} />
      <h2>Numbers</h2>
      <Phonebook persons={numbersToShow} setPersons={setPersons} personService={personService} />
    </div>
  )
}

export default App