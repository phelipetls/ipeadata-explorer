import { Canvg } from "canvg";

export async function svgToPng(svg: SVGSVGElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1200;
  canvas.height = 1000;

  const canvg = await Canvg.from(ctx!, svg.outerHTML);

  canvg.start();

  return canvas.toDataURL();
}
