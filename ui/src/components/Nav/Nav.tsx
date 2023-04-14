import React, { FC } from 'react'
import { Nav, Navbar, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { userState } from '../../services/NavService'
import { LoginUser, isAuthenticated, isAuthorized } from '../../beans/LoginUser'

type MyProps = { loginUser: LoginUser }

const Navigation: FC<MyProps> = ({ loginUser }) => {
  const navigate = useNavigate()

  const hasLoggedIn = isAuthenticated(loginUser)
  const hasAccess = (whoCanAccess: string[]) => {
    return isAuthorized(loginUser, whoCanAccess)
  }

  const onLogout = () => {
    sessionStorage.clear()
    userState.next(null)
    navigate("/Login")
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/Home">OSM Shopping</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Nav className="me-auto">
            {hasLoggedIn && <Nav.Link as={Link} to="/Home">Home</Nav.Link>}
            {hasLoggedIn && <Nav.Link as={Link} to="/ClickMe">Click Me!!</Nav.Link>}
            {hasLoggedIn && <Nav.Link as={Link} to="/ClockTimer">Timer</Nav.Link>}
            {hasLoggedIn && <Nav.Link as={Link} to="/restCallTryOut">Call Server</Nav.Link>}

            {/* Shop related links */}
            {hasLoggedIn && hasAccess(['CUST_ITEMS_ORDER_VIEW']) && <Nav.Link as={Link} 
            to="/shop/customer/product_view">Products View</Nav.Link>}
            {hasLoggedIn && hasAccess(['SELL_PRODUCT_UPDATE_VIEW']) && <Nav.Link as={Link} 
            to="/shop/seller/product_view">Selling Products</Nav.Link>}
            {hasLoggedIn && hasAccess(['DELIVER_STATUS_UPDATE_VIEW']) && <Nav.Link as={Link} 
            to="/shop/logistics_worker/order_delivery_status">Order Delivery Status</Nav.Link>}
            {hasLoggedIn && <Nav.Link onClick={onLogout}>Logout</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
    </div>
  )

}


export default Navigation; 