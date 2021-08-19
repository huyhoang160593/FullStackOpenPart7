const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "You suck and you know it",
        author: "Millian Channel",
        url: "https://fullstackopen.com/en",
        likes: 1,
    },
    {
        title: "1+1=2 and I + You = You can't reply to this conversation.Learn more",
        author: "Quan Hai Hai",
        url: "https://www.dafk.net/what/",
        likes: 13,
    },
    {
        title: "You shouldn't do this or you will get a bad ending",
        author: "Quan Hai Hai",
        url: "https://www.4chan.org",
        likes: 17,
    }
]

const blogsInDb = async() => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async() => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}