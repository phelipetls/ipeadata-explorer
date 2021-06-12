import { Button, Link } from "@material-ui/core";
import { GetApp } from "@material-ui/icons";
import { Chart } from "chart.js";
import clone from "lodash/clone";
import * as React from "react";
import { svgToPng } from "utils";

const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 640;

export function ChartDownloadButton(props) {
  const { filename, children, ...rest } = props;

  const downloadLinkRef = React.useRef(null);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    const chartJs = Chart.getChart("chart-id");

    if (chartJs !== undefined) {
      setIsLoading(true);

      const config = clone(chartJs.config);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = IMAGE_WIDTH;
      canvas.height = IMAGE_HEIGHT;

      config.options.animation = false;
      config.options.responsive = false;
      config.options.maintainAspectRatio = false;

      config.plugins = [
        {
          afterRender: (chart) => {
            const imageDataUrl = canvas.toDataURL("image/png");

            downloadLinkRef.current.setAttribute("href", imageDataUrl);
            downloadLinkRef.current.click();

            chart.destroy();

            setIsLoading(false);
          },
        },
      ];

      new Chart(ctx, config);
    }

    const reactSimpleMapsSvg = document.querySelector("svg.rsm-svg");

    if (reactSimpleMapsSvg !== null) {
      setIsLoading(true);

      const imageDataUrl = await svgToPng(
        reactSimpleMapsSvg,
        IMAGE_WIDTH,
        IMAGE_HEIGHT
      );
      downloadLinkRef.current.setAttribute("href", imageDataUrl);
      downloadLinkRef.current.click();

      setIsLoading(false);
    }
  };

  return (
    <Link
      ref={downloadLinkRef}
      download={filename}
      title="Download do gráfico"
      underline="none"
    >
      <Button
        onClick={(e) => handleClick(e)}
        variant="contained"
        startIcon={<GetApp />}
        disabled={isLoading}
        {...rest}
      >
        {children || (isLoading ? "Carregando..." : "Download")}
      </Button>
    </Link>
  );
}
