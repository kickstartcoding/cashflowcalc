import React from 'react';
import { Button } from 'kc-react-widgets';
import './Calc.css';


const red = 'tomato';
const green = '#20DA33';

function cleanNumber(value) {
  const result = Number(value);
  return isNaN(result) ? '' : result;
}

function Calc(props) {
  const backgroundColor = props.type === 'expense' ? red : green;
  const style = {backgroundColor};
  function onValueChange(value) {
    const number = cleanNumber(value);
    if (number !== '') {
      props.onValueChange(number);
    }
  }
  function onIntervalChange(value) {
    const number = cleanNumber(value);
    if (number !== '') {
      props.onIntervalChange(number);
    }
  }
  return (
    <div className="Calc" style={style}>
      <p className="Calc-label">
        <input
          value={props.label}
          onChange={ev => props.onLabelChange(ev.target.value)} />
      </p>
      <p className="Calc-type">{props.type}</p>
      <p className="Calc-value">
        <input
          value={props.value}
          onChange={ev => onValueChange(ev.target.value)}
        /> per <input
          value={props.interval}
          onChange={ev => onIntervalChange(ev.target.value)}
        />
      </p>
    </div>
  );
}

export default Calc;
