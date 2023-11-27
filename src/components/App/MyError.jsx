import React from 'react'
import { Alert } from 'antd'

const MyError = ({ message }) => {
  let type
  message === 'Nothing was found for this request 🔎' || message === 'You can add something here!👀'
    ? (type = 'info')
    : (type = 'error')
  const title = type === 'error' ? 'Ooops... Something went wrong🫤' : null

  return (
    <Alert
      message={title}
      description={message}
      type={type}
      style={{
        minWidth: 'auto',
        maxWidth: 300,
        textAlign: 'center',
        margin: '0 auto',
      }}
    />
  )
}

export default MyError
