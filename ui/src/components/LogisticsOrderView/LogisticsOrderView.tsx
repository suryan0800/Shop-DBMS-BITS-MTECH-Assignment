import React, { useState } from 'react'
import { Alert, Button, Card, ListGroup, Modal, Spinner } from 'react-bootstrap'
import http from '../../services/CustomAxiosInstance'
import { OrderDTO } from '../../beans/OrderDTO'
import { ReturnDTO } from '../../beans/ReturnDTO'

export const LogisticsOrderView = () => {
    const [isLoading, setIsLoading] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');

    const [notiShow, setNotiShow] = useState(false)
    const [notiMessage, setNotiMessage] = useState<string>(null)

    const [tableData, setTableData] = useState<OrderDTO[]>(null)

    const fetchOrderDetails = () => {
        setIsLoading((prevVal) => prevVal + 1)
        http.get<OrderDTO[]>("/api/logistics/OrderView")
            .then(({ data }) => {
                setTableData(data)
                setIsLoading((prevVal) => prevVal - 1)
            })
            .catch((err) => {
                setNotiShow(true)
                setNotiMessage(err.message)
                setIsLoading((prevVal) => prevVal - 1)
            });
    }

    React.useEffect(() => {
        fetchOrderDetails()
    }, []);


    const updateDelivStatus = (dto: OrderDTO) => {
        setIsLoading(prevVal => prevVal + 1)
        const orderDelivStatusForm: OrderDTO = {
            order_id: dto.order_id
        }
        console.log(orderDelivStatusForm)
        http.post<ReturnDTO>("/api/logistics/UpdateDeliveryStatus", orderDelivStatusForm)
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

    const closeModalHandler = () => {
        setShowModal(false)
        fetchOrderDetails()
    }

    return (
        <div className='container'>
            <Alert key='danger' variant='danger' show={notiShow} onClose={() => setNotiShow(false)} dismissible>
                <Alert.Heading>Internal Server Error: </Alert.Heading>
                <p>Unable to fetch data from server</p>
                <hr />
                <p> {notiMessage} </p>
            </Alert>
            <h3>Logistics Worker - Order View</h3>
            <div className="flex-container">
                {
                    tableData?.map((item, index) => {
                        return (
                            <div key={index}>
                                <Card className="h-100" style={{ width: '25rem' }}>
                                    <Card.Body>
                                        <Card.Title>{item.customer_name}</Card.Title>
                                        <Card.Text>
                                            Delivery Address: {item.delivery_address}
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>
                                            <strong>Order Status: </strong>
                                            {item.delivery_status}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>No of Items Ordered: </strong>
                                            {item.quantity}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Delivery Location: </strong>
                                            {item.delivery_location}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Delivery Pincode: </strong>
                                            {item.delivery_pincode}
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Card.Body>
                                        <Button disabled={item.logistics_worker_mail_id !== null}
                                            variant="primary"
                                            onClick={() => { updateDelivStatus(item) }}>
                                            Mark as delivered
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    })
                }
            </div>

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
