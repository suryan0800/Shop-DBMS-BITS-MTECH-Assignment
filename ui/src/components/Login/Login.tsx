import React, { useState, FormEventHandler, useEffect, FC } from 'react'
import http from "../../services/CustomAxiosInstance";
import { userState } from '../../services/NavService'
import { useNavigate } from 'react-router-dom'
import { Alert, Spinner } from 'react-bootstrap'
import styles from './Login.module.css'
import { LoginUser } from '../../beans/LoginUser'
import { JWT_TOKEN, USER_DATA } from '../../constants/constants'

const Login: FC = () => {
    const navigate = useNavigate()

    const [notiShow, setNotiShow] = useState(false)
    const [notiMessage, setNotiMessage] = useState<string>(null)

    const [isLoading, setIsLoading] = useState(0)
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')

    const handleLogin: FormEventHandler = (event) => {
        event.preventDefault()
        setIsLoading((prevVal) => (prevVal+1))
        http
            .post<LoginUser>('/user/Login', {
                userName: user,
                password: pass
            })
            .then(({ data }) => {
                userState.next(data)
                sessionStorage.setItem(USER_DATA, JSON.stringify(data))
                sessionStorage.setItem(JWT_TOKEN, data.jwt_token)
                console.log('hello 2')
                setIsLoading((prevVal) => (prevVal - 1))
                navigate("/Home")
            })
            .catch((err) => {
                setNotiMessage(err.message)
                setNotiShow(true)
                setIsLoading((prevVal) => (prevVal - 1))
            });
    }

    return (
        <div style={{ width: '30%', marginLeft: '35%', marginTop: '5%', border: "2px solid black", padding: "2%" }}>
            <Alert key='danger' variant='danger' show={notiShow} onClose={() => setNotiShow(false)} dismissible>
                <Alert.Heading>Login Status</Alert.Heading>
                <p>Invalid Username or Password </p>
                <hr />
                <p> {notiMessage} </p>
            </Alert>
            <form onSubmit={handleLogin}>
                <div style={{ textAlign: 'center' }}>
                    <h3>OSM Shop</h3>
                </div>
                <br />
                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" value={user} onChange={e => setUser(e.target.value)} />
                </div>
                <br />
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" value={pass} onChange={e => setPass(e.target.value)} />
                </div>
                <br /><br />
                <div style={{ textAlign: 'center' }}>
                    <button style={{ width: '100%' }} type="submit" className="btn btn-primary btn-block">Login</button>
                </div>

            </form>

            {(isLoading !== 0) && (<div className={styles.spinnerDiv}>
                <Spinner style={{ width: "3rem", height: "3rem" }} animation="border" variant="primary" />
            </div>)}
        </div>
    )

}


export default Login
