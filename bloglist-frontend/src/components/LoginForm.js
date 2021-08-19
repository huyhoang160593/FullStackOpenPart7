import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentUser } from 'reducers/userReducer'
import Notification from './Notification'

const LoginForm = () => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')

  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(setCurrentUser({ username,password }))
  }

  return (
    <div className="flex flex-col justify-center w-screen h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <h2 className="mb-4 text-5xl text-center text-white">Login</h2>
      <Notification message= {notification.message} type={notification.type} />
      <form onSubmit={handleLogin} className="flex flex-col items-center justify-center h-64 px-8 bg-gray-100 border rounded mx-72">
        <label className="text-xl font-bold" htmlFor="username">username</label>
        <input
          id='username'
          type="text"
          value={username}
          name="username"
          className="px-5 py-1 text-lg border border-purple-400"
          onChange={({ target }) => setUsername(target.value)}
        />
        <label className="text-xl font-bold" htmlFor="password">password</label>
        <input
          id='password'
          type="password"
          value={password}
          name="password"
          className="px-5 py-1 text-lg border border-purple-400"
          onChange={({ target }) => setPassword(target.value)}
        />
        <button className="px-24 py-2 mt-8 text-lg text-white bg-purple-700 border rounded-2xl hover:bg-purple-400 focus:bg-purple-800" id='login-button' type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm