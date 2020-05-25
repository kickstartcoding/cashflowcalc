import React, { useState } from 'react';
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

function CashChart(props) {
  const [monthRange, setMonthRange] = useState(3);
  const startMoney = props.startingCash || 10000;
  const graphData = generateDataArray(props.calcList, startMoney, monthRange);
  //const posiGraphData = graphData.map(({x, y}) => ({x, y: (y > 0 ? y : 0)}));
  //const negiGraphData = graphData.map(({x, y}) => ({x, y: (y < 0 ? y : 0)}));
  //const posiGraphData = graphData.filter(({y}) => y > 0);
  //const negiGraphData = graphData.filter(({y}) => y < 0);
  //const animation = {duration: 500, easing: 'bounce'};
  //const animation = {duration: 200};
  const animation = undefined;
  console.log('ength', graphData.length);

  // If it's generally going "down", then use red as the color, otherwise use
  // green
  const firstValue = graphData[0].y;
  const lastValue = graphData[graphData.length - 1].y;
  const color = firstValue > lastValue ? red : green;

  return (
    <div className="CashChart">
      <div className="CashChart-buttons">
        {
          monthRanges.map(item => (
            <Button
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
          <VictoryAxis
            fixLabelOverlap
            crossAxis
            scale="time"
            tickFormat={dateFormatter}
            standalone={false}
          />
          <VictoryAxis
            fixLabelOverlap
            dependentAxis
            crossAxis
            tickFormat={numberFormatter}
            standalone={false}
          />
        </VictoryChart>
    </div>
  );
};

export default CashChart;
