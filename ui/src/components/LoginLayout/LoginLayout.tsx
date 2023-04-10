import React, { FC } from 'react';
import { LoginUser, isAuthenticated } from '../../beans/LoginUser';
import { Navigate, Outlet } from 'react-router-dom';

type MyProps = { loginUser: LoginUser }
const LoginLayout: FC<MyProps> = ({loginUser}) => {
    if (isAuthenticated(loginUser)) {
        return <Navigate to="/Home" replace={true} />;
    } 
        
    return <Outlet />;
}

export default LoginLayout;