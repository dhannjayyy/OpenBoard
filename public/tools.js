/* eslint-disable no-undef */
const hamburger = document.querySelector(".hamburger-cont");
const toolsContainer = document.querySelector(".tools-cont");
const pencilTool = document.getElementsByClassName("pencil-tool")[0];
const eraserTool = document.getElementsByClassName("eraser-tool")[0];
const stickyNoteTool = document.getElementsByClassName("stickynote-tool")[0];
const uploadTool = document.getElementsByClassName("upload-tool")[0];
const undoTool = document.getElementsByClassName("undo-tool")[0];
const redoTool = document.getElementsByClassName("redo-tool")[0];
let pencilToolState = false;
let eraserToolState = false;
let eraseFlag = false;

let undoRedoTracker = [];
let undoRedoIndex = 0;

const createStcikyNote = (img = "") => {
  const stickyNote = document.createElement("div");
  stickyNote.classList.add("sticky-note");
  stickyNote.innerHTML = `
  <div class="sticky-note-header">
  <button class="sticky-note-minimise"></button>
  <button class="sticky-note-close"></button>
</div>
${
  img
    ? `<img src="${img}" alt="sticky-note-img" class="sticky-note-img">`
    : `<textarea
class="sticky-note-text"
spellcheck="false"
name="sticky-note"
id="sticky-note"
cols="30"
rows="10"
placeholder="Enter your text here"
></textarea>`
}

      `;
  document.body.append(stickyNote);
  stickyNote.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains("sticky-note-minimise")) {
      stickyNote.children[1].classList.toggle("sticky-note-minimised");
      return;
    }
    if (event.target.classList.contains("sticky-note-close")) {
      stickyNote.remove();
      return;
    }
    if (!event.target.classList.contains("sticky-note-header")) return;

    let shiftX = event.pageX - stickyNote.getBoundingClientRect().left;
    let shiftY = event.pageY - stickyNote.getBoundingClientRect().top;
    stickyNote.style.position = "absolute";
    stickyNote.style.zIndex = 1000;
    document.body.append(stickyNote);

    function moveAt(pageX, pageY) {
      stickyNote.style.left = pageX - shiftX + "px";
      stickyNote.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // move the stickyNote on mousemove
    document.addEventListener("mousemove", onMouseMove);

    // drop the stickyNote, remove unneeded handlers
    stickyNote.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      stickyNote.onmouseup = null;
    };
  });

  stickyNote.addEventListener("dragstart", () => {
    return false;
  });
};

hamburger.addEventListener("click", () => {
  hamburger.children[0].classList.toggle("fa-bars");
  hamburger.children[0].classList.toggle("fa-times");
  toolsContainer.classList.toggle("tools-cont-active");
});

pencilTool.addEventListener("click", () => {
  pencilToolState = !pencilToolState;
  pencilTool.nextElementSibling.style.display = pencilToolState
    ? "block"
    : "none";
});

eraserTool.addEventListener("click", (e) => {
  eraseFlag = !eraseFlag;
  eraserToolState = !eraserToolState;
  eraserTool.nextElementSibling.style.display = eraserToolState
    ? "block"
    : "none";
});

stickyNoteTool.addEventListener("click", () => {
  createStcikyNote();
});

uploadTool.addEventListener("click", () => {
  const uploadInput = document.createElement("input");
  uploadInput.type = "file";
  uploadInput.accept = "image/*";
  uploadInput.click();
  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const imgSrc = URL.createObjectURL(file);
    createStcikyNote(imgSrc);
  });
});

undoTool.addEventListener("click", () => {
  if (undoRedoIndex <= 0) return;
  socket.emit("undo", {undoRedoTracker,undoRedoIndex})
});

redoTool.addEventListener("click", () => {
  if (undoRedoIndex >= undoRedoTracker.length - 1) return;
  socket.emit("redo", {undoRedoTracker,undoRedoIndex})
});

function undoRedoOperator(operation) {
  operation === "undo" ? undoRedoIndex-- : undoRedoIndex++;
  const img = new Image();
  img.src = undoRedoTracker[undoRedoIndex];
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

socket.on("undo",(data)=>{
  undoRedoTracker = data.undoRedoTracker;
  undoRedoIndex = data.undoRedoIndex;
  undoRedoOperator("undo");
})

socket.on("redo",(data)=>{
  undoRedoTracker = data.undoRedoTracker;
  undoRedoIndex = data.undoRedoIndex;
  undoRedoOperator("redo");
})