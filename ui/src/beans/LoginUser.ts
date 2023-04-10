export type LoginUser = {
    mailId: string 
    isSuccess: boolean 
    userNodeList: string[] 
}


export const isAuthenticated = (loginUser: LoginUser) => {
    console.log('hello world')
    return (loginUser && loginUser.mailId && loginUser.isSuccess === true ? true : false)
}

export const isAuthorized = (loginUser: LoginUser, whoCanAccess: string[]) => {
    return whoCanAccess && whoCanAccess.length && loginUser?.userNodeList?.some(val => whoCanAccess.includes(val));
}