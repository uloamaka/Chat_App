import "./App.css";
import { Route } from "react-router-dom";
import homePage from "./pages/homePage";
import ChatPage from "./pages/ChatPage"
import forgetPassPage from "./pages/forgetPassword";
import resetPassPage from "./pages/resetPassword";

function App() {
  return (
    <div className="App">
      <Route path="/" component={homePage} exact></Route>
      <Route path="/forget_Password" component={forgetPassPage}></Route>
      <Route
        path="/api/v1/auth/reset-password/:userId/:resetToken"
        component={resetPassPage}
      ></Route>
      <Route path="/chats" component={ChatPage} ></Route>
    </div>
  );
}

export default App;
