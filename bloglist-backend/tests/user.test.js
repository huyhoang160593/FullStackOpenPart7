const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('../utils/test_helper')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)

describe('when there is initial one user in db', () => {
    beforeEach(async() => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret',10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('an invalid username less than 4 characters is not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUsername = {
            username: 'us',
            name: 'You not gonna be add in db friendo',
            password: 'youcoundbeanything'
        }

        await api
            .post('/api/users')
            .send(invalidUsername)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames =  usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(invalidUsername.username)
    })


    test('an invalid password less than 4 characters is not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidPassword = {
            username: 'thisshitnotgonnawork',
            name: 'You not gonna be add in db friendo',
            password: 'us'
        }

        await api
            .post('/api/users')
            .send(invalidPassword)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames =  usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(invalidPassword.username)
    })

    test('an user without username or password is not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUser = {
            name: 'You not gonna be add in db friendo',
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(()=>{
    mongoose.connection.close()
})
