import React, { useState } from 'react';
import { Button } from 'kc-react-widgets';
import './CalcList.css';

function CalcList(props) {
  const calcs = [
    {
      type: 'expense',
      value: -2000,
      interval: 7,
      label: 'payroll for employees',
    },
    {
      type: 'expense',
      value: -3000,
      interval: 30,
      label: 'rent (oakland)',
    },
  ];


  return (
    <div className="CalcList">
      calcs.map(calc => (
        <div className="CalcList-calc">
          <p>{calc.label}</p>
          <p>{calc.type}</p>
          <p>
            <input
              value={calc.value}
              onChange={(ev) => onInputChange(calc, ev.target.value)}
            /> per {calc.interval}
          </p>
        </div>
      ));
    </div>
  );
}



