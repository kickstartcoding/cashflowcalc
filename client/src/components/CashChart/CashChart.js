import React, { useState, useEffect } from 'react';
import { Button } from 'kc-react-widgets';
import {
  generateDataArray,
  numberFormatter,
  dateFormatter,
} from '../../lib/calculate.js';
import './CashChart.css';

import {
  VictoryArea,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory';

const red = 'tomato';
const green = '#20DA33';

const monthRanges = [
  {text: '3 Mo', value: 3},
  {text: '6 Mo', value: 6},
  {text: '1 Yr', value: 12},
  {text: '3 Yr', value: 36},
];

// Used to debounce updating the chart (see below)
let timeout;
const DEBOUNCE_MS = 400;

function CashChart(props) {
  const [chartData, setChartData] = useState([]);
  const [monthRange, setMonthRange] = useState(3);

  // If it's generally going "down", then use red as the color, otherwise use
  // green
  let firstValue = 0;
  let lastValue = 0;
  if (chartData.length) {
    firstValue = chartData[0].y;
    lastValue = chartData[chartData.length - 1].y;
  }
  const color = firstValue > lastValue ? red : green;

  // Debounce updating the graph, since this is the slowest part
  function updateChart() {
    const newChartData = generateDataArray(props.calcList, monthRange);
    setChartData(newChartData);
  }
  function debouncedUpdateChart() {
    clearTimeout(timeout);
    timeout = setTimeout(updateChart, DEBOUNCE_MS);
  }
  useEffect(debouncedUpdateChart, [props.calcList, monthRange]);


  return (
    <div className="CashChart">
      <div className="CashChart-buttons">
        {
          monthRanges.map(item => (
            <Button
                size="small"
                key={item.value}
                value={item.value === monthRange}
                onClick={() => setMonthRange(item.value)}>
              {item.text}
            </Button>
          ))
        }
      </div>
      <VictoryChart
          theme={VictoryTheme.material}
          containerComponent={<VictoryVoronoiContainer/>}>
        <VictoryArea
          style={{ data: { fill: 'lightgray', stroke: color } }}
          data={chartData}
          labelComponent={<VictoryTooltip/>}
          interpolation={'stepAfter'}
        />
        <VictoryAxis fixLabelOverlap crossAxis
          scale="time"
          tickFormat={dateFormatter}
          standalone={false}
        />
        <VictoryAxis fixLabelOverlap dependentAxis crossAxis
          tickFormat={numberFormatter}
          standalone={false}
        />
      </VictoryChart>
    </div>
  );
};

export default CashChart;
