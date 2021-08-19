import users from 'services/users'
import { notificationChange } from './notificationReducer'

const { GET_USERS, GET_USERS_SUCCEED, GET_USERS_FAILED } = require('constants/userConstants')

const initialState = {
  loading: false,
  data: null,
  error: null
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_USERS:
    return {
      loading: true,
      data: null,
      error: null
    }
  case GET_USERS_SUCCEED:
    return {
      loading: false,
      data: action.payload.data,
      error: null
    }
  case GET_USERS_FAILED:
    return {
      loading: false,
      data: null,
      error: action.payload.error
    }
  default:
    return state
  }
}

export const getAllUser = () => {
  return async dispatch => {
    dispatch(fetchUsers())
    try {
      const listUsers = await users.getAll()
      dispatch(fetchUsersSucceed(listUsers))
    } catch (error) {
      dispatch(notificationChange(error.message,'err',4,null))
      dispatch(fetchUsersFailed(error))
    }
  }
}

const fetchUsers = () => ({
  type:GET_USERS
})

const fetchUsersSucceed = (users) => ({
  type: GET_USERS_SUCCEED,
  payload:{
    data:users
  }
})

const fetchUsersFailed = (error) => ({
  type: GET_USERS_FAILED,
  payload:{
    error
  }
})

export default usersReducer