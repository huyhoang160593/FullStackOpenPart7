import React from 'react'

const Notification = ({ message,type }) => {
  if (!message) {
    return null
  }
  if(type === null){
    return (
      <div className="fixed px-4 py-2 text-green-700 bg-green-100 border border-green-700 rounded-lg text-md top-4 right-4">
        {message}
      </div>
    )
  }
  return(
    <div className="fixed px-4 py-2 text-red-700 bg-red-100 border border-red-700 rounded-lg text-md top-4 right-4">
      {message}
    </div>
  )
}

export default Notification
