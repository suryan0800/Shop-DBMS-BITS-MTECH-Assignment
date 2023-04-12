import React, { useState } from "react";
import http from "../../services/CustomAxiosInstance";
import { Alert } from "react-bootstrap";

function RestCallTryOut() {

  const [notiShow, setNotiShow] = useState(false)
  const [notiMessage, setNotiMessage] = useState<string>(null)

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    http.get("/api/test/hello")
      .then(({ data }) => setData(data.message))
      .catch((err) => {
        setNotiShow(true)
        setNotiMessage(err.message)
      });
  }, []);

  return (
    <div className='container p-3 my-3 border'>
      <Alert key='danger' variant='danger' show={notiShow} onClose={() => setNotiShow(false)} dismissible>
        <Alert.Heading>Internal Server Error: </Alert.Heading>
        <p>Unable to fetch data from server</p>
        <hr />
        <p> {notiMessage} </p>
      </Alert>
      <header>
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default RestCallTryOut;