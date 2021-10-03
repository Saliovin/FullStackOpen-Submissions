import React, { useState } from 'react'

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const VoteStat = ({value}) => <div>has {value} votes</div>

const App = () => {
  const handleVoteClick = () => {
    const vote_list_copy = [...vote_list]
    vote_list_copy[selected] += 1
    setVote_list(vote_list_copy)

    if (vote_list_copy[selected] > vote_list_copy[highest]) {
      setHightest(selected)
    }
  }

  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [vote_list, setVote_list] = useState(Array(7).fill(0))
  const [highest, setHightest] = useState(0)

  return (
    <div>
      <Header text="Anecdote of the day" />
      {anecdotes[selected]}
      <VoteStat value={vote_list[selected]}/>
      <div>
        <Button handleClick={handleVoteClick} text="vote" />
        <Button handleClick={() => setSelected(getRandomInt(7))} text="next anecdote" />
      </div>
      <Header text="Anecdote with the most votes" />
      {anecdotes[highest]}
    </div>
  )
}

export default App