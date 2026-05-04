export const login = (token, capcha) => {
  return {
    type: "LOGIN",
    token: token,
  };
};

export const Logout = () => {
  return {
    type: "LOGOUT",
  };
};
