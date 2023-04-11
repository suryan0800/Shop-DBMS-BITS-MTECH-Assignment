import React, { FC } from 'react'
import { Nav, Navbar, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { userState } from '../../services/NavService'
import { LoginUser, isAuthenticated } from '../../beans/LoginUser'

type MyProps = { loginUser: LoginUser }

const Navigation: FC<MyProps> = (props) => {
  const navigate = useNavigate()

  const hasAccess = isAuthenticated(props.loginUser)

  const onLogout = () => {
    sessionStorage.clear()
    userState.next(null)
    navigate("/Login")
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/myComponent1">OSM Shopping</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Nav className="me-auto">
            {hasAccess && <Nav.Link as={Link} to="/Home">Home</Nav.Link>}
            {hasAccess && <Nav.Link as={Link} to="/myComponent1">Click Me!!</Nav.Link>}
            {hasAccess && <Nav.Link as={Link} to="/myComponent2">Timer</Nav.Link>}
            {hasAccess && <Nav.Link as={Link} to="/restCallTryOut">Call Server</Nav.Link>}
            {hasAccess && <Nav.Link onClick={onLogout}>Logout</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
    </div>
  )

}


export default Navigation; 