/*
  CashChart actually displays the chart. It uses the helper functions in
  src/lib/dataGeneration to create the chart's actual data based on the
  calculation list, and then renders the chart using the VictoryChart library.
*/
import React, { useState, useEffect } from 'react';
import { Button } from 'kc-react-widgets';
import {
  generateDataArray,
  generateTransactionArray,
} from '../../lib/dataGeneration.js';
import { numberFormatter, dateFormatter } from '../../lib/formatters.js';
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

// An array that holds the time range options
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
  // chartData is the data that will actually be shown in the chart (e.g. an
  // array of cash quantities at different points of time)
  const [chartData, setChartData] = useState([]);

  // The currently selected month range
  const [monthRange, setMonthRange] = useState(3);

  // If it starts higher than it ends, use red as the line color, else green
  let color = green;
  if (chartData.length && chartData[0].y > chartData[chartData.length - 1].y) {
    color = red;
  }

  // The updateChart function actually causes the chart to refresh, by
  // generating an array of transactions based on the user's list of
  // calculations, and then using that to generate the actual data to be
  // charted in the format Victory Charts expects
  function updateChart() {
    const transactions = generateTransactionArray(props.calcList, monthRange);
    const newChartData = generateDataArray(transactions);
    setChartData(newChartData);
  }

  // Debounce generating the data and updating the graph, since this is the
  // slowest part and it happening "on every key-stroke" can be too much
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
