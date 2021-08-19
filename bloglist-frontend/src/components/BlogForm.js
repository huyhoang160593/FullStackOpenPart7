import React, { useState } from 'react'

const BlogForm = ( { createBlog, handleClose }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title:title,
      author:author,
      url:url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return(
    <>
      <form className="flex flex-col space-y-2" onSubmit={addBlog}>
        <label className="text-xl font-bold" htmlFor="title">
          title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          name="title"
          className="w-64 px-5 py-1 text-lg border border-purple-400"
          onChange={({ target }) => setTitle(target.value)}
        />
        <label className="text-xl font-bold" htmlFor="author">
          author
        </label>
        <input
          id="author"
          type="text"
          value={author}
          name="author"
          className="w-64 px-5 py-1 text-lg border border-purple-400"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <label className="text-xl font-bold" htmlFor="url">
          url
        </label>
        <input
          id="url"
          type="text"
          value={url}
          name="url"
          className="w-64 px-5 py-1 text-lg border border-purple-400"
          onChange={({ target }) => setUrl(target.value)}
        />
        <div className="flex space-x-5">
          <button className="px-12 py-2 text-white bg-purple-700 border w-36 text-md rounded-xl hover:bg-purple-400 focus:bg-purple-800" type="submit">create</button>
          <button className="px-12 py-2 text-white bg-purple-700 border w-36 text-md rounded-xl hover:bg-purple-400 focus:bg-purple-800" type="button" onClick={handleClose}>cancel</button>
        </div>
      </form>
    </>
  )
}

export default BlogForm