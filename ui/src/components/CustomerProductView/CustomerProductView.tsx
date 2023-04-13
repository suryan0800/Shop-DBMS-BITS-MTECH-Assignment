import React, { useState } from 'react'
import { Alert, Button, Card, ListGroup, Spinner, Table } from 'react-bootstrap'
import { SellingProductDTO } from '../../beans/SellingProductDTO'
import http from '../../services/CustomAxiosInstance'
import { useNavigate } from 'react-router-dom'

export const CustomerProductView = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(0)
    const [notiShow, setNotiShow] = useState(false)
    const [notiMessage, setNotiMessage] = useState<string>(null)

    const [tableData, setTableData] = useState<SellingProductDTO[]>(null)

    React.useEffect(() => {
        setIsLoading((prevVal) => prevVal + 1)
        http.get<SellingProductDTO[]>("/api/customer/ProductView")
            .then(({ data }) => {
                setTableData(data)
                setIsLoading((prevVal) => prevVal - 1)
            })
            .catch((err) => {
                setNotiShow(true)
                setNotiMessage(err.message)
                setIsLoading((prevVal) => prevVal - 1)
            });
    }, []);

    const placeOrder = (dto: SellingProductDTO) => {
        navigate('/shop/customer/order', {state: dto})
    }

    return (
        <div className='container'>
            <Alert key='danger' variant='danger' show={notiShow} onClose={() => setNotiShow(false)} dismissible>
                <Alert.Heading>Internal Server Error: </Alert.Heading>
                <p>Unable to fetch data from server</p>
                <hr />
                <p> {notiMessage} </p>
            </Alert>
            <h3>Customer Products View</h3>
            <div className="flex-container">
                {
                    tableData?.map((item, index) => {
                        return (
                            <div key={index}>
                                <Card style={{ width: '25rem' }}>
                                    <Card.Body>
                                        <Card.Title>{item.product_name}</Card.Title>
                                        <Card.Text>
                                            {item.description}
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>
                                            <strong>Selling Price: </strong>
                                            {item.product_name}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Stock Available: </strong>
                                            {item.no_of_available_stocks}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Seller Name: </strong>
                                            {item.seller_name}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Seller Location: </strong>
                                            {item.location_nm}
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Card.Body>
                                        <Button variant="primary" onClick={() => {placeOrder(item)}}>
                                            Order ({item.selling_product_id})
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    })
                }
            </div>

            {(isLoading !== 0) && (<div className="spinnerDiv">
                <Spinner style={{ width: "3rem", height: "3rem" }} animation="border" variant="primary" />
            </div>)}
        </div>
    )
}
