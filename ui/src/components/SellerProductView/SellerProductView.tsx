import React, { useState } from 'react'
import { Alert, Button, Card, ListGroup, Spinner } from 'react-bootstrap'
import { SellingProductDTO } from '../../beans/SellingProductDTO'
import http from '../../services/CustomAxiosInstance'
import { useNavigate } from 'react-router-dom'

export const SellerProductView = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(0)
    const [notiShow, setNotiShow] = useState(false)
    const [notiMessage, setNotiMessage] = useState<string>(null)

    const [tableData, setTableData] = useState<SellingProductDTO[]>(null)

    React.useEffect(() => {
        setIsLoading((prevVal) => prevVal + 1)
        http.get<SellingProductDTO[]>("/api/seller/ProductView")
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

    const newProduct = () => {
        navigate('/shop/seller/new_product')
    }

    return (
        <div className='container'>
            <Alert key='danger' variant='danger' show={notiShow} onClose={() => setNotiShow(false)} dismissible>
                <Alert.Heading>Internal Server Error: </Alert.Heading>
                <p>Unable to fetch data from server</p>
                <hr />
                <p> {notiMessage} </p>
            </Alert>
            <h3>Seller Products View</h3>
            <div style={{textAlign: "right", paddingRight: '4%'}} >
                    <Button variant="primary" onClick={() => { newProduct() }}>
                        Publish New Product
                    </Button>
            </div>
            <div className="flex-container">
                {
                    tableData?.map((item, index) => {
                        return (
                            <div key={index}>
                                <Card className="h-100" style={{ width: '25rem' }}>
                                    <Card.Body>
                                        <Card.Title>{item.product_name}</Card.Title>
                                        <Card.Text>
                                            {item.description}
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>
                                            <strong>Selling Price: </strong>
                                            {item.selling_price}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Stock Available: </strong>
                                            {item.no_of_available_stocks}
                                        </ListGroup.Item>
                                    </ListGroup>
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
