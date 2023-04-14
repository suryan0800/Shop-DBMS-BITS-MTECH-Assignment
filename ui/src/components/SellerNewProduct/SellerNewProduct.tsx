import React, { FC, FormEventHandler, useState } from 'react';
import { SellingProductDTO } from '../../beans/SellingProductDTO';
import { Alert, Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import http from '../../services/CustomAxiosInstance';
import { ReturnDTO } from '../../beans/ReturnDTO';

const SellerNewProduct: FC = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');

    const [productName, setProductName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [sellingPrice, setSellingPrice] = useState<number>(1999)
    const [stock, setStock] = useState<number>(5)

    const [validated, setValidated] = useState(false);

    const onSubmitForm: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        setValidated(true);

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setIsLoading(prevVal => prevVal + 1)
            const productForm: SellingProductDTO = {
                product_name: productName,
                description,
                selling_price: sellingPrice,
                no_of_available_stocks: stock
            }
            console.log(productForm)
            http.post<ReturnDTO>("/api/seller/NewProduct", productForm)
                .then(({ data }) => {
                    setIsLoading(prevVal => prevVal - 1)
                    if (data?.status) {
                        setAlertVariant('success')
                        setAlertMsg(data.statusMsg)
                        setShowModal(true)
                    } else {
                        setAlertVariant('warning')
                        setAlertMsg(`Aaargh, We are unable to publish your product. Better Luck next time!!!. ${data.statusMsg}`)
                        setShowModal(true)
                    }
                })
                .catch((err) => {
                    setIsLoading(prevVal => prevVal - 1)
                    setAlertVariant('warning')
                    setAlertMsg(`Aaargh, We are unable to publish your product. Better Luck next time!!!. ${err.message}`)
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
            <h3>Release New Product</h3>
            <Form noValidate validated={validated} onSubmit={onSubmitForm} className="flex-cotainer">
                <Container>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="product_name">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control required type="text" value={productName} onChange={(event) => {
                                    setProductName(event.target.value)
                                }} placeholder='JBL Tune 760 NC Headphone' />
                                <Form.Text className="text-muted">
                                    Name your product in a way it attracts people to buy
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="product_desc">
                                <Form.Label>Product Description</Form.Label>
                                <Form.Control required as="textarea" rows={3} type="text" value={description} onChange={(event) => {
                                    setDescription(event.target.value)
                                }}
                                    placeholder='Headphone/ Mobile Accessories' />
                                <Form.Text className="text-muted">
                                    Describe so as the product is delightful
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        
                        <Col></Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="sellingPrice">
                                <Form.Label>Selling Price</Form.Label>
                                <Form.Control required min="100" type="number" value={sellingPrice} onChange={(event) => {
                                    event.target.value && setSellingPrice(parseInt(event.target.value))
                                }}
                                    placeholder='5000' />
                                <Form.Text className="text-muted">
                                    Set Competitive Pricing.
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    Choose a minimum of Rs. 100
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="stock">
                                <Form.Label>Stock Available</Form.Label>
                                <Form.Control required min="1" type="number"
                                    value={stock}
                                    onChange={(event) => {
                                        event.target.value && setStock(parseInt(event.target.value))
                                    }} placeholder='5' />
                                <Form.Text className="text-muted">
                                    Stock it up. The more you stock the more you sell. 
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    Please choose a valid no of stock. It is a mandatory field
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col></Col>
                    </Row>

                    <Row>
                        <Col>
                            <Button variant="primary" type="submit">
                                Publish my new product
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
                    <Modal.Title>Product Publish Status</Modal.Title>
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

export default SellerNewProduct