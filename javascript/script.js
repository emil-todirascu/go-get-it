function dragElement(element) {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	// let height = window.innerHeight;
	// let width = window.innerWidth;

	// console.log("height " + height)
	// console.log("width " + width)
	// console.log("toolBar " + toolBarH)
	// console.log(element);
	// console.log(element.id)
	document.getElementById(element.id + "-bar").onmousedown = dragMouseDown;

	document.getElementById(element.id).onmousedown = focusWindow;

	function focusWindow(e) {
		// e.preventDefault();

		let maxZIndex = 0;
		for (let i = 0; i < windows.length; i++) {
			const zIndex = parseInt(windows[i].style.zIndex);

			if (zIndex > maxZIndex) {
				maxZIndex = zIndex;
			}
		}

		this.style.zIndex = maxZIndex + 1;
	}

	function dragMouseDown(e) {
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;

		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e;
		e.preventDefault();

		element.style.transition = "none";

		// new cursor pos
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;

		// update cursor pos
		pos3 = e.clientX;
		pos4 = e.clientY;
		// console.log("cursor: " + pos3 + " " + pos4);

		// update window measurements
		let height = window.innerHeight - toolBarH;
		let width = window.innerWidth;

		// set new pos
		let newTop = element.offsetTop - pos2;
		let newLeft = element.offsetLeft - pos1;

		if (-1 < newTop && newTop < height - 5) {
			element.style.top = newTop + "px";
		}

		if (newLeft < width) {
			element.style.left = newLeft + "px";
		}
	}

	function closeDragElement() {
		let height = parseInt(window.innerHeight - toolBarH);
		let width = parseInt(window.innerWidth);
		console.log({ height, width });
		console.log(pos3, pos4);
		if (pos3 <= 5 + 20 && pos4 >= height - 30) {
			positionElement(height / 2, 0, width / 2, height / 2);
		} else if (pos3 <= 5 + 20 && pos4 <= 10 + 30) {
			positionElement(0, 0, width / 2, height / 2);
		} else if (pos3 >= width - 10 - 20 && pos4 <= 10 + 30) {
			positionElement(0, width / 2, width / 2, height / 2);
		} else if (pos3 >= width - 10 - 20 && pos4 >= height - 30) {
			positionElement(height / 2, width / 2, width / 2, height / 2);
		} else if (pos3 <= 5) {
			positionElement(0, 0, width / 2, height);
		} else if (pos4 <= 10) {
			positionElement(0, 0, width, height);
		} else if (pos3 >= width - 10) {
			positionElement(0, width / 2, width / 2, height);
		}

		// stop on mouse up
		document.onmouseup = null;
		document.onmousemove = null;
	}

	function positionElement(top, left, width, height) {
		element.style.transition =
			"top 500ms, left 500ms, width 500ms, height 500ms";
		element.style.top = top + "px";
		element.style.left = left + "px";
		element.style.width = width + "px";
		element.style.height = height + "px";
		window.setTimeout(function () {
			element.style.transition = "none";
		}, 500);
	}

	// function makeWindowActive(id) {
	// 	const win = document.getElementById("window" + id);
	// 	for (let i = 0; i < windows.length; i++) {
	// 		if (windows[i].id === id) {
	// 			console.log("window" + id + " active");
	// 			windows[i].classList.add("window-active");
	// 		} else {
	// 			windows[i].classList.remove("window-active");
	// 		}
	// 	}
	// }
}

function delWindow(id) {
	const win = document.getElementById("window" + id);
	win.style.transition =
		"width 500ms, height 500ms, top 500ms, left 500ms, opacity 300ms";

	win.style.overflow = "hidden";
	win.style.minHeight = "0px";
	win.style.minWidth = "0px";

	win.style.top =
		parseInt(win.offsetTop) + parseInt(win.offsetHeight) / 2 + "px";
	win.style.left =
		parseInt(win.offsetLeft) + parseInt(win.offsetWidth) / 2 + "px";

	win.style.width = 10 + "px";
	win.style.height = 10 + "px";
	win.style.opacity = 0;

	window.setTimeout(function () {
		win.style.transition = "none";
		win.remove();
		console.log("window" + win + " removed");
		console.log("id" + id);
	}, 500);
}

function maxWindow(id) {
	const win = document.getElementById("window" + id);

	const height = window.innerHeight - toolBarH;
	const width = window.innerWidth;

	win.style.transition = "top 500ms, left 500ms, width 500ms, height 500ms";

	if (
		win.style.width === width + "px" &&
		win.style.height === height + "px" &&
		win.style.top === 0 + "px" &&
		win.style.left === 0 + "px"
	) {
		// console.log("already big");
		win.style.width = parseInt(width) / 2 + "px";
		win.style.height = parseInt(height) / 2 + "px";

		win.style.top = parseInt(height) / 4 + "px";
		win.style.left = parseInt(width) / 4 + "px";
	} else {
		win.style.top = 0 + "px";
		win.style.left = 0 + "px";
		win.style.width = width + "px";
		win.style.height = height + "px";
	}

	window.setTimeout(function () {
		win.style.transition = "none";
	}, 500);
}

