const PhonebookEntry = ({ person, setPersons, personService }) => {
  const handleClick = event => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(person.id).then(response => {
        personService.getAll().then(persons => {
          setPersons(persons)
        })
      })
    }
  }

  return (
    <div>
      {person.name} {person.number}
      <button onClick={handleClick}>delete</button>
    </div>
  )
}

const Phonebook = ({ persons, setPersons, personService }) => {
  return persons.map((person, i) => <PhonebookEntry key={i} person={person} setPersons={setPersons} personService={personService} />)
}

export default Phonebook