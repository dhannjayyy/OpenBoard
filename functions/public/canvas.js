/* eslint-disable no-undef */
const userPencilAttributes = document.querySelector(".pencil-attributes");
const userEraser = document.querySelector(".eraser-width");
const downloadCanvas = document.querySelector(".download-tool");
const canvas = document.getElementsByTagName("canvas")[0];
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let eraserSize = 3;

const ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
undoRedoTracker.push(canvas.toDataURL());

const penState = {
  strokeStyle: "red",
  width: 3,
};

const penStateMaintainer = (penAttributes) => {
  if (penAttributes.width) {
    penState.width = penAttributes.width;
    ctx.lineWidth = penState.width;
  } else if (penAttributes.strokeStyle) {
    penState.strokeStyle = penAttributes.strokeStyle;
    ctx.strokeStyle = penState.strokeStyle;
  }
};

let drawFlag = false;

ctx.strokeStyle = "red";
ctx.lineWidth = 3;

userPencilAttributes.addEventListener("click", (e) => {
  if (eraseFlag) eraserTool.click();
  if (e.target.tagName === "INPUT")
    penStateMaintainer({ width: e.target.value });
  else if (
    e.target.tagName === "DIV" &&
    e.target.classList.contains("pencil-color")
  )
    penStateMaintainer({ strokeStyle: e.target.classList[0] });
});

userEraser.addEventListener("change", (e) => {
  eraserSize = e.target.value;
});

canvas.addEventListener("mousedown", (e) => {
  socket.emit("beginPath", { x: e.clientX, y: e.clientY });
});
canvas.addEventListener("mousemove", (e) => {
  if (!drawFlag) return;
  socket.emit("drawline", {
    x: e.clientX,
    y: e.clientY,
    eraseFlag,
    penState,
    eraserSize,
  });
});

canvas.addEventListener("mouseup", () => {
  socket.emit("resetCursor");
});

function beginPath(coords) {
  drawFlag = true;
  ctx.beginPath();
  ctx.moveTo(coords.x, coords.y);
}

function drawline(data) {
  ctx.lineTo(data.x, data.y);
  if (data.eraseFlag) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = data.eraserSize;
  } else {
    ctx.strokeStyle = data.penState.strokeStyle;
    ctx.lineWidth = data.penState.width;
  }
  ctx.stroke();
}

function resetCursor() {
  undoRedoTracker.push(canvas.toDataURL());
  undoRedoIndex++;
  drawFlag = false;
  ctx.beginPath();
}

downloadCanvas.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/jpeg");
  a.download = "open board";
  a.click();
});

socket.on("beginPath", (coords) => {
  beginPath(coords);
});

socket.on("drawline", (data) => {
  drawline(data);
});

socket.on("resetCursor", () => {
  resetCursor();
});
