import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Notifications from 'react-notify-toast';


import './App.css';

import LandingPage from './components/pages/LandingPage/LandingPage.js';
import CashFlow from './components/pages/CashFlow/CashFlow.js';

function App () {
  return (
    <div className="App">
      <Notifications />
      <div className="App-mainContent">
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/new' component={LandingPage} />
          <Route exact path='/chart/:hex' component={CashFlow} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
