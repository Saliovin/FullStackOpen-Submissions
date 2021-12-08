import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'

test('form calls event handler', () => {
  const mockSubmitFunc = jest.fn()
  const component = render(
    <NewBlogForm onSubmit={mockSubmitFunc} />
  )
  const authorInput = component.container.querySelector('#author')
  const titleInput = component.container.querySelector('#title')
  const urlInput = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(authorInput, {
    target: { value: 'John Wick' }
  })
  fireEvent.change(titleInput, {
    target: { value: 'The Title' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'url.com' }
  })

  fireEvent.submit(form)
  expect(mockSubmitFunc.mock.calls).toHaveLength(1)
  expect(mockSubmitFunc.mock.calls[0][0]).toEqual({ author: 'John Wick', title: 'The Title', url: 'url.com' })
})