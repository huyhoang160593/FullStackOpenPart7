import React, { useEffect } from 'react'
import Notification from './components/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { initialBlogs } from './reducers/blogsReducer'
import { setCurrentUser, signOutUser } from './reducers/userReducer'
import LoginForm from 'components/LoginForm'
import { Route, Switch, useRouteMatch, Link } from 'react-router-dom'
import Users from 'components/Users'
import ListBlogs from 'components/ListBlogs'
import { getAllUser } from 'reducers/usersReducer'
import User from 'components/User'
import Blog from 'components/Blog'

const App = () => {

  const dispatch = useDispatch()

  const notification = useSelector(state => state.notification)
  const blogsState = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)
  const loginUser = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initialBlogs())
    dispatch(getAllUser())
    dispatch(setCurrentUser(null))
  }, [dispatch])

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(signOutUser())
  }

  const matchUser = useRouteMatch('/users/:id')
  const user = matchUser ? users.data ? users.data.find(user => user.id === matchUser.params.id) : null : null

  const matchBlog = useRouteMatch('/blogs/:id')
  const blog = matchBlog ? blogsState.data ? blogsState.data.find(blog => blog.id === matchBlog.params.id) : null : null

  if(loginUser.data === null) {
    return(<LoginForm />)
  }

  return (
    <main className="min-h-screen pb-20 bg-purple-400">
      <div className="flex justify-end px-4 py-2 space-x-3 font-sans font-semibold text-gray-100 bg-blue-300">
        <Link to="/">blogs</Link>
        <Link to="/users">users</Link>
        <span className="text-black">{loginUser.data.name} has logged in</span>
        <button onClick={handleLogout}>logout</button>
      </div>
      <h2 className="my-8 text-4xl text-center text-gray-200">blog app</h2>
      <Notification message= {notification.message} type={notification.type} />

      <Switch>
        <Route path="/users/:id">
          <User user={user}/>
        </Route>
        <Route path="/users">
          <Users users={users.data}/>
        </Route>
        <Route path="/blogs/:id">
          <Blog blog={blog} user={loginUser.data}/>
        </Route>
        <Route path="/">
          <ListBlogs blogs={blogsState.data} user={loginUser.data} />
        </Route>
      </Switch>
    </main>
  )
}

export default App
