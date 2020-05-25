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
  const [monthRange, setMonthRange] = useState(6);
  const startMoney = props.startingCash || 10000;
  const graphData = generateDataArray(props.calcList, startMoney, monthRange);
  //const posiGraphData = graphData.map(({x, y}) => ({x, y: (y > 0 ? y : 0)}));
  //const negiGraphData = graphData.map(({x, y}) => ({x, y: (y < 0 ? y : 0)}));
  const posiGraphData = graphData.filter(({y}) => y > 0);
  const negiGraphData = graphData.filter(({y}) => y < 0);
  const lastItem = graphData[graphData.length - 1];
  const animation = {duration: 500, easing: 'bounce'};

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
            >
          <VictoryArea
            style={{ data: { fill: 'lightgray', stroke: green } }}
            data={posiGraphData}
            labelComponent={<VictoryTooltip/>}
          />
          <VictoryArea
            style={{ data: { fill: 'lightgray', stroke: red } }}
            data={negiGraphData}
            labelComponent={<VictoryTooltip/>}
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


function disabledCode() {
  /*const [zoomDomain, setZoomDomain] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  */
  let [zoomDomain, setZoomDomain] = [null, null];
  let [selectedDomain, setSelectedDomain] = [null, null];
  let props = null;


  const graphData = generateDataArray(props.calcList);

  const minY = Math.min(...graphData.map(({y}) => y));
  const maxY = Math.max(...graphData.map(({y}) => y));
  const today = new Date();


  const tinyGraphTicks = [
    new Date(2020, 1, 1),
    new Date(2025, 1, 1),
    new Date(2030, 1, 1),
    new Date(2035, 1, 1),
  ];

  return (
    <div className="CashChart">
      <VictoryChart
        width={550}
        height={300}
        scale={{x: "time"}}
        animate={{ duration: 500 }}
        containerComponent={
          <VictoryZoomContainer
            domain={{y: [minY, maxY]}}
            zoomDimension="x"
            zoomDomain={zoomDomain}
            onZoomDomainChange={setZoomDomain}
          />
        }
      >
        {/*responsive={false}*/}
        <VictoryLine
          style={{
            data: {stroke: "tomato"}
          }}
          data={graphData}
        />

      </VictoryChart>

      <VictoryChart
        width={550}
        height={90}
        scale={{x: "time"}}
        padding={{top: 0, left: 50, right: 50, bottom: 30}}
        containerComponent={
          <VictoryBrushContainer
            brushDimension="x"
            brushDomain={selectedDomain}
            onBrushDomainChange={setZoomDomain}
          />
        }
      >
        <VictoryAxis
          tickValues={tinyGraphTicks}
          tickFormat={(x) => new Date(x).getFullYear()}
        />
        <VictoryLine
          style={{
            data: {stroke: "tomato"}
          }}
          data={graphData}
        />
      </VictoryChart>
    </div>
  );
}

export default CashChart;
