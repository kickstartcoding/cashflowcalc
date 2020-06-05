import React, { useState, useEffect } from 'react';
import {notify} from 'react-notify-toast';
import { Link } from 'react-router-dom'
import { Card } from 'kc-react-widgets';
import CalcList from '../../CalcList/CalcList.js';
import CashChart from '../../CashChart/CashChart.js';
import NavBar from '../../NavBar/NavBar.js';
import './CashFlow.css';

const ENDPOINT = '/api/mongodb/cashflow/';

const DEBOUNCE_MS = 5000; // whenever they stop editing for more than 5 seconds, save
let timeout = null;

function getDefault() {
  return {
    calcList: [
      {
        type: 'income',
        value: 1200,
        intervalUnit: 'once',
        label: 'Starting cash',
      },
      {
        type: 'income',
        value: 2300,
        interval: 15,
        intervalUnit: 'days',
        label: 'paycheck',
      },
      {
        type: 'expense',
        value: 2000,
        interval: 1,
        intervalUnit: 'months',
        label: 'rent',
      },
      {
        type: 'expense',
        value: 15,
        interval: 1,
        intervalUnit: 'days',
        label: 'food',
      },
    ]
  };
}

function CashFlow(props) {
  const hex = props.match.params.hex;
  const [data, setData] = useState(null);

  function showErrorAndRedirectBack() {
    notify.hide();
    notify.show('Could not find chart specified. Double check the URL!');
    props.history.push('/'); // redirect to homepage
  }

  function getData() {
    const url = `${ENDPOINT}?hex=${hex}`;
    // return setData(getDefault()); // Uncomment for backend-less testing
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Got data back', data);
        // Couldn't find anything e.g. 404
        if (data.length < 0) {
          showErrorAndRedirectBack();
          return;
        }

        const cashFlowData = Object.assign(
          {}, // start with empty
          getDefault(), // add in default values
          data[0], // add in data from API
        );
        setData(cashFlowData);
      })
      .catch(err => {
        showErrorAndRedirectBack();
      });
  }

  function updateDatabase() {
    const fetchOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    };
    const url = `${ENDPOINT}?hex=${hex}`;
    fetch(url, fetchOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Save successful', data);
      })
      .catch(err => {
        notify.show('Could not save. Check your connection?');
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

  // Whenever the backend data gets changed, we'll save it to the backend. This
  // clearTimeout and setTimeout causes this to be "debounced", or only occur
  // when changes pause for longer than a certain amount of time (otherwise it
  // might save literally every key stroke, as an example)
  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(updateDatabase, DEBOUNCE_MS);
  }, [data]);

  // Load data immediately
  useEffect(getData, []);

  if (data === null) {
    return (
      <div className="CashFlow">
      </div>
    );
  }

  return (
    <div className="CashFlow">
      <NavBar />
      <div className="CashFlow-sidebar">
        <CalcList
          list={data.calcList}
          onUpdate={onUpdateList}
        />
      </div>
      <div className="CashFlow-graph">
        <Card depth="towering">
          <CashChart
            calcList={data.calcList}
          />
        </Card>
      </div>
    </div>
  );
}

export default CashFlow;
