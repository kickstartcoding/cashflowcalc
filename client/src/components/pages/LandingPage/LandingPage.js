import React, { useState } from 'react';
import { notify } from 'react-notify-toast';
import { Link, Redirect } from 'react-router-dom'
import { Button } from 'kc-react-widgets';
import { MdShowChart } from 'react-icons/md';

import './LandingPage.css';
import logo from '../../NavBar/logo.png';

const ENDPOINT = '/api/mongodb/cashflow/';

function LandingPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newCashFlowHex, setNewCashFlowHex] = useState(null);

  function createNew() {
    if (isCreating) {
      // Already in the process of creating a new one, don't show
      return;
    }
    setIsCreating(true);
    notify.show('Creating a brand new chart just for you!');

    const formData = {}; // empty for now
    fetch(ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        setIsCreating(false);
        // console.log('Data received:', data);

        // Data came back, let's retrieve the database's ObjectID for this new
        // object, and set that to state
        const hex = data.results.ops[0].hex;
        console.log('data results', hex);
        setNewCashFlowHex(hex);
      })
      .catch(err => {
        console.log('Error:', err);
        setIsCreating(false);
        notify.hide();
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
        <img src={logo} className="LandingPage-logo" />
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
