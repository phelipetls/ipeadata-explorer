import React, { useState, useEffect, useRef } from "react";

import Chart from "chart.js";
import ChartCanvas from "./ChartCanvas";

import { Slider, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import { Paired12 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer";

Chart.defaults.global.elements.line.fill = false;

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const timeUnits = {
  Mensal: "month",
  Diária: "day",
  Anual: "year",
  Trimestral: "quarter"
};

const DateSlider = withStyles(theme => ({
  root: {
    color: Paired12[0],
    height: 3,
    padding: "13px 0"
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    marginTop: -12,
    marginLeft: -13,
    boxShadow: "#ebebeb 0 2px 2px",
    "&:focus, &:hover, &$active": {
      boxShadow: "#ccc 0 2px 3px 1px"
    },
    "& .bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1
    }
  },
  active: {},
  track: {
    height: 16,
    marginTop: -6
  },
  rail: {
    color: theme.palette.grey[300],
    opacity: 1,
    height: 16,
    marginTop: -6
  }
}))(Slider);

export default function ChartTimeseries({ labels, datasets, metadata }) {
  const chartRef = useRef();

  const min = Date.parse(labels[labels.length - 1]);
  const max = Date.parse(labels[0]);

  const [bounds, setBounds] = useState([min, max]);

  useEffect(() => {
    chartRef.current = new Chart("lineChart", {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          fontSize: 14,
          text: metadata.SERNOME
        },
        legend: {
          position: "bottom"
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: timeUnits[metadata.PERNOME] || "year"
              }
            }
          ],
          yAxes: [
            {
              type: "linear",
              scaleLabel: {
                display: true,
                labelString: metadata.UNINOME
              }
            }
          ]
        },
        plugins: {
          colorschemes: {
            scheme: Paired12
          }
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              return new Date(tooltipItem[0].label).toLocaleDateString();
            }
          }
        }
      }
    });

    return () => chartRef.current.destroy();
  }, [labels, datasets, metadata]);

  useEffect(() => {
    const [min, max] = bounds;

    const ticks = chartRef.current.options.scales.xAxes[0].ticks;
    ticks.min = min;
    ticks.max = max;

    chartRef.current.update(0);
  }, [bounds]);

  return (
    <>
      <ChartCanvas id="lineChart" />
      <DateSlider
        min={min}
        max={max}
        value={bounds}
        step={1000}
        onChange={(e, newBounds) => setBounds(newBounds)}
        valueLabelDisplay="auto"
        valueLabelFormat={value => new Date(value).toLocaleDateString()}
        ValueLabelComponent={ValueLabelComponent}
      />
    </>
  );
}
