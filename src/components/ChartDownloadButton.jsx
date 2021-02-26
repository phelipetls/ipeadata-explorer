import * as React from "react";
import { Button, Link } from "@material-ui/core";
import { GetApp } from "@material-ui/icons";
import { Chart } from "chart.js";
import { svgToPng } from "utils";

export function ChartDownloadButton(props) {
  const { filename, children, ...rest } = props;

  const downloadLinkRef = React.useRef(null);

  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    let imageDataUrl;

    const chartJs = Chart.getChart("chart-id");
    const reactSimpleMapsSvg = document.querySelector("svg.rsm-svg");

    if (chartJs !== undefined) {
      setLoading(true);
      imageDataUrl = chartJs.toBase64Image();
      setLoading(false);
    }

    if (reactSimpleMapsSvg !== null) {
      setLoading(true);
      imageDataUrl = await svgToPng(reactSimpleMapsSvg);
      setLoading(false);
    }

    downloadLinkRef.current.setAttribute("download", filename);
    downloadLinkRef.current.setAttribute("href", imageDataUrl);
  };

  return (
    <Link ref={downloadLinkRef}>
      <Button
        onClick={e => handleClick(e)}
        variant="contained"
        startIcon={<GetApp />}
        disabled={loading}
        {...rest}
      >
        {children || (loading ? "Carregando..." : "Download")}
      </Button>
    </Link>
  );
}
