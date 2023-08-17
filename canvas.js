const userPencilAttributes = document.querySelector(".pencil-attributes");
const userEraserAttributes = document.querySelector(".eraser-width");
const canvas = document.getElementsByTagName("canvas")[0];
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext("2d");

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
  if (e.target.tagName === "INPUT")
    penStateMaintainer({ width: e.target.value });
  else if (
    e.target.tagName === "DIV" &&
    e.target.classList.contains("pencil-color")
  )
    penStateMaintainer({ strokeStyle: e.target.classList[0] });
});

canvas.addEventListener("mousedown", (e) => {
  beginPath({ x: e.clientX, y: e.clientY });
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawFlag) return;
  drawline({ x: e.clientX, y: e.clientY });
});

canvas.addEventListener("mouseup", resetCursor);

function beginPath(coords) {
  drawFlag = true;
  ctx.beginPath();
  ctx.moveTo(coords.x, coords.y);
}

function drawline(coords) {
  ctx.lineTo(coords.x, coords.y);
  if (eraseFlag) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = userEraserAttributes.value;
  } else{
    ctx.strokeStyle = penState.strokeStyle
    ctx.lineWidth = penState.width
  }
  ctx.stroke();
}

function resetCursor() {
  drawFlag = false;
  ctx.beginPath();
}
