import { makeStyles } from "@material-ui/styles";
import {
  BarController,
  CategoryScale,
  Chart,
  Legend,
  Line,
  LinearScale,
  LineController,
  Point,
  Rectangle,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import * as React from "react";
import { theme } from "styles";
import { coloredDatasetsPlugin } from "utils";

Chart.register(
  Point,
  Line,
  Rectangle,
  BarController,
  LineController,
  CategoryScale,
  TimeScale,
  LinearScale,
  Title,
  Legend,
  Tooltip,
  coloredDatasetsPlugin
);

if (process.env.NODE_ENV !== "production") {
  // Hack to use the ChartJS instance in Cypress
  // So we can get the charts we create with it
  const globalChartJsPlugin = {
    id: "globalChartJs",
    beforeInit: () => {
      if (window.Chart) {
        return;
      }
      window.Chart = Chart;
    },
  };

  Chart.register(globalChartJsPlugin);
}

Chart.defaults.elements.point.radius = 0;
Chart.defaults.elements.point.hitRadius = 5;
Chart.defaults.plugins.legend.position = "bottom";
Chart.defaults.plugins.title.font = {
  size: 16,
  weight: 0,
  family: "Roboto, sans-serif",
  color: "black",
};

const useStyles = makeStyles({
  root: {
    position: "relative",
    height: theme.chart.height,
  },
});

export function ChartJS(props) {
  const classes = useStyles();
  const canvasRef = React.useRef(null);

  const { chartType, labels, datasets, xScale, yScale, ...options } = props;

  React.useEffect(() => {
    const config = {
      type: chartType,
      data: { labels, datasets },
      options: {
        maintainAspectRatio: false,
        scales: { x: xScale, y: yScale },
        ...options,
      },
    };

    const chart = new Chart(canvasRef.current, config);

    return () => chart.destroy();
  }, [chartType, labels, datasets, xScale, yScale, options]);

  return (
    <div className={classes.root}>
      <canvas
        ref={canvasRef}
        id="chart-id"
        data-testid="chart-id"
        aria-label="Gráfico"
      >
        <p>Gráfico</p>
      </canvas>
    </div>
  );
}
