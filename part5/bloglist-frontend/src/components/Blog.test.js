import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Test Title',
  author: 'Author',
  url: 'testurl.com',
  likes: 0,
  user: {
    name: 'John Rambo',
    username: 'TestUser'
  }
}

describe('renders blog component', () => {
  test('title and author are visible', () => {

    const component = render(
      <Blog blog={blog} />
    )

    expect(component.container).toHaveTextContent('Test Title')
    expect(component.container).toHaveTextContent('Author')
  })

  test('url and likes are not visible by default', () => {
    const component = render(
      <Blog blog={blog} />
    )

    expect(component.container.querySelector('.blogPostExtended')).toHaveStyle('display: none')
  })
})

describe('renders blog expanded component', () => {
  test('title and author visible when expanded', () => {

    const component = render(
      <Blog blog={blog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('Test Title')
    expect(component.container).toHaveTextContent('Author')
  })

  test('url and likes not visible by default', () => {
    const component = render(
      <Blog blog={blog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container.querySelector('.blogPostExtended')).not.toHaveStyle('display: none')
  })

  test('like handler is called when like button is clicked', () => {
    const mockLikeHandler = jest.fn()
    const component = render(
      <Blog blog={blog} likeHandler={mockLikeHandler}/>
    )

    const button = component.getByText('view')
    fireEvent.click(button)
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
