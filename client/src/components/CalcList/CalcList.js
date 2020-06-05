import React, {useState} from 'react';
import { Button } from 'kc-react-widgets';
import Calc from '../Calc/Calc.js';
import './CalcList.css';
import { MdAddBox } from "react-icons/md";

function CalcList(props) {
  const [showDropdown, setShowDropdown] = useState(null);

  function create(type) {
    const newItem = {
      type: type,
      value: 1000,
      interval: 1,
      intervalUnit: 'months',
      label: `New ${type}`,
    };
    props.onUpdate([
      ...props.list,
      newItem,
    ]);
  }

  function createIncome() {
    create('income');
  }

  function createExpense() {
    create('expense');
  }

  /*
    Update the calculation at the given index with the new data specified.
    Example:
              updateCalc(2, {interval: 10})
    (Would set the item at props.list[2] to have interval 10 while keeping the
    other values the same)
  */
  function updateCalc(index, newData) {
    const oldData = props.list[index]; // Get the current object for this item
    const newCalc = {
        ...oldData, // include the old values in the new object
        ...newData, // update the value with the new given value
    };
    props.onUpdate([
      ...props.list.slice(0, index), // include items before this one
      newCalc, // include this item
      ...props.list.slice(index + 1), // include items after
    ]);
  }

  function deleteCalc(index) {
    props.onUpdate([
      ...props.list.slice(0, index), // include items before this one
      ...props.list.slice(index + 1), // include items after
    ]);
    setShowDropdown(null); // show no dropdown
  }

  /*
    This toggles the dropdown visibility at the given index
  */
  function toggleDropdown(index) {
    if (index === showDropdown) {
      setShowDropdown(null); // show no dropdown
    } else {
      setShowDropdown(index); // show this dropdown
    }
  }

  return (
    <div className="CalcList">
      <div className="CalcList-list">
        {
          props.list.map((calc, index) => (
            <Calc
              key={index}
              onValueChange={value => updateCalc(index, {value})}
              onIntervalChange={(interval, intervalUnit) =>
                updateCalc(index, {interval, intervalUnit})}
              onLabelChange={label => updateCalc(index, {label})}
              onShowDropdown={() => toggleDropdown(index)}
              onRemoveCalc={() => deleteCalc(index)}
              isDropdownShown={index === showDropdown}
              type={calc.type}
              value={calc.value}
              interval={calc.interval}
              intervalUnit={calc.intervalUnit}
              label={calc.label}
            />
          ))
        }
      </div>

      <div className="CalcList-buttonGroup">
        <Button type="success" onClick={createIncome}><MdAddBox /> Income</Button>
        <Button type="danger" onClick={createExpense}><MdAddBox />  Expense</Button>
      </div>
    </div>
  );
}

export default CalcList;
