import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import MyComponent1 from './components/MyComponent1/MyComponent1';
import MyComponent2 from './components/MyComponent2/MyComponent2';
import RestCallTryOut from './components/RestCallTryOut/RestCallTryOut';
import Navigation from './components/Nav/Nav';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import { userState } from './services/NavService';
import { LoginUser } from './beans/LoginUser';
import LoginLayout from './components/LoginLayout/LoginLayout';
import ProtectedLayout from './components/ProtectedLayout/ProtectedLayout';

export default function App() {
  let loginState: LoginUser
  const user = sessionStorage.getItem("userdata")
  if (user) {
    loginState = JSON.parse(user)
  } else {
    loginState = null
  }
  const [loginUser, setLoginUser] = useState<LoginUser>(loginState)

  useEffect(() => {
    // subscribe to Nav Service UserState Subject messages
    const userStateSub = userState.subscribe(loginState => {
      console.log("Inside userState Subscription")
      setLoginUser(loginState)
    });

    return () => { // Gets executed when component destroys
      // unsubscribe to ensure no memory leaks
      userStateSub && userStateSub.unsubscribe();
    }
  }, [])
  console.log('App render')
  return (
    <div>
      <BrowserRouter>
        <div>
          <Navigation loginUser={loginUser} />
          <br />
        </div>
        <Routes>
          <Route element={<LoginLayout loginUser={loginUser} />} >
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} />}>
            <Route path="/Home" element={<Home />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} />}>
            <Route path="/myComponent1" element={<MyComponent1 name="World" />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} />}>
            <Route path="/myComponent2" element={<MyComponent2 name="Why IBM" />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} />}>
            <Route path="/restCallTryOut" element={<RestCallTryOut />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

