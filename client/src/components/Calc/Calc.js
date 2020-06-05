import React, {useState} from 'react';
import { Button, Card, Input, Dropdown } from 'kc-react-widgets';
import './Calc.css';
import { MdEdit, MdDelete } from "react-icons/md";

const red = 'tomato';
const green = '#20DA33';

const intervalPresets = [
  {text: 'Once', intervalUnit: 'once'},
  {text: 'Daily', intervalUnit: 'days', interval: 1},
  {text: 'Weekly', intervalUnit: 'weeks', interval: 1},
  {text: 'Twice a month', intervalUnit: 'days', interval: 15},
  {text: 'Monthly', intervalUnit: 'months', interval: 1},
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

  function selectPreset(preset) {
    props.onIntervalUnitChange(preset.intervalUnit);
    props.onIntervalChange(preset.interval);
    props.onShowDropdown(); // hide after selection
  }

  // Use .find to locate the currently selected "preset"
  const selectedPreset = intervalPresets.find(preset =>
      preset.intervalUnit === props.intervalUnit &&
      preset.interval === props.interval);
  console.log('this is selected preset:', selectedPreset);

  return (
    <div className="Calc">
      <Card depth="towering">
        <div className="Calc-type">
        </div>
        <div className="Calc-label">
          <Input
            flat={true}
            value={props.label}
            onChange={ev => props.onLabelChange(ev.target.value)} />
          <Card
              size="small"
              type={props.type === 'expense' ? 'danger' : 'success'}
              inset={true}>
            {props.type.toUpperCase()}
          </Card>
        </div>
        <div className="Calc-value">
          <Input
            flat={true}
            style={{ width: "100px" }}
            value={props.value}
            onChange={ev => onValueChange(ev.target.value)}
          />

          {selectedPreset.text.toLowerCase()}

          <Button
              size={'small'}
              depth="shallow"
              value={props.isDropdownShown}
              onClick={props.onShowDropdown}>
              <MdEdit />
          </Button>
        </div>
      </Card>
      <Dropdown
          visible={props.isDropdownShown}
          style={{width: "450px"}}>
        {
          intervalPresets.map(preset => (
            <Button
                key={preset.text}
                value={preset.text === selectedPreset.text}
                onClick={() => selectPreset(preset)}>
              {preset.text}
            </Button>
          ))
        }

        <hr />

        <Button onClick={props.onRemoveCalc} size="small" type="danger">
          <MdDelete /> Remove
        </Button>
      </Dropdown>

    </div>
  );
}

export default Calc;
