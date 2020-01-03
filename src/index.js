import { PNG } from 'pngjs/browser';
import rough from 'roughjs/dist/rough.umd';
import { saveAs } from 'file-saver';

import { gridDimensions, coordinatesForGridLocation } from './hexagonal-grid.js';

import imageUrl from '../simon.png';

function halfTone(png, svgElement) {
  const spotSize = 9;
  const dimensions = gridDimensions(png.width, png.height, spotSize);
  const context = rough.svg(svgElement);

  for (let n = 0; n < dimensions.horizontal; n++) {
    for (let m = 0; m < dimensions.vertical; m++) {
      halfToneSpot(svgElement, context, png, spotSize, n, m);
    }
  }
}

function halfToneSpot(svgElement, context, png, spotSize, n, m) {
  const point = coordinatesForGridLocation(n, m, spotSize);
  const radius = (Math.sqrt(1 - (greyScaleForPixel(png, point) / 256)) * spotSize) / 2

  fillHexagon(svgElement, context, radius, point.x, point.y);
}

function greyScaleForPixel(png, point) {
  const index = (Math.round(point.x) + (Math.round(point.y) * png.width)) << 2;
  return (png.data[index] + png.data[index + 1] + png.data[index + 2]) / 3;
}

function fillHexagon(svgElement, context, radius, x, y) {
  const corners = [1, 2, 3, 4, 5, 6].map( i => {
    const angle = (1 + 2 * i) * Math.PI / 6;
    const cX = x + (Math.cos(angle) * radius);
    const cY = y + (Math.sin(angle) * radius);
    return [cX, cY];
  });

  svgElement.appendChild(context.polygon(corners, {
    fill: 'black',
    roughness: 0.4,
    strokeWidth: 0,
    fillStyle: 'solid'
  }));
}

function pointForSpot(spotSize, n, m) {
  return {
    x: (n * spotSize) + ((m % 2) * spotSize * Math.cos(Math.PI/3)),
    y: m * spotSize * 2 * Math.cos(Math.PI/3)
  }
}

function saveFile(svgElement) {
  svgElement.setAttribute('version', '1.1');
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  const svgData = svgElement.outerHTML;
  const blob = new Blob(
    [svgData],
    { type: "text/plain;charset=utf-8" }
  );
  saveAs(blob, 'half-tone.svg');
}

const xhr = new XMLHttpRequest();
xhr.open('GET', imageUrl, true);
xhr.responseType = 'arraybuffer';
xhr.onload = function(e){
  if (this.status == 200){
    const buf = Buffer.from(this.response);

    var png = PNG.sync.read(buf, function(err, png){
      if (err) throw err;
      console.log(png);
    });

    const svgElement = document.getElementById("half-tone");
    svgElement.setAttribute('width', png.width);
    svgElement.setAttribute('height', png.height);

    halfTone(png, svgElement);

    document.getElementById('download-link').onclick = function() { saveFile(svgElement); return false; }
  }
};
xhr.send();
