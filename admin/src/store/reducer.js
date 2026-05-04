const initialState = {
  token: "",
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.token,
      };

    case "LOGOUT":
      return {
        initialState,
      };

    default:
      return state;
  }
};

export default Reducer;
