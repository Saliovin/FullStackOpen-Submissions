import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Toggleable = (props) => {
  const [childrenVisible, setChildrenVisible] = useState(false)

  return (
    <>
      <button style={{ display: childrenVisible ? 'none' : '' }} onClick={() => setChildrenVisible(!childrenVisible)}>{props.message}</button>
      <div style={{ display: childrenVisible ? '' : 'none' }}>
        {props.children}
        <button onClick={() => setChildrenVisible(!childrenVisible)}>cancel</button>
      </div>
    </>
  )
}

Toggleable.propTypes = {
  message: PropTypes.string.isRequired
}

export default Toggleable