import React, { useState, useEffect, useRef } from "react";

import Chart from "chart.js";
import ChartCanvas from "./ChartCanvas";

import { Slider, Tooltip } from "@material-ui/core";

import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import { Paired12 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer";

Chart.defaults.global.elements.line.fill = false;

const steps = {
  Decenal: 3600 * 24 * 365 * 10,
  Quadrienal: 3600 * 24 * 365 * 4,
  Quinquenal: 3600 * 24 * 365 * 5,
  Anual: 3600 * 24 * 365,
  Mensal: 3600 * 24 * 30,
  Trimestral: 3600 * 24 * 30 * 4,
  Diária: 3600 * 24
};

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

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
        title: {
          text: metadata.SERNOME
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "month"
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
      <Slider
        min={min}
        max={max}
        value={bounds}
        step={steps[metadata.PERNOME] * 1000}
        onChange={(e, newBounds) => setBounds(newBounds)}
        valueLabelDisplay="auto"
        valueLabelFormat={value => new Date(value).toLocaleString()}
        ValueLabelComponent={ValueLabelComponent}
      />
    </>
  );
}
