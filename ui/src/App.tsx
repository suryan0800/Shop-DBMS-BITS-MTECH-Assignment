import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import ClickMeTryout from './components/ClickMeTryout/ClickMeTryout';
import ClockTimerTryout from './components/ClockTimerTryout/ClockTimerTryout';
import RestCallTryOut from './components/RestCallTryOut/RestCallTryOut';
import Navigation from './components/Nav/Nav';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import { userState } from './services/NavService';
import { LoginUser } from './beans/LoginUser';
import LoginLayout from './components/LoginLayout/LoginLayout';
import ProtectedLayout from './components/ProtectedLayout/ProtectedLayout';
import { USER_DATA } from './constants/constants';
import { CustomerProductView } from './components/CustomerProductView/CustomerProductView';
import CustomerPlaceOrder from './components/CustomerPlaceOrder/CustomerPlaceOrder';
import { SellerProductView } from './components/SellerProductView/SellerProductView';
import SellerNewProduct from './components/SellerNewProduct/SellerNewProduct';
import { LogisticsOrderView } from './components/LogisticsOrderView/LogisticsOrderView';

export default function App() {
 
  const [loginUser, setLoginUser] = useState<LoginUser>(() => {
    const user = sessionStorage.getItem(USER_DATA)
    if (user) {
      return JSON.parse(user)
    } else {
      return null
    }
  })

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
            <Route path="/ClickMe" element={<ClickMeTryout name="Click Me" />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} />}>
            <Route path="/ClockTimer" element={<ClockTimerTryout name="Clock Timer" />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} />}>
            <Route path="/restCallTryOut" element={<RestCallTryOut />} />
          </Route>

          {/* Shop related links */}
          <Route element={<ProtectedLayout loginUser={loginUser} whoCanAccess={['CUST_ITEMS_ORDER_VIEW']} />}>
            <Route path="/shop/customer/product_view" element={<CustomerProductView />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} whoCanAccess={['CUST_ITEMS_ORDER_VIEW']} />}>
            <Route path="/shop/customer/order" element={<CustomerPlaceOrder />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} whoCanAccess={['SELL_PRODUCT_UPDATE_VIEW']} />}>
            <Route path="/shop/seller/product_view" element={<SellerProductView />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} whoCanAccess={['SELL_PRODUCT_UPDATE_VIEW']} />}>
            <Route path="/shop/seller/new_product" element={<SellerNewProduct />} />
          </Route>
          <Route element={<ProtectedLayout loginUser={loginUser} whoCanAccess={['DELIVER_STATUS_UPDATE_VIEW']} />}>
            <Route path="/shop/logistics_worker/order_delivery_status" element={<LogisticsOrderView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

