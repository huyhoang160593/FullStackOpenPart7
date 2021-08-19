import React from 'react'
import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  const RowUser = ({ user }) => (
    <tr>
      <td className="px-4 py-1 text-pink-400 underline border border-purple-600"><Link to={`/users/${user.id}`}>{user.name}</Link></td>
      <td className="px-4 py-1 border border-purple-600">{user.blogs.length}</td>
    </tr>
  )

  if (!users) return null

  return(
    <div className="px-8 py-4 mx-8 border rounded-md bg-gray-50">
      <h1 className="py-3 text-3xl text-bold">Users</h1>
      <table className="border border-separate border-purple-800 table-auto">
        <thead>
          <tr>
            <th className="border border-purple-600" colSpan="1"></th>
            <th className="px-2 py-1 border border-purple-600">blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <RowUser key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users