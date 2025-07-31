import { LOGIN, LOGOUT, SET_USER_ID } from "./authTypes";

const initialState = {

  email: "",
  roles: "",
  accessToken: "",
  fullName: ""
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;

    case LOGOUT:
      return initialState;

    case SET_USER_ID:
      return { ...state, userId: action.payload };

    default:
      return state;
  }
};

export default authReducer;
