export type LoginUser = {
    mail_id: string 
    roles: string[] 
    node_list: string[] 

    // JWT related 
    login_time: Date
    jwt_token: string 
    is_authenticated: boolean 
}


export const isAuthenticated = (loginUser: LoginUser) => {
    return (loginUser && loginUser.mail_id && loginUser.is_authenticated === true ? true : false)
}

export const isAuthorized = (loginUser: LoginUser, whoCanAccess: string[]) => {
    return whoCanAccess && whoCanAccess.length && loginUser?.node_list?.some(val => whoCanAccess.includes(val));
}