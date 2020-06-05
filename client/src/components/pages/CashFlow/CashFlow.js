/*
  This is the main page in the app. It displays the page with the chart and the
  transaction editing list (CalcList).
*/
import React, { useState, useEffect } from 'react';
import { notify } from 'react-notify-toast';
import { Card } from 'kc-react-widgets';
import CalcList from '../../CalcList/CalcList.js';
import CashChart from '../../CashChart/CashChart.js';
import NavBar from '../../NavBar/NavBar.js';
import './CashFlow.css';

// The API endpoint used to save & load data from the backend
const ENDPOINT = '/api/mongodb/cashflow/';

// These are used for "debouncing" the auto save feature (see below)
const DEBOUNCE_MS = 5000;
let timeout = null;

/*
  This function does one thing: It returns an object that contains the default
  format for data in this app. It's mixed in as a default value (see below)
  when we load data from the backend, so it's never totally blank.
*/
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
    // Utility function called in the case of a 404, shows notification and
    // redirects back to the homepage.
    notify.hide();
    notify.show('Could not find chart specified. Double check the URL!');
    props.history.push('/'); // redirect to homepage
  }

  function getData() {
    // Debugging tool: Uncomment the following two lines to test purely with
    // default data and skip the backend
    // setData(getDefault());
    // return;

    const url = `${ENDPOINT}?hex=${hex}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // console.log('Got data back', data);

        // Couldn't find anything e.g. 404
        if (data.length < 0) {
          showErrorAndRedirectBack();
          return;
        }

        // The following code is used when we load a "blank object", e.g. when
        // the "Start" button is clicked and a new instance created. It uses
        // the results of "getDefault()" as a set of "default values" and
        // stores the combined version into state.
        const cashFlowData = Object.assign(
          {}, // start with empty
          getDefault(), // add in default values
          data[0], // add in data from API
        );
        setData(cashFlowData);
      })
      .catch(err => {
        // An error occurred (could be connection, or backend server down)
        showErrorAndRedirectBack();
      });
  }

  function updateDatabase() {
    // This function saves to the DB (does an UPDATE or U in CRUD)

    // The react-mern-project-starter API requires we put the data in the body
    // as a JSON formatted string, and use GET parameters to look up what
    // document to update (in this case, the "?hex=" part of the URL.)
    const fetchOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    };
    const url = `${ENDPOINT}?hex=${hex}`;
    fetch(url, fetchOptions)
      .then(response => response.json())
      .then(data => {
        // console.log('Save successful', data);
      })
      .catch(err => {
        // If the request fails, notify the user that it couldn't save
        notify.show('Could not save. Check your connection?');
      });
  }

  function onUpdateList(newList) {
    // This function is invoked whenever ANY change is made to the calculation
    // list (e.g. Editing an amount or adding a new item) . This will update
    // the state variable to replace the old list with this new list.
    setData({
      ...data,
      calcList: newList,
    });
  }

  // Whenever the backend data gets changed, we'll save it to the backend. This
  // clearTimeout and setTimeout causes this to be "debounced", or only occur
  // when changes pause for longer than a certain amount of time (otherwise it
  // might save literally every key stroke, as an example)
  function debouncedUpdateDatabase() {
    clearTimeout(timeout);
    timeout = setTimeout(updateDatabase, DEBOUNCE_MS); // Save
  }
  // Run the function whenever the data variable changes
  useEffect(debouncedUpdateDatabase, [data]);

  // On first visit to the page, load the data immediately
  useEffect(getData, []);

  // If the data is null (haven't loaded), show a blank page
  if (data === null) {
    return (
      <div className="CashFlow"></div>
    );
  }

  // Render the JSX, in this case a NavBar on top, a CalcList (the sidebar of
  // calculations) and a CashChart (the chart itself)
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
