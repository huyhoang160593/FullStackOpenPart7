const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likeEachBlogs = blogs.map(blog => blog.likes)
    const reducer = (sum,item) => {
        return sum + item
    }

    return likeEachBlogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
    const likeEachBlogs = blogs.map(blog => blog.likes)  
    const maxLikes = Math.max(...likeEachBlogs)
    const favorite = blogs.find(blog => blog.likes === maxLikes)
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }  
}

const mostBlogs = (blogs) => {
    const authorBlogCount = _.countBy(blogs.map(blog => blog.author))
    const invertCount = _.invert(authorBlogCount)
    const mostBlogs = Math.max(...Object.values(authorBlogCount))

    return {
        author: invertCount[mostBlogs],
        blogs: mostBlogs
    }
}

const mostLikes = (blogs) => {
    const countLikes = blogs.reduce((prev,curr)=>(
        prev[curr.author] = prev[curr.author]+curr.likes || curr.likes,prev
        ),{})
    const invertCount = _.invert(countLikes)
    const mostLikes = Math.max(...Object.values(countLikes))

    return {
        author:invertCount[mostLikes],
        likes: mostLikes
    }
} 


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}