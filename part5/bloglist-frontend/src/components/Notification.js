import React from 'react'

const Notification = ({ notif }) => {
  if (!notif.message) {
    return null
  }
  else {
    return (
      <div className={notif.type}>{notif.message}</div>
    )
  }
}

export default Notification