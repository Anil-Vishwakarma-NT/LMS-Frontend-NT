import { LOGIN, LOGOUT, SET_USER_ID } from "./authTypes";

const initialState = {
  id: "",
  name: "",
  email: "",
  mobileNumber: "",
  role: "",
  token: "",
  userId: "",
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
