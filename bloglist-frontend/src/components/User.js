import React from 'react'

const User = ({ user }) => {
  if(!user) {
    return null
  }
  return (
    <div className="px-8 py-4 mx-8 border rounded-md bg-gray-50">
      <h2 className="text-3xl font-bold text-pink-400">{user.name}</h2>
      <h3 className="mt-2 text-xl text-bold">added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li className="ml-6 list-disc" key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}
export default User