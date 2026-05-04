"use client";
import React, { useState } from "react";
import Mapir from "mapir-react-component";

const Map = Mapir.setToken({
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        "x-api-key":
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjE2Y2E3ZTU0YmFhYTA3MzY0ZmRiNzlmYTA4YjI2NzdjZTRkMmY1OWZiOTg4ODZhZmJlZjM1M2JmMmFjMTI0NjM3MjYxMDVhNjlhMzE5NjFmIn0.eyJhdWQiOiIzMDUwMSIsImp0aSI6IjE2Y2E3ZTU0YmFhYTA3MzY0ZmRiNzlmYTA4YjI2NzdjZTRkMmY1OWZiOTg4ODZhZmJlZjM1M2JmMmFjMTI0NjM3MjYxMDVhNjlhMzE5NjFmIiwiaWF0IjoxNzM2NzU4NjkwLCJuYmYiOjE3MzY3NTg2OTAsImV4cCI6MTczOTI2NDI5MCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.hURVCnPpr7lVeU-jbEThN-l_CwJBuB1Ca7_R9demC48q-DfbW2EFZK9gKRd_Buf6M0MjXNZm_BWNRPTm2cMnqQdWN6SrsKqSUWQPmCCI3a0xDZyA_Zcv9Kbuv2KqpGI3-8maPruVPAUNZUrZHAUbmMn4QAZ5L_9uKeN4zp_qdlLn8JORHMx4K38SEsuO6OUnRe_mxbHZUb9zRzNXNRSzqlAIZW_RsTdiuTuealyyRh8ZJoocVKloU4pW8BX2ZfEAZEIGu8rDmJoEj6_cjWHsF_TAOA-ZcHOi7FG-WxiJ21eRyv-KgcU5iEKe-70bKHZNcbc9gqaXM4RaycIzSF3B9g", // Replace with your actual API key
        "Mapir-SDK": "reactjs",
      },
    };
  },
});

const App = ({ locationData, setLocationData }) => {
  const [markerArray, setMarkerArray] = useState([]);
  const [coord, setCoord] = useState([51.42, 35.72]);

  function reverseFunction(map, e) {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;
    const url = `https://map.ir/reverse/no?lat=${lat}&lon=${lng}`;

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjE2Y2E3ZTU0YmFhYTA3MzY0ZmRiNzlmYTA4YjI2NzdjZTRkMmY1OWZiOTg4ODZhZmJlZjM1M2JmMmFjMTI0NjM3MjYxMDVhNjlhMzE5NjFmIn0.eyJhdWQiOiIzMDUwMSIsImp0aSI6IjE2Y2E3ZTU0YmFhYTA3MzY0ZmRiNzlmYTA4YjI2NzdjZTRkMmY1OWZiOTg4ODZhZmJlZjM1M2JmMmFjMTI0NjM3MjYxMDVhNjlhMzE5NjFmIiwiaWF0IjoxNzM2NzU4NjkwLCJuYmYiOjE3MzY3NTg2OTAsImV4cCI6MTczOTI2NDI5MCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.hURVCnPpr7lVeU-jbEThN-l_CwJBuB1Ca7_R9demC48q-DfbW2EFZK9gKRd_Buf6M0MjXNZm_BWNRPTm2cMnqQdWN6SrsKqSUWQPmCCI3a0xDZyA_Zcv9Kbuv2KqpGI3-8maPruVPAUNZUrZHAUbmMn4QAZ5L_9uKeN4zp_qdlLn8JORHMx4K38SEsuO6OUnRe_mxbHZUb9zRzNXNRSzqlAIZW_RsTdiuTuealyyRh8ZJoocVKloU4pW8BX2ZfEAZEIGu8rDmJoEj6_cjWHsF_TAOA-ZcHOi7FG-WxiJ21eRyv-KgcU5iEKe-70bKHZNcbc9gqaXM4RaycIzSF3B9g", // Replace with your actual API key
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLocationData(data);
      });

    setMarkerArray([
      <Mapir.Marker key={lng + lat} coordinates={[lng, lat]} anchor="bottom" />,
    ]);
    setCoord([lng, lat]);
  }

  return (
    <div
      className="App overflow-hidden"
      style={{ textAlign: "center", marginTop: "0px" }}
    >
      <div
        style={{
          width: "100%",
          height: "400px",
          margin: "22px auto 0 auto",
          overflow: "hidden",
          //   border: "2px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <Mapir
          center={coord}
          Map={Map}
          onClick={reverseFunction}
          containerStyle={{
            width: "100%",
            height: "100%",
          }}
        >
          {markerArray}
        </Mapir>
      </div>
      {locationData && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            margin: "0 auto",
          }}
        >
          <p>{locationData.address_compact || "N/A"}</p>
          {/* <p>
            <strong>Coordinates:</strong> {coord[1]}, {coord[0]}
          </p> */}
        </div>
      )}
    </div>
  );
};

export default App;
