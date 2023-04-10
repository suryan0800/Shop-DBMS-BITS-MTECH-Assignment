import React, { FC } from 'react';
import { LoginUser, isAuthenticated, isAuthorized } from '../../beans/LoginUser';
import { Navigate, Outlet } from 'react-router-dom';

type MyProps = { loginUser: LoginUser, whoCanAccess?: string[] }
const ProtectedLayout: FC<MyProps> = (props) => {
    const loginUser = props.loginUser
    const whoCanAccess = props.whoCanAccess
    if (loginUser
        && isAuthenticated(loginUser)
        && (!whoCanAccess || isAuthorized(loginUser, whoCanAccess))) {
        return <Outlet />;
    }
    return <Navigate to="/Login" replace={true} />;
}

export default ProtectedLayout;