const { request, response } = require('express')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

/*
  We don't need next(exception) call because library 'express-async-errors' handles everything for us
*/

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user',{ username: 1, name: 1 }).populate('comment',{ comment: 1 })
  response.json(blogs.map(blog=> blog.toJSON()))
})

blogsRouter.get('/:id', async(request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async(request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response
    .status(201)
    .json(savedBlog.toJSON())
})


blogsRouter.delete('/:id', async(request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const deleteBlog = await Blog.findById(request.params.id)

  if(user._id.toString() === deleteBlog.user.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
    await user.save()
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async(request,response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updateBlog = await Blog.findByIdAndUpdate(request.params.id,blog, { new: true }).populate('user',{ username: 1, name: 1 }).populate('comment',{ comment: 1 })
  response.json(updateBlog)
})

blogsRouter.post('/:id/comments', async(request,response) => {
  const body = request.body
  const foundBlog = await Blog.findById(request.params.id)

  const comment = new Comment({
    comment: body.comment,
    blogId: request.params.id
  })

  const savedComment = await comment.save()
  foundBlog.comment = foundBlog.comment.concat(savedComment._id)
  //5f0053bb6cdf8b0af4d08f88
  await foundBlog.save()
  response.json(savedComment.toJSON())
})

module.exports = blogsRouter