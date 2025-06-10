import { LOGIN, LOGOUT, SET_USER_ID } from "./authTypes";

export const login = (user) => {
  return {
    type: LOGIN,
    payload: user,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});
