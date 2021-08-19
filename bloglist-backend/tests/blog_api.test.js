const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async ()=> {
    
    await Blog.deleteMany({})

    //Executes all the promises receives in parallel
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    //Executes in a particular order
/*    
    for(let blog of helper.initialBlogs) {
        let blogObjects = new Blog(blog)
        await blogObjects.save()
    }
*/

})

test('all blogs are returned', async() => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('property of the blog posts is named id and not _id', async()=> {
    const response = await helper.blogsInDb()
    const firstBlog = response[0]
    expect(firstBlog.id).toBeDefined()
})

test('a new blog post can be create successfully', async() => {
    const newBlog = {
        title: "Sans Rampage",
        author: "Toby Fox",
        url: "https://youtu.be/wDgQdr8ZkTw",
        likes: 1922,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type',/application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b=>b.title)
    expect(titles).toContain(
        "Sans Rampage"
    ) 
})

test('if likes property is missing, it will default to the value 0', async () => {
    const blogWithoutLike = {
        title: "Did you know: Gamek is fulfilled of trash post and with cow girls",
        author: "Quan",
        url: "https://gamek.vn",
    }

    await api
        .post('/api/blogs')
        .send(blogWithoutLike)
        .expect(201)
        .expect('Content-Type',/application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)
    
    const likes = blogsAtEnd.map(b=>b.likes)
    expect(likes).toContain(0)
})

test('blog without title and url is not added to DB', async()=> {
    const shittyBlog = {
        author: "Quan Hai Hai",
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(shittyBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('delete a blog succeeds with a status code 204 if id is valid', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToDelete.title)
})

test('update successful likes of a blog by their id', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updateBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 246
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateBlog)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
    )

    const newLikes = blogsAtEnd[0].likes

    expect(newLikes).toEqual(updateBlog.likes)
})

afterAll(() => {
    mongoose.connection.close()
})
