import { SET_USER, SET_USER_FAILED, SET_USER_SUCCEED, SIGN_OUT } from '../constants/userConstants'
import { notificationChange } from './notificationReducer'
import loginService from '../services/login'
import blogService from '../services/blogs'

const initialState = {
  loading: false,
  data: null,
  error: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_USER:
    return {
      loading: true,
      data: null,
      error: null
    }
  case SET_USER_SUCCEED:
    return {
      loading: false,
      data: action.payload.data,
      error: null
    }
  case SET_USER_FAILED:
    return {
      loading: false,
      data: null,
      error: action.payload.error
    }
  case SIGN_OUT:
    window.localStorage.removeItem('loggedBlogappUser')
    return initialState
  default:
    return state
  }
}

export const setCurrentUser = (user) => {
  return async dispatch => {
    try {
      dispatch(setUser())
      if(user) {
        const loginUser = await loginService.login(user)
        window.localStorage.setItem('loggedBlogappUser',JSON.stringify(loginUser))
        blogService.setToken(loginUser.token)
        dispatch(setUserSucceed(loginUser))
      } else{
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON){
          const loginUser = JSON.parse(loggedUserJSON)
          blogService.setToken(loginUser.token)
          dispatch(setUserSucceed(loginUser))
        } else {
          dispatch(setUserSucceed(null))
        }
      }
    } catch (error) {
      dispatch(notificationChange(`There is an error when signin your account, maybe your username or password is wrong, or because of this reason: ${error}`,'err',4,null))
      dispatch(setUserFailed(error))
    }
  }
}

const setUser = () => ({
  type: SET_USER
})

const setUserSucceed = (data) => ({
  type: SET_USER_SUCCEED,
  payload:{
    data
  }
})

const setUserFailed = (error) => ({
  type: SET_USER_FAILED,
  payload:{
    error
  }
})

export const signOutUser = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch({
      type: SIGN_OUT
    })
  }
}

export default userReducer