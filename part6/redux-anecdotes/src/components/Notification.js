import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const notification =props.notification
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: notification ? '' : 'none'
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification.content
  }
}

const connectedNotification = connect(mapStateToProps)(Notification)
export default connectedNotification