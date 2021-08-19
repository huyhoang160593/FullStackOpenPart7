const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const helper = require('../utils/test_helper')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async() => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('manwol', 10)
    const user = new User({ username: 'iulover99', passwordHash })

    await user.save()


})

test('add successfully one blog with proper token', async()=> {

    const loginAccount = await api.post('/api/login')
        .send({
            username: 'iulover99',
            password: 'manwol'
        })
        .expect(200)

    const userDB = await helper.usersInDb()
    const userTest = userDB[0]

    const token = loginAccount.body.token

    const initialBlog = {
            title: "You suck and you know it",
            author: "Millian Channel",
            url: "https://fullstackopen.com/en",
            likes: 1,
            user: userTest.id
        }


    await api
        .post('/api/blogs')
        .send(initialBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type',/application\/json/)

    const blogAfterPost = await helper.blogsInDb()
    expect(blogAfterPost).toHaveLength(1)
})

test('add a blog fail with status 401', async() => {
    const userDB = await helper.usersInDb()
    const userTest = userDB[0]
    
    const badBlog = {
        title: "You suck and you know it",
        author: "This is not gonna be added",
        url: "https://fullstackopen.com/en",
        likes: 1,
        user: userTest.id
    }

    await api
        .post('/api/blogs')
        .send(badBlog)
        .expect(401)
})

afterAll(() => {
    mongoose.connection.close()
})