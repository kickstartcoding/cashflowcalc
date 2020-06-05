import React, {useState} from 'react';
import { Button, Card, Input } from 'kc-react-widgets';
import Calc from '../Calc/Calc.js';
import './CalcList.css';
import { MdAddBox } from "react-icons/md";


function CalcList(props) {
  const [showDropdown, setShowDropdown] = useState(null);

  function create(type) {
    const newItem = {
      type, // (equivalent to {"type": type})
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

  function updateCalc(index, newData) {
    const oldCalc = props.list[index]; // Get the current object for this item
    const newCalc = {
        ...oldCalc, // include the old values in the new object
        ...newData, // update the value with the new given value
    };
    props.onUpdate([
      ...props.list.slice(0, index), // include items before this one
      newCalc, // include this item
      ...props.list.slice(index + 1), // include items after
    ]);
  }

  function toggleDropdown(index) {
    if (index === showDropdown) {
      setShowDropdown(null); // show no dropdown
    } else {
      setShowDropdown(index); // show this dropdown
    }
  }

  function deleteCalc(index) {
    props.onUpdate([
      ...props.list.slice(0, index), // include items before this one
      ...props.list.slice(index + 1), // include items after
    ]);
    setShowDropdown(null); // show no dropdown
  }

  return (
    <div className="CalcList">
      <div className="CalcList-list">
        {
          props.list.map((calc, index) => (
            <Calc
              key={index}
              sortId={index}
              onSortItems={newList => props.onUpdate(newList)}
              items={props.list}
              onValueChange={value => updateCalc(index, {value})}
              onIntervalChange={interval => updateCalc(index, {interval})}
              onIntervalUnitChange={intervalUnit => updateCalc(index, {intervalUnit})}
              onLabelChange={label => updateCalc(index, {label})}
              onShowDropdown={() => toggleDropdown(index)}
              onRemoveCalc={() => deleteCalc(index)}
              isDropdownShown={index === showDropdown}
              {...calc}
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
