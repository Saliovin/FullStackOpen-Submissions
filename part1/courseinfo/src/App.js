import React from 'react'

const Header = (props) => {
  return (
    <h1>{props.course['name']}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Content = (props) => {
  let content = props.course.parts.map(part => <Part part={part['name']} exercises={part['exercises']}/>)
  return content
}

const Total = (props) => {
  let exercise_total = 0

  props.course.parts.forEach(part => {
    exercise_total = exercise_total + part['exercises']
  })

  return (
    <p>Number of exercises {exercise_total}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default App