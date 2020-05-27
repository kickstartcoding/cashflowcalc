import React, {useState} from 'react';
import { Button, Card, Input, Dropdown } from 'kc-react-widgets';
import './Calc.css';


const red = 'tomato';
const green = '#20DA33';

const intervalUnits = [
  /*
  {text: '1st of each month', value: 'month1st'},
  {text: '1st and 15th of each month', value: 'month1st15th'},
  */
  {text: 'Days', value: 'days'},
  {text: 'Weeks', value: 'weeks'},
  {text: 'Months', value: 'months'},
];

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
    <div className="Calc">
      <Card>
        <div className="Calc-type">
          <Card size="small" type={props.type === 'expense' ? 'danger' : 'success'}>
            {props.type.toUpperCase()}
          </Card>
        </div>
        <div className="Calc-label">
          <Input raised
            style={{ width: "100%" }}
            value={props.label}
            onChange={ev => props.onLabelChange(ev.target.value)} />
        </div>
        <div className="Calc-value">
          <Input flat
            style={{ width: "100px" }}
            value={props.value}
            onChange={ev => onValueChange(ev.target.value)}
          />
          per
          <Button
                depth="shallow"
                value={props.isDropdownShown}
                iconEmojiRight={props.isDropdownShown ? '<' : '>'}
                onClick={props.onShowDropdown}>
            {props.interval} {props.intervalUnit}
          </Button>
          <Dropdown
              visible={props.isDropdownShown}
              direction="right"
              style={{width: "450px"}}>
            <Input flat
              style={{ width: "40px" }}
              value={props.interval}
              onChange={ev => onIntervalChange(ev.target.value)}
              type="number"
            />

            {
              intervalUnits.map(item => (
                <Button
                    key={item.value}
                    value={item.value === props.intervalUnit}
                    onClick={() => props.onIntervalUnitChange(item.value)}>
                  {item.text}
                </Button>
              ))
            }

          </Dropdown>
        </div>
      </Card>
    </div>
  );
}

export default Calc;
