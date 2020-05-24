import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Button } from 'kc-react-widgets';

import './LandingPage.css';

const ENDPOINT = '/api/mongodb/cashflow/';

function LandingPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newCashFlowId, setNewCashFlowId] = useState(null);

  function createNew() {
    setIsCreating(true);

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
        const dbId = data.results.insertedIds[0];
        setNewCashFlowId(dbId);
      });
  }


  if (newCashFlowId) {
    // If we have gotten an ID for our new object, let's redirect to that page
    // instead of rendering here
    const newUri = `/flow/${newCashFlowId}`;
    return (
      <Redirect to={newUri}/>
    );
  }

  return (
    <div className="LandingPage">
      <header className="LandingPage-header">
        <p>Quickly calculate your personal or business finances.</p>
        {
          isCreating ? (
            'Creating...'
          ) : (
            <Button
                type="success"
                size="gigantic"
                depth="towering"
                onClick={createNew}>
              Start!
            </Button>
          )
        }
      </header>
    </div>
  );
}

export default LandingPage;
