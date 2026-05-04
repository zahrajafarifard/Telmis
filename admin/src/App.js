import "./App.css";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";

import Login from "./components/login";
import MainLayout from "./mainLayout";

import ForgetPassword from "./components/login/forget-password";
import CheckSecurityCode from "./components/login/check-security-code";
import NewPassword from "./components/login/new-password";
import { Logout } from "./store/action";
// import ConfirmNewPassword from "./components/login/confirm-new-password";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constantMock = window.fetch;
  window.fetch = function () {
    let response;

    return new Promise((resolve, reject) => {
      constantMock
        .apply(this, arguments)
        .then((response) => {
          if (response.status === 401) {
            navigate("/", { replace: true });
            dispatch(Logout());
          }
          return resolve(response);
        })
        .catch((error) => {
          reject(response);
        });
    });
  };
  return (
    <div className="App font-Peyda">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/password" element={<ForgetPassword />} />
        <Route path="/check-security-code" element={<CheckSecurityCode />} />
        <Route path="/set-new-password" element={<NewPassword />} />
        <Route
          exact
          path="/*"
          element={<MainLayout render={(props) => ({ ...props })} />}
        />
      </Routes>
    </div>
  );
}

export default App;
