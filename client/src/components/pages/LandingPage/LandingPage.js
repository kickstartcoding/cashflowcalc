/*
  This is the first page in the app. It describes the application, and offers a
  big inviting button to get you going.
*/
import React, { useState } from 'react';
import { notify } from 'react-notify-toast';
import { Redirect } from 'react-router-dom'
import { Button } from 'kc-react-widgets';
import { MdShowChart } from 'react-icons/md';

import './LandingPage.css';
import logo from '../../NavBar/logo.png';

const ENDPOINT = '/api/mongodb/cashflow/';

function LandingPage() {
  // isCreating is used to prevent accidental "double clicks"
  const [isCreating, setIsCreating] = useState(false);

  // newCashFlowHex is set to indicate we successfully created a new cash flow,
  // and have gotten the hexadecimal ID for it.
  const [newCashFlowHex, setNewCashFlowHex] = useState(null);

  function createNew() {
    if (isCreating) {
      return; // Already clicked, prevent double click
    }
    setIsCreating(true);
    notify.show('Creating a brand new chart just for you!');

    // This starts the new database document off as an empty object. This could
    // have been the default or initial values here, but the way this
    // application chose to do it is in the CashFlow page it gives it defaults.
    const formData = {};
    const fetchOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    };
    fetch(ENDPOINT, fetchOptions)
      .then(response => response.json())
      .then(data => {
        setIsCreating(false);
        // console.log('Data received:', data);

        // The data.results.ops array contains the successfully created data.
        // In this case, it also contains a "hex value" that was created on the
        // backend and inserted into the document.
        const hex = data.results.ops[0].hex;
        setNewCashFlowHex(hex);
      })
      .catch(err => {
        // Connection issue, or backend server down: Notify the user
        setIsCreating(false);
        notify.hide(); // hide existing notifications
        notify.show('An error occurred while creating your chart, try again later.');
      });
  }


  if (newCashFlowHex) {
    // If we have gotten an ID for our new object, let's redirect to that page
    // instead of rendering here
    const newUri = `/chart/${newCashFlowHex}`;
    return (
      <Redirect to={newUri}/>
    );
  }

  return (
    <div className="LandingPage">
      <header className="LandingPage-header">
        <img src={logo} className="LandingPage-logo" alt="Cash Flow Calc" />
        <h1>Cash Flow Calc</h1>
        <p>Quickly chart your personal or business finances.</p>

        <Button
            type="success"
            size="gigantic"
            depth="towering"
            onClick={createNew}>
          <MdShowChart /> Start!
        </Button>
      </header>
    </div>
  );
}

export default LandingPage;
