import { PNG } from 'pngjs/browser';
import imageUrl from '../simon.png';

function halfTone(png, canvasElement) {
  const spotSize = 6;
  const horizontalNumberOfSpots = Math.round(png.width / spotSize)
  const verticalNumberOfSpots = Math.round(png.height / spotSize)
  const context = canvasElement.getContext("2d");

  for (let n = 0; n < horizontalNumberOfSpots; n++) {
    for (let m = 0; m < verticalNumberOfSpots; m++) {
      halfToneSpot(context, png, spotSize, n, m);
    }
  }
}

function halfToneSpot(context, png, spotSize, n, m) {
  const point = pointForSpot(spotSize, n, m);
  const radius = (Math.sqrt(1 - (greyScaleForPixel(png, point) / 256)) * spotSize) / 2

  fillHexagon(context, radius, point.x, point.y);
}

function greyScaleForPixel(png, point) {
  const index = (Math.round(point.x) + (Math.round(point.y) * png.width)) << 2;
  return (png.data[index] + png.data[index + 1] + png.data[index + 2]) / 3;
}

function fillHexagon(context, radius, x, y) {
  context.beginPath();
  context.fillStyle = 'black';
  for (let i = 1; i <= 6; i++) {
    const angle = (1 + 2 * i) * Math.PI / 6;
    const cX = x + (Math.cos(angle) * radius);
    const cY = y + (Math.sin(angle) * radius);
    if (i === 1) {
      context.moveTo(cX, cY);
    } else {
      context.lineTo(cX, cY);
    }
  }

  context.closePath();
  context.fill();
}

function pointForSpot(spotSize, n, m) {
  return {
    x: (n * spotSize) + ((m % 2) * spotSize * Math.cos(Math.PI/3)),
    y: m * spotSize * 2 * Math.cos(Math.PI/3)
  }
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

    const canvasElement = document.getElementById("half-tone");
    canvasElement.setAttribute('width', png.width);
    canvasElement.setAttribute('height', png.height);

    halfTone(png, canvasElement);
  }
};
xhr.send();
