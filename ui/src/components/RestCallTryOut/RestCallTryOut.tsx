// client/src/App.js

import React from "react";
import http from "../../services/CustomAxiosInstance";

function RestCallTryOut() {

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    http.get("/api/test/hello")
      .then(({ data }) => setData(data.message))
      .catch((err) => alert("Unable to connect to backend: " + err.message));
  }, []);

  return (
    <div >
      <header className='container p-3 my-3 border'>
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default RestCallTryOut;