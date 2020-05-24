import React from 'react';
import { Link, Switch, Route } from 'react-router-dom'

import './App.css';

import LandingPage from './components/pages/LandingPage/LandingPage.js';
import CashFlowPage from './components/pages/CashFlowPage/CashFlowPage.js';

function App () {
  return (
    <div className="App">
      <nav className="App-navigation">
        <h1 className="App-title">Cash Flow Calc</h1>
        {/*
          <Link to="/">Welcome</Link>
          <Link to="/blog/">Blog</Link>
          <Link to="/write/">Write Article</Link>
        */}
      </nav>

      <div className="App-mainContent">
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/flow/:objectId' component={CashFlowPage} />
        </Switch>
      </div>

    </div>
  );
}

export default App;
