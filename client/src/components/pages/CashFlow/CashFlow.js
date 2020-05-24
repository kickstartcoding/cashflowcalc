import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'kc-react-widgets';
import CalcList from '../../CalcList/CalcList.js';
import './CashFlow.css';

const ENDPOINT = '/api/mongodb/cashflow/';

function CashFlow(props) {
  const objectId = props.match.params.objectId;
  const [data, setData] = useState(null);

  function getData() {
    const url = `${ENDPOINT}?_id=${objectId}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Got data back', data);
        setData(data[0]);
      });
  }

  // Load data immediately
  useEffect(getData, []);

  if (data === null) {
    return (
      <div className="CashFlow">
        Loading...
      </div>
    )
  }

  return (
    <div className="CashFlow">
      <div className="CashFlow-sidebar">
        Ready to go!
        <CalcList />
      </div>
      <div className="CashFlow-graph">
        Ready to go!
      </div>
    </div>
  );
}

export default CashFlow;
