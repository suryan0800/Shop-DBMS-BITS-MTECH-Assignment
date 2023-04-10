import React, { useState, FormEventHandler } from 'react'
import axios from 'axios'
import { userState } from '../../services/NavService'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')

    const handleLogin: FormEventHandler = (event) => {
        event.preventDefault()
        alert('A name was submitted: ' + user)

        axios
            .post('/user/Login', {
                userName: user,
                password: pass
            })
            .then(({ data }) => {
                userState.next(data)
                sessionStorage.setItem("userdata", JSON.stringify(data))
                sessionStorage.setItem("jwtToken", data.jwtToken)
                navigate("/Home")
            })
    }

    return (
        <div style={{ width: '40%', marginLeft: '5%' }}>
            <form onSubmit={handleLogin}>
                <h3>Sign In</h3>
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
                <br />
                <button type="submit" className="btn btn-primary btn-block">Submit</button>

            </form>
        </div>
    )

}


export default Login
