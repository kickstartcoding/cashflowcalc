import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Button } from 'kc-react-widgets';


import './LandingPage.css';

function LandingPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newCashFlowId, setNewCashFlowId] = useState(null);

  function createNew() {
    setIsCreating(true);

    const formData = {}; // empty for now
    fetch('/api/mongodb/cashflow/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        setIsCreating(false);
        console.log('Got this back', data);
        const dbId = data.results.insertedIds[0];
        setNewCashFlowId(dbId);

        // Redirect to blog
        //setCreatingStage(2);
        //props.history.push('/blog/');
      });
  }


  if (newCashFlowId) {
    const newUri = `/flow/${newCashFlowId}`;
    return (
      <Redirect to={newUri}/>
    );
  }

  return (
    <div className="LandingPage">
      <header className="LandingPage-header">
        <p>Quickly calculate your personal or business finances.</p>
        <Button
            type="success"
            size="gigantic"
            depth="towering"
            onClick={createNew}>
          Start!
        </Button>
      </header>
    </div>
  );
}

export default LandingPage;
