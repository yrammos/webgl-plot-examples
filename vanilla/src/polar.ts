import { SimpleSlider } from "@danchitnis/simple-slider";
import WebGLplot, { ColorRGBA, WebglPolar } from "webgl-plot";

let rotation = 0.1;
let freq = 0.01;

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;

const numPointList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
let numPoints = numPointList[9];

const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const wglp = new WebGLplot(canvas);

let line: WebglPolar;

createUI();

init();
updateTextDisplay();

let resizeId: number;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeId);
  resizeId = window.setTimeout(doneResizing, 100);
});

function newFrame(): void {
  update();

  wglp.update();

  requestAnimationFrame(newFrame);
}

requestAnimationFrame(newFrame);

function init(): void {
  wglp.removeAllLines();

  const numX = canvas.width;
  const numY = canvas.height;

  const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
  line = new WebglPolar(color, numPoints);

  wglp.gScaleX = numY / numX;
  wglp.gScaleY = 1;

  wglp.addLine(line);
}

function update(): void {
  line.offsetTheta = 10 * rotation;

  for (let i = 0; i < line.numPoints; i++) {
    const theta = (i * 360) / line.numPoints;
    const r = Math.cos((2 * Math.PI * freq * theta) / 360);

    line.setRtheta(i, theta, r);
  }
}

function doneResizing(): void {
  //wglp.viewport(0, 0, canv.width, canv.height);
  init();
}

function createUI(): void {
  // ******slider lines */
  const sliderLines = new SimpleSlider(
    "sliderLine",
    0,
    numPointList.length - 1,
    numPointList.length
  );
  sliderLines.setValue(9);
  sliderLines.addEventListener("update", () => {
    numPoints = numPointList[Math.round(sliderLines.value)];
    updateTextDisplay();
  });
  sliderLines.addEventListener("drag-end", () => {
    init();
  });

  // ******slider Freq */
  const sliderFreq = new SimpleSlider("sliderFreq", 0, 5, 0);
  //sliderYSclae.setDebug(true);
  sliderFreq.setValue(freq);
  sliderFreq.addEventListener("update", () => {
    freq = sliderFreq.value;
    updateTextDisplay();
  });

  // ******slider Rotation */
  const sliderRotation = new SimpleSlider("sliderRotation", 0, 5, 0);
  //sliderYSclae.setDebug(true);
  sliderRotation.setValue(rotation);
  sliderRotation.addEventListener("update", () => {
    rotation = sliderRotation.value;
    updateTextDisplay();
  });
}

function updateTextDisplay() {
  document.getElementById("numLines").innerHTML = `Line number: ${numPoints}`;
  document.getElementById("freq").innerHTML = `Y scale = ${freq.toFixed(2)}`;
  document.getElementById("rotation").innerHTML = `New Data Size = ${rotation.toFixed(2)}`;
}
