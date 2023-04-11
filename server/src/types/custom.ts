export type LoginUser = {
    mail_id: string
    roles: string[] 
    node_list: string[] 

    // JWT related 
    login_time?: Date
    jwt_token?: string 
    is_authenticated?: boolean 

    // To be reused for database fetch
    acl_group?: string 
    node_name?: string 
}