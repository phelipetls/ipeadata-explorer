import React, { useEffect, useRef } from "react";

import Chart from "chart.js";
import 'chartjs-adapter-date-fns';
import ChartCanvas from "./ChartCanvas";

import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import { Paired12 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer";

export default function ChartBar({ metadata, period, labels, datasets }) {
  const chartRef = useRef();

  useEffect(() => {
    chartRef.current = new Chart("lineChart", {
      type: "horizontalBar",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          fontSize: 14,
          text: `${metadata.SERNOME} - ${period}`,
        },
        legend: {
          position: "bottom",
        },
        plugins: {
          colorschemes: {
            scheme: Paired12,
          },
        },
      },
    });

    return () => chartRef.current.destroy();
  }, [metadata, period, labels, datasets]);

  return <ChartCanvas id="lineChart" />;
}
