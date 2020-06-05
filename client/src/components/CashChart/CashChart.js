import React, { useState, useEffect } from 'react';
import { Button } from 'kc-react-widgets';
import {
  generateDataArray,
  generateDateArray,
  numberFormatter,
  dateFormatter,
} from '../../lib/calculate.js';
import './CashChart.css';

import {
  VictoryArea,
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryZoomContainer,
  VictoryBrushContainer,
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

let timeout;

const DEBOUNCE_MS = 400;

function CashChart(props) {
  const [updatedData, setUpdatedData] = useState([]);
  const [monthRange, setMonthRange] = useState(3);
  let animation = undefined;
  const graphData = updatedData;

  // If it's generally going "down", then use red as the color, otherwise use
  // green
  let firstValue = 0;
  let lastValue = 0;
  if (graphData.length) {
    firstValue = graphData[0].y;
    lastValue = graphData[graphData.length - 1].y;
  }
  const color = firstValue > lastValue ? red : green;

  // Debounce updating the graph, since this is the slowest part
  function updateDataFromProps() {
    const graphData = generateDataArray(props.calcList, monthRange);
    setUpdatedData(graphData);
  }
  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(updateDataFromProps, DEBOUNCE_MS);
  }, [props.calcList, monthRange]);


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
            animate={animation}
            containerComponent={<VictoryVoronoiContainer/>}
          >
          {/*
          <VictoryArea
            style={{ data: { fill: 'lightgray', stroke: green } }}
            data={posiGraphData}
            labelComponent={<VictoryTooltip/>}
            interpolation={'stepAfter'}
          />
          <VictoryArea
            style={{ data: { fill: 'lightgray', stroke: red } }}
            data={negiGraphData}
            labelComponent={<VictoryTooltip/>}
            interpolation={'stepAfter'}
          />
          */}
          <VictoryArea
            style={{ data: { fill: 'lightgray', stroke: color } }}
            data={graphData}
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
