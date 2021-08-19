import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore,combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import notificationReducer from './reducers/notificationReducer.js'
import blogsReducer from './reducers/blogsReducer.js'
import userReducer from './reducers/userReducer.js'
import usersReducer from 'reducers/usersReducer.js'

const reducer = combineReducers({
  notification:notificationReducer,
  blogs:blogsReducer,
  user:userReducer,
  users:usersReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store
