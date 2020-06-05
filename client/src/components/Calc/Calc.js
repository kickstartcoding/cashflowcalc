/*
  The Calc component is a stateless component that represents a single
  recurring transaction or other calculation in the "calc list" on the left of
  the application.
*/
import React from 'react';
import { Button, Card, Input, Dropdown } from 'kc-react-widgets';
import './Calc.css';
import { MdEdit, MdDelete } from "react-icons/md";

/*
  These are the "interval presets", which consist of a textual description, and
  an interval unit (either "once", "days", "weeks", or "months"), and a
  interval quantity. When selected, code below updates the calc object this
  component represents to contain that interval and intervalUnit.
*/
const intervalPresets = [
  {text: 'Once', intervalUnit: 'once'},
  {text: 'Daily', intervalUnit: 'days', interval: 1},
  {text: 'Weekly', intervalUnit: 'weeks', interval: 1},
  {text: 'Twice a month', intervalUnit: 'days', interval: 15},
  {text: 'Monthly', intervalUnit: 'months', interval: 1},
];


/*
  This helper function makes the number-only input cleaner to use. It converts
  the value into a number, and then checks to see if its the special "NaN" (Not
  a Number) value that JavaScript uses to indicate an error occurred while
  trying to convert it into a number. If that's the case, it returns an empty
  string instead.
*/
function cleanNumber(value) {
  const result = Number(value);
  return isNaN(result) ? '' : result;
}

function Calc(props) {
  function onValueChange(value) {
    // See description above about cleanNumber
    const number = cleanNumber(value);
    if (number !== '') {
      props.onValueChange(number);
    }
  }

  function selectPreset(preset) {
    // A preset has been selected in the dropdown. Apply the interval and its
    // unit of measure to the calc object underpinning this component.
    props.onIntervalUnitChange(preset.intervalUnit);
    props.onIntervalChange(preset.interval);
    props.onShowDropdown(); // hide dropdown after selection
  }

  // Use .find to locate the currently selected "preset", based on a condition
  // matching the interval unit AND the interval amount.
  const selectedPreset = intervalPresets.find(preset =>
      preset.intervalUnit === props.intervalUnit &&
      preset.interval === props.interval);

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
