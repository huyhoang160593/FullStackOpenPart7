
const initialState = {
  message:'',
  type:null,
  timeoutId:null
}

const notificationReducer = ( state = initialState , action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.notification
  default:
    return state
  }
}

export const notificationChange = (notification,notificationType,timeout,currentTimeoutId) => {
  return async dispatch => {
    if(currentTimeoutId){
      clearTimeout(currentTimeoutId)
    }

    const timeoutId = setTimeout(() => {
      dispatch({
        type:'SET_NOTIFICATION',
        notification:initialState
      })
    }, timeout*1000)

    dispatch({
      type:'SET_NOTIFICATION',
      notification: {
        message:notification,
        type: notificationType,
        timeoutId
      }
    })
  }
}
export default notificationReducer
