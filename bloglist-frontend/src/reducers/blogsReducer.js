import {
  ADD_COMMENT,
  ADD_COMMENT_FAILED,
  ADD_COMMENT_SUCCEED,
  DELETE_BLOG, DELETE_BLOG_FAILED, DELETE_BLOG_SUCCEED,
  INIT_BLOG, INIT_BLOG_FAILED, INIT_BLOG_SUCCEED,
  LIKE_BLOG, LIKE_BLOG_FAILED, LIKE_BLOG_SUCCEED,
  NEW_BLOG, NEW_BLOG_FAILED, NEW_BLOG_SUCCEED
} from '../constants/blogConstants'
import blogs from '../services/blogs'
import { notificationChange } from './notificationReducer'

const initialState = {
  loading: false,
  data: null,
  error: null
}

const blogsReducer = ( state = initialState, action) => {
  switch (action.type) {
  case INIT_BLOG:
    return {
      loading: true,
      data: null,
      error: null
    }
  case INIT_BLOG_SUCCEED:
    return {
      loading: false,
      data: action.payload.data,
      error: null,
    }
  case INIT_BLOG_FAILED:
    return {
      loading: false,
      data:null,
      error: action.payload.error
    }
  case NEW_BLOG:
    return {
      loading: true,
      data: state.data,
      error: null
    }
    // return state.concat(action.payload)
  case NEW_BLOG_SUCCEED:
    return {
      loading: false,
      data: state.data.concat(action.payload.data),
      error: null
    }
  case NEW_BLOG_FAILED:
    return {
      loading: false,
      data: state.data,
      error: action.payload.error
    }
  case LIKE_BLOG:
    return {
      loading: true,
      data: state.data,
      error: null
    }
  case LIKE_BLOG_SUCCEED:
    return {
      loading: false,
      data: state.data.map(item => item.id !== action.payload.data.id ? item : action.payload.data),
      error: null
    }
  case LIKE_BLOG_FAILED:
    return {
      loading: false,
      data: state.data,
      error: action.payload.error
    }
  case DELETE_BLOG:
    return {
      loading: true,
      data: state.data,
      error: null
    }
  case DELETE_BLOG_SUCCEED:
    return {
      loading: false,
      data: state.data.filter(item => item.id !== action.payload.data),
      error: null
    }
  case DELETE_BLOG_FAILED:
    return {
      loading: false,
      data: state.data,
      error: action.payload.error
    }
  case ADD_COMMENT:
    return {
      loading: true,
      data: state.data,
      error: null
    }
  case ADD_COMMENT_SUCCEED:
    return {
      loading: false,
      data: state.data.map(item => item.id !== action.payload.data.id ? item : action.payload.data),
      error: null
    }
  case ADD_COMMENT_FAILED:
    return {
      loading: false,
      data: state.data,
      error: action.payload.error
    }
  default:
    return state
  }
}

/*
 * * Initial all the blogs
*/
export const initialBlogs = () => {
  return async dispatch => {

    dispatch(fetchAllBlogs())
    try {
      const listBlogs = await blogs.getAll()
      dispatch(fetchBlogSucceed(listBlogs))
    } catch (reason) {
      dispatch(notificationChange(reason.message,'err',4,null))
      dispatch(fetchBlogFailed(reason))
    }
  }
}

const fetchAllBlogs = () => ({
  type: INIT_BLOG
})

const fetchBlogSucceed = (blogs) => ({
  type: INIT_BLOG_SUCCEED,
  payload:{
    data:blogs
  }
})

const fetchBlogFailed = (error) => ({
  type: INIT_BLOG_FAILED,
  payload: {
    error
  }
})

/*
 * * Create a new Blog
*/
export const createNewBlog = ( { title,author, url } ) => {
  return async dispatch => {
    dispatch(postNewBlog())
    try {
      const newBlog = await blogs.create({ title,author, url })
      dispatch(postNewBlogSucceed(newBlog))
      dispatch(notificationChange(`a new blog ${title} by ${author} added`, null,4,null))
    } catch (reason) {
      dispatch(notificationChange(`Blog ${title} can't be add to server because: ${reason.message}`,'err',4,null))
      dispatch(postNewBlogFailed(reason))
    }
  }
}

const postNewBlog = () => ({
  type: NEW_BLOG
})

const postNewBlogSucceed = (data) => ({
  type: NEW_BLOG_SUCCEED,
  payload: {
    data
  }
})

const postNewBlogFailed = (error) => ({
  type: NEW_BLOG_FAILED,
  payload: {
    error
  }
})

/*
 * * Like a blog
*/

export const increaseLikeInOneBlog = (chosenBlog) => {
  return async dispatch => {
    dispatch(likeBlog())
    try {
      const changeBlog = await blogs.update(chosenBlog.id,{ ...chosenBlog, likes:chosenBlog.likes + 1 })
      dispatch(likeBlogSucceed(changeBlog))
    } catch (reason) {
      dispatch(notificationChange(`Blog ${chosenBlog.title} can't be liked by the reason: ${reason}`,'err',4,null))
      dispatch(likeBlogFailed(reason))
    }
  }
}

const likeBlog = () => ({
  type: LIKE_BLOG
})

const likeBlogSucceed = (data) => ({
  type: LIKE_BLOG_SUCCEED,
  payload: {
    data
  }
})

const likeBlogFailed = (error) => ({
  type: LIKE_BLOG_FAILED,
  payload: {
    error
  }
})

/*
 * * Delete a blog
*/

export const removeChosenBlog = (chosenBlog) => {
  return async dispatch => {
    dispatch(deleteBlog())
    try {
      await blogs.remove(chosenBlog.id)
      dispatch(notificationChange(`The blog ${chosenBlog.title} by ${chosenBlog.author} has been removed`,null,4,null))
      dispatch(deleteBlogSucceed(chosenBlog.id))
    } catch (reason) {
      dispatch(notificationChange(`Blog ${chosenBlog.title} can't be deleted by the reason: ${reason}`,'err',4,null))
      dispatch(deleteBlogFailed(reason))
    }
  }
}

const deleteBlog = () => ({
  type: DELETE_BLOG
})

const deleteBlogSucceed = (blogId) => ({
  type: DELETE_BLOG_SUCCEED,
  payload:{
    data: blogId
  }
})

const deleteBlogFailed = (error) => ({
  type: DELETE_BLOG_FAILED,
  payload:{
    error
  }
})

/*
 * * Add comment to a blog
*/

export const addAnonymousComment = (chosenBlog, comment) => {
  return async dispatch => {
    dispatch(addComment())
    try {
      const commentReturn = await blogs.addComment(chosenBlog.id,{ comment })
      dispatch(notificationChange(`New comment ${commentReturn.comment} has been added to this blog`,null,4,null))
      const blogModified = {
        ...chosenBlog,
        comment: chosenBlog.comment.concat(commentReturn)
      }
      dispatch(addCommentSucceed(blogModified))
    } catch (reason) {
      dispatch(notificationChange(`This comment can't be add to this blog because: ${reason}`,'err',4,null))
      dispatch(addCommentFailed(reason))
    }
  }
}

const addComment = () => ({
  type: ADD_COMMENT
})

const addCommentSucceed = (data) => ({
  type: ADD_COMMENT_SUCCEED,
  payload:{
    data
  }
})

const addCommentFailed = (error) => ({
  type:ADD_COMMENT_FAILED,
  payload:{
    error
  }
})

export default blogsReducer