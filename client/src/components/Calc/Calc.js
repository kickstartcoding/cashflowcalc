import React from 'react';
import { Button } from 'kc-react-widgets';
import './Calc.css';

function Calc(props) {
  return (
    <div className="Calc">
      <p className="Calc-label">{props.label}</p>
      <p className="Calc-type">{props.type}</p>
      <p className="Calc-value">
        <input
          value={props.value}
          onChange={ev => props.onValueChange(ev.target.value)}
        /> per <input
          value={props.interval}
          onChange={ev => props.onIntervalChange(ev.target.value)}
        />
      </p>
    </div>
  );
}

export default Calc;
