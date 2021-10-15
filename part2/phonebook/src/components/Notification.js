const Notification = ({ notif }) => {
  if (notif.message === null) return null

  return (
    <div className={notif.className}>
      {notif.message}
    </div>
  )
}

export default Notification