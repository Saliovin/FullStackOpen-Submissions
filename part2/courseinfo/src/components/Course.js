import React from 'react'
import { nanoid } from 'nanoid'

const Header = (props) => {
  return (
    <h1>{props.name}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  let content = parts.map(part => <Part key={nanoid()} part={part['name']} exercises={part['exercises']} />)
  return content
}

const Total = ({ parts }) => {
  return (
    <b>total of {parts.reduce((sum, part) => sum += part.exercises, 0)} exercises</b>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course