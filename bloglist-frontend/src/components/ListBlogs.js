import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { createNewBlog } from 'reducers/blogsReducer'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { Link } from 'react-router-dom'

const ListBlogs = ({ blogs }) => {
  const dispatch = useDispatch()
  const blogFromRef = useRef()

  const createBlogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFromRef}>
      <BlogForm createBlog={addBlog} handleClose={handleClose}/>
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFromRef.current.toggleVisibility()
    dispatch(createNewBlog(blogObject))
  }

  const handleClose = () => {
    blogFromRef.current.toggleVisibility()
  }

  if(!blogs) return null
  return(
    <div className="px-8 py-4 mx-8 border rounded-md bg-gray-50">
      {createBlogForm()}
      <h2 className="py-3 text-3xl text-bold">list blogs</h2>
      {blogs.sort((a,b) => b.likes - a.likes)
        .map(blog =>
          <div key={blog.id} className="my-2 border rounded">
            <Link className="flex flex-col px-4 py-1" to={`/blogs/${blog.id}`}>
              <span className="text-lg font-bold text-pink-400">{blog.title}</span>
              <span className="text-sm italic text-gray-300">{blog.author}</span>
            </Link>
          </div>
        )}
    </div>
  )
}

export default ListBlogs