function minWindow(id) {
	const winBar = document.getElementById("window" + id + "-bar");

	const title = winBar.children[1].innerHTML.trim();
	const icon = winBar.children[0].innerHTML;

	const win = document.getElementById("window" + id);
	let content;

	if (title === "Notepad") {
		content = `
		<textarea name="notepad-text" class="notepad-text">${win.children[1].children[0].value}</textarea>
		`;
	} else {
		content = win.children[1].innerHTML.trim();
	}

	win.style.transition =
		"top 500ms, bottom 500ms, left 500ms, width 500ms, height 500ms, opacity 300ms, min-width 500ms, min-height 500ms";

	const height = window.innerHeight;

	win.style.overflow = "hidden";
	win.style.minHeight = "0px";
	win.style.minWidth = "0px";
	win.style.opacity = "0";

	win.style.top = height + "px";
	win.style.left = 0 + "px";
	win.style.width = 0 + "px";
	win.style.height = 0 + "px";

	window.setTimeout(function () {
		win.style.transition = "none";
		newMiniWindow(title, icon, id, content);
		delWindow(id);
	}, 300);
}

let winID = 100;
function newWindow(content, tabName, icon) {
	winID++;

	const win = `
    <div class="window" id="window${winID}">
        <div class="window-top">
            <div class="window-bar" id="window${winID}-bar">
                <div class="window-icon">
                    ${icon}
                </div>
                <div class="window-name">
                ${tabName}
                </div>
            </div>
            <div class="window-control">
                <button class="btn-control" type="button" onclick="minWindow(${winID})">
                    <div class="ctrl-mini ctrl">
                        <i class="fa-solid fa-window-minimize">min</i>
                    </div>
                </button>
                <button class="btn-control" type="button" onclick="maxWindow(${winID})">
                    <div class="ctrl-maxi ctrl">
                        <i class="fa-solid fa-tv">max</i>
                    </div>
                </button>
                <button class="btn-control" type="button" onclick="delWindow(${winID})">
                    <div class="ctrl-close ctrl">
                        <i class="fa-solid fa-x">del</i>
                    </div>
                </button>
            </div>
        </div>
        <div class="window-content">
        ${content}
        </div>
    </div>
    `;
	const windows = document.getElementById("windows");
	windows.insertAdjacentHTML("beforeend", win);
	dragElement(document.getElementById("window" + winID));
}

function newMiniWindow(title, icon, id, content) {
	const app = `
    <button class="mini-app" id="mini-app${id}" onclick="openMiniWindow(${id})">
        ${icon}
        <div class="mini-app-text">
            ${title}
        </div>
        <div class="mini-app-content">
        ${content}
        </div>
    </button>
    `;
	const miniApps = document.getElementById("mini-apps");
	miniApps.insertAdjacentHTML("beforeend", app);
	const win = document.getElementById(`mini-app${id}`);

	window.setTimeout(function () {
		win.style.opacity = "1";
		win.style.maxWidth = "12rem";
	}, 1);
}

function openMiniWindow(id) {
	const win = document.getElementById(`mini-app${id}`);
	const icon = win.children[0].outerHTML;
	const title = win.children[1].textContent.trim();
	const content = win.children[2].innerHTML;

	newWindow(content, title, icon);
	win.remove();
}

function newNotepad() {
	const content = `
    <textarea name="notepad-text" class="notepad-text"></textarea>
    `;
	newWindow(content, "Notepad", `<i class="fa-solid fa-file-lines"></i>`);
}

function openCBC() {
	newWindow("", "CBC", `<i class="fa-solid fa-terminal"></i>`);
	// initCBC();
}

const inputElement = document.getElementById("command");
function newCommand(e) {
	e.preventDefault();
	console.log("new command");
	console.log(e);
	const inputValue = inputElement.value;
	handleCommand(inputValue);
	inputElement.value = "";
}

const cons = document.getElementById("cbc-commands");
function outputCommand(command) {
	const output = `<p class="cbc-command">${command}</p>`;
	cons.insertAdjacentHTML("afterbegin", output);
}

// TODO:
// windows resize from all sides and corners

initCBC();

const windows = document.getElementsByClassName("window");
const toolBarH = document.getElementById("toolbar").clientHeight;

for (let i = 0; i < windows.length; i++) {
	// console.log(i);
	dragElement(windows[i]);
}
