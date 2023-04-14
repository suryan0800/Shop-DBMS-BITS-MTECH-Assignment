import React, { FC, FormEventHandler, useState } from 'react';
import { SellingProductDTO } from '../../beans/SellingProductDTO';
import { Alert, Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderDTO } from '../../beans/OrderDTO';
import http from '../../services/CustomAxiosInstance';
import { ReturnDTO } from '../../beans/ReturnDTO';

const CustomerPlaceOrder: FC = () => {
    const location = useLocation();
    const dto: SellingProductDTO = location.state

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');

    const [quantity, setQuantity] = useState<number>(1)
    const [payment, setPayment] = useState<string>('')
    const [delivAddress, setDelivAddress] = useState<string>('')
    const [delivLoc, setDelivLoc] = useState<string>('')
    const [delivPincode, setDelivPincode] = useState<number>(undefined)
    const [validated, setValidated] = useState(false);

    const onSubmitForm: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        setValidated(true);

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setIsLoading(prevVal => prevVal + 1)
            const orderForm: OrderDTO = {
                selling_product_id: dto.selling_product_id,
                quantity,
                price: dto.selling_price,
                payment_method: payment,
                delivery_address: delivAddress,
                delivery_location: delivLoc,
                delivery_pincode: delivPincode,
            }
            console.log(orderForm)
            http.post<ReturnDTO>("/api/customer/Order", orderForm)
                .then(({ data }) => {
                    setIsLoading(prevVal => prevVal - 1)
                    if (data?.status) {
                        setAlertVariant('success')
                        setAlertMsg(data.statusMsg)
                        setShowModal(true)
                    } else { 
                        setAlertVariant('warning')
                        setAlertMsg(`Aaargh, We are unable to process your order. Better Luck next time!!!. ${data.statusMsg}`)
                        setShowModal(true)
                    }
                })
                .catch((err) => {
                    setIsLoading(prevVal => prevVal - 1)
                    setAlertVariant('warning')
                    setAlertMsg(`Aaargh, We are unable to process your order. Better Luck next time!!!. ${err.message}`)
                    setShowModal(true)
                })
        }
    }

    const back = () => {
        navigate(-1)
    }

    const closeModalHandler = () => {
        setShowModal(false) 
        back() 
    }

    return (
        <div className="container" >
            <h3>Place Order</h3>
            <Form noValidate validated={validated} onSubmit={onSubmitForm} className="flex-cotainer">
                <Container>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="product_name">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control type="text" value={dto.product_name} disabled />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="seller_name">
                                <Form.Label>Seller Name</Form.Label>
                                <Form.Control type="text" value={dto.seller_name} disabled />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="selling_price">
                                <Form.Label>Selling Price</Form.Label>
                                <Form.Control type="number" value={dto.selling_price} disabled />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="quantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control required type="number"
                                    value={quantity}
                                    onChange={(event) => {
                                        event.target.value && setQuantity(parseInt(event.target.value))
                                    }} placeholder='5' />
                                <Form.Text className="text-muted">
                                    Choose the quantity that you delight to order
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    Please choose a valid quantity. It is a mandatory field
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="payment">
                                <Form.Label>Payment Method</Form.Label>
                                <Form.Select required
                                    onChange={(event) => {
                                        setPayment(event.target.value)
                                    }}>
                                    <option value=''>--Select--</option>
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>UPI Payment</option>
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    Choose the Payment method that is most preferable to you
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    You forgot to Pay...
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="delivAddress">
                                <Form.Label>Delivery Address</Form.Label>
                                <Form.Control required as="textarea" rows={3}
                                    onChange={(event) => {
                                        setDelivAddress(event.target.value)
                                    }} placeholder='E-11, Bharathidasan Salai,...' />
                                <Form.Text className="text-muted">
                                    Where do you like the product to be delivered?
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    We cannot deliver you without your address!!
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="delivLoc">
                                <Form.Label>Delivery Location</Form.Label>
                                <Form.Control required type="text"
                                    onChange={(event) => {
                                        setDelivLoc(event.target.value)
                                    }} placeholder='Neyveli, Tamilnadu' />
                                <Form.Text className="text-muted">
                                    Whats your Hometown!!!
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    Delivery Location will really help us locate you.
                                    Please consider filling it.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="delivPincode">
                                <Form.Label>Delivery Pincode</Form.Label>
                                <Form.Control required type="number"
                                    min="100000" max="999999"
                                    onChange={(event) => {
                                        event.target.value && setDelivPincode(parseInt(event.target.value))
                                    }} placeholder='607801' />
                                <Form.Text className="text-muted">
                                    Whats your 6 digit Location Pincode (Help us locate you easily)
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    Please choose a valid Pincode. It is a mandatory and it should be a 6 digit number
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="secondary" onClick={back}>
                                Back
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Form>

            <Modal show={showModal} onHide={closeModalHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant={alertVariant}>
                        {alertMsg}
                    </Alert>
                </Modal.Body>
            </Modal>

            {(isLoading !== 0) && (<div className="spinnerDiv">
                <Spinner style={{ width: "3rem", height: "3rem" }} animation="border" variant="primary" />
            </div>)}
        </div>
    )
}

export default CustomerPlaceOrder