import React, { useState } from 'react'

const Header = ({ text }) => {
  return <h1>{text}</h1>
}

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

const StatisticLine = ({ stat, value }) => {
  return <td>{stat} {value}</td>
}

const Statistics = (props) => {
  if (props.total_feedback === 0) {
    return <div>No feedback given</div>
  }
  return (
    <table>
      <tbody>
        <tr><StatisticLine stat="good" value={props.good} /></tr>
        <tr><StatisticLine stat="neutral" value={props.neutral} /></tr>
        <tr><StatisticLine stat="bad" value={props.bad} /></tr>
        <tr><StatisticLine stat="all" value={props.total_feedback} /></tr>
        <tr><StatisticLine stat="average" value={(props.good - props.bad) / props.total_feedback} /></tr>
        <tr><StatisticLine stat="positive" value={100 * props.good / props.total_feedback + " %"} /></tr>
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let total_feedback = good + neutral + bad

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics total_feedback={total_feedback} good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App