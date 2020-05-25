import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'kc-react-widgets';
import CalcList from '../../CalcList/CalcList.js';
import CashChart from '../../CashChart/CashChart.js';
import './CashFlow.css';

const ENDPOINT = '/api/mongodb/cashflow/';

function getDefault() {
  return {
    calcList: [
      {
        type: 'expense',
        value: -2000,
        interval: 7,
        label: 'payroll for employees',
      },
      {
        type: 'expense',
        value: -3000,
        interval: 30,
        label: 'rent (oakland)',
      },
    ]
  };
}

function CashFlow(props) {
  const objectId = props.match.params.objectId;
  const [data, setData] = useState(null);

  function getData() {
    const url = `${ENDPOINT}?_id=${objectId}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Got data back', data);
        const cashFlowData = Object.assign(
          {}, // start with empty
          getDefault(), // add in default values
          data[0], // add in data from API
        );
        setData(cashFlowData);
      });
  }

  function onUpdateList(newList) {
    // Update the data state variable to include the new calcList, which will
    // have this item added to the end
    setData({
      ...data,
      calcList: newList,
    });
  }

  // Load data immediately
  useEffect(getData, []);

  if (data === null) {
    return (
      <div className="CashFlow">
        Loading...
      </div>
    );
  }

  return (
    <div className="CashFlow">
      <div className="CashFlow-sidebar">
        <CalcList
          list={data.calcList}
          onUpdate={onUpdateList}
        />
      </div>
      <div className="CashFlow-graph">
        <CashChart
          data={data}
        />
      </div>
    </div>
  );
}

export default CashFlow;
