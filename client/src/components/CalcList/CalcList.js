import React from 'react';
import { Button } from 'kc-react-widgets';
import Calc from '../Calc/Calc.js';
import './CalcList.css';

function CalcList(props) {
  function create(type) {
    const newItem = {
      type, // (equivalent to "type": type)
      value: 1000,
      interval: '30',
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

  return (
    <div className="CalcList">
      <div className="CalcList-list">
        {
          props.list.map((calc, index) => (
            <Calc
              key={index}
              onValueChange={value => updateCalc(index, {value})}
              onIntervalChange={interval => updateCalc(index, {interval})}
              onLabelChange={label => updateCalc(index, {label})}
              {...calc}
            />
          ))
        }
      </div>

      <div className="CalcList-buttonGroup">
        <Button type="success" onClick={createIncome}>+ Income</Button>
        <Button type="danger" onClick={createExpense}>+ Expense</Button>
      </div>
    </div>
  );
}

export default CalcList;
