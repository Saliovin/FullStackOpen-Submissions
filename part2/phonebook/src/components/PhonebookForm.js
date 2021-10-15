import React, { useState } from 'react'

const PhonebookForm = ({ persons, setPersons, personService, setNotif }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const handleNameChange = event => setNewName(event.target.value)
  const handleNnumberChange = event => setnewNumber(event.target.value)
  const handleSubmit = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if (person) {
      console.log(person)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = { ...person, number: newNumber }
        personService.update(person.id, newPerson).then(response => {
          personService.getAll().then(persons => {
            setPersons(persons)
          })
        }, error => {
          setNotif({ message: `Information of ${newPerson.name} has already been removed from server`, className: 'errorNotif' })
          setTimeout(() => {
            setNotif({ message: null, className: 'successNotif' })
          }, 5000)
          personService.getAll().then(persons => {
            setPersons(persons)
          })
        })
      }
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService.create(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotif({ message: `Added ${newPerson.name}`, className: 'successNotif' })
        setTimeout(() => {
          setNotif({ message: null, className: 'successNotif' })
        }, 5000)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNnumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PhonebookForm