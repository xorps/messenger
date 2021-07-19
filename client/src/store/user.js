// ACTIONS

export const GET_USER = "GET_USER";
const SET_FETCHING_STATUS = "SET_FETCHING_STATUS";
export const GO_OFFLINE = "GO_OFFLINE";
export const SEND_MESSAGE = "SEND_MESSAGE";

// ACTION CREATORS

export const gotUser = (user) => {
  return {
    type: GET_USER,
    user
  };
};

export const setFetchingStatus = (isFetching) => ({
  type: SET_FETCHING_STATUS,
  isFetching
});

export const goOffline = () => ({type: GO_OFFLINE});

export const sendMessage = ({message, recipientId}) => 
  ({type: SEND_MESSAGE, payload: {message, recipientId}});

// REDUCER

const reducer = (state = { isFetching: true }, action) => {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case SET_FETCHING_STATUS:
      return {
        ...state,
        isFetching: action.isFetching
      };
    default:
      return state;
  }
};

export default reducer;
