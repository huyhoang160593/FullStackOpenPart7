import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { addAnonymousComment, increaseLikeInOneBlog, removeChosenBlog } from 'reducers/blogsReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const[inputComment, setInputComment] = useState('')

  let deletePermission = false
  let blogUserName = 'Unknown'

  if(!blog) return null

  if((typeof(blog.user) === 'string') && (blog.user === user.id)){
    blogUserName = user.name
    deletePermission = blog.user === user.id
  } else if(typeof(blog.user) === 'object'){
    blogUserName = blog.user.name
    deletePermission = blog.user.username === user.username
  }

  const handleLikeOf = () => {
    dispatch(increaseLikeInOneBlog(blog))
  }

  const handleRemoveOf = () => {
    window.confirm(`Remove blog ${blog.title} by ${blog.author}`) && dispatch(removeChosenBlog(blog))
    history.push('/')
  }

  const handleSendComment = () => {
    dispatch(addAnonymousComment(blog,inputComment))
  }

  const CommentRow = ({ comment }) => (
    <li className="ml-6 list-disc">{comment}</li>
  )

  return (
    <div className="px-8 py-4 mx-8 border rounded-md bg-gray-50">
      <h2 className="flex flex-col">
        <span className="text-2xl font-bold text-pink-400">{blog.title}</span>
        <span className="text-xl italic text-gray-300">{blog.author}</span>
      </h2>
      <div className="text-blue-400 underline hover:text-blue-200 focus:text-blue-700">
        <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      </div>
      <div className="">
        likes <span className="text-base italic text-bold">{blog.likes}</span>
        <button className="px-2 py-1 text-sm text-white bg-pink-500 border rounded-xl hover:bg-pink-300 focus:bg-pink-700" onClick={handleLikeOf}>like</button>
      </div>
      <div>
        added by <span className="underline">{blogUserName}</span>
      </div>
      <div>
        {deletePermission && <button className="px-6 py-1 text-xl text-white bg-purple-700 border w-36 rounded-xl hover:bg-purple-400 focus:bg-purple-800" onClick={handleRemoveOf}>remove</button>}
      </div>
      <h2 className="mt-5 text-3xl text-bold">comments</h2>
      <input className="w-64 px-5 py-1 mr-4 text-lg border border-purple-400" type="text" id='inputComment' placeholder="type your comment here" name='inputComment' value={inputComment} onChange={({ target }) => setInputComment(target.value)} />
      <button className="px-6 py-2 text-white bg-purple-700 border text-md hover:bg-purple-400 focus:bg-purple-800" id='send-comment-button' onClick={() => handleSendComment()}>add comment</button>
      <ul>
        {blog.comment.length !== 0 && blog.comment.map(commentObject => (
          <CommentRow key={commentObject.id} comment={commentObject.comment} />
        ))}
      </ul>
    </div>
  )
}



export default Blog
