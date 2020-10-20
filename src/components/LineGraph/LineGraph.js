import React from "react";

import "./LineGraph.css";

import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { Typography } from "@material-ui/core";

const options = {
  legend: { display: false },
  maintainAspectRatio: false,
  elements: {
    point: {
      radius: 0,
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildData = (data) => {
  const pointSet = [];
  let previousValue;
  for (let date in data) {
    if (previousValue) {
      pointSet.push({ x: date, y: data[date] - previousValue });
    }
    previousValue = data[date];
  }
  return pointSet;
};

const colorType = {
  cases: {
    backgroundColor: "rgba(202, 11, 47, 0.4)",
    borderColor: "#CA0B2F",
  },
  recovered: {
    backgroundColor: "rgba(46, 204, 113, 0.4)",
    borderColor: "#2ecc71",
  },
  deaths: {
    backgroundColor: "rgba(189, 195, 199, 0.4)",
    borderColor: "#bdc3c7",
  },
};

function LineGraph({ graphData, casesType }) {
  return (
    <div className='lineGraph'>
      <Typography variant='h5' className='lineGraph__title'>
        Worldwide new cases
      </Typography>
      <Line
        options={options}
        data={{
          datasets: [
            {
              data: buildData(graphData),
              fill: true,
              backgroundColor: colorType[casesType].backgroundColor,
              borderColor: colorType[casesType].borderColor,
            },
          ],
        }}
      />
    </div>
  );
}

export default LineGraph;
