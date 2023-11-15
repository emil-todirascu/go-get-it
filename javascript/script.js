function dragElement(element) {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;

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

		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;

		pos3 = e.clientX;
		pos4 = e.clientY;

		let height = window.innerHeight - toolBarH;
		let width = window.innerWidth;

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

		document.onmouseup = null;
		document.onmousemove = null;
	}

	function positionElement(top, left, width, height) {
		element.style.transition =
			"top 300ms, left 300ms, width 300ms, height 300ms";
		element.style.top = top + "px";
		element.style.left = left + "px";
		element.style.width = width + "px";
		element.style.height = height + "px";
		window.setTimeout(function () {
			element.style.transition = "none";
		}, 500);
	}
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

	win.style.transition = "top 300ms, left 300ms, width 300ms, height 300ms";

	if (
		win.style.width === width + "px" &&
		win.style.height === height + "px" &&
		win.style.top === 0 + "px" &&
		win.style.left === 0 + "px"
	) {
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
const windowsElement = document.getElementById("windows");
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
                        <i class="fa-solid fa-window-minimize"></i>
                    </div>
                </button>
                <button class="btn-control" type="button" onclick="maxWindow(${winID})">
                    <div class="ctrl-maxi ctrl">
                        <i class="fa-solid fa-tv"></i>
                    </div>
                </button>
                <button class="btn-control" type="button" onclick="delWindow(${winID})">
                    <div class="ctrl-close ctrl">
                        <i class="fa-solid fa-x"></i>
                    </div>
                </button>
            </div>
        </div>
        <div class="window-content">
        	${content}
        </div>
    </div>
    `;
	windowsElement.insertAdjacentHTML("beforeend", win);
	dragElement(document.getElementById("window" + winID));
}

const miniApps = document.getElementById("mini-apps");
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
	miniApps.insertAdjacentHTML("beforeend", app);
	const win = document.getElementById(`mini-app${id}`);
	win.style.transition = "opacity 500ms, max-width 500ms";
	win.style.opacity = "0";
	win.style.maxWidth = "0px";

	window.setTimeout(function () {
		win.style.opacity = "1";
		win.style.maxWidth = "15rem";
	}, 0);
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
	for (let i = 0; i < miniApps.children.length; i++) {
		if (miniApps.children[i].children[1].innerHTML.trim() === "CBC") {
			openMiniWindow(miniApps.children[i].id.substring(8));
			alert("You can only have one CBC open.");
			return;
		}
	}

	for (let i = 0; i < windows.length; i++) {
		if (
			windows[i].children[0].children[0].children[1].innerHTML.trim() === "CBC"
		) {
			alert("You can only have one CBC open.");
			return;
		}
	}
	const content = `
	<div class="cbc-content">
		<div class="cbc-top">command based console v 1.0</div>
		<div class="cbc-mid">
			<div class="cbc-commands" id="cbc-commands"></div>
		</div>
		<div class="cbc-bot">
			<div class="directory" id="directory"></div>
			<div class="chevron">></div>
			<form onsubmit="newCommand(event)" class="cbc-form">
				<input type="text" id="command" class="cbc-input" autocomplete="off">
			</form>
		</div>
	</div>`;
	newWindow(content, "CBC", `<i class="fa-solid fa-terminal"></i>`);
	initCBC();
}

function openDecryptor() {
	const content = "";

	newWindow(content, "Decryptor", `<i class="fa-solid fa-unlock-keyhole"></i>`);
}

function openSettings() {
	for (let i = 0; i < miniApps.children.length; i++) {
		if (miniApps.children[i].children[1].innerHTML.trim() === "Settings") {
			openMiniWindow(miniApps.children[i].id.substring(8));
			alert("You can only have one Settings window open.");
			return;
		}
	}

	for (let i = 0; i < windows.length; i++) {
		if (
			windows[i].children[0].children[0].children[1].innerHTML.trim() ===
			"Settings"
		) {
			alert("You can only have one Settings window open.");
			return;
		}
	}
	const content = `
	<div class="window-content">
		<form onsubmit="changeBackground(event)">
			<input type="file" id="newImage" name="filename" autocomplete="off"><input type="submit"
				value="Set Background">
		</form>
	</div>`;

	newWindow(content, "Settings", `<i class="fa-solid fa-gear"></i>`);
}

function changeBackground(e) {
	e.preventDefault();

	let file = document.getElementById("newImage").files[0];

	if (file) {
		let reader = new FileReader();

		reader.onload = function (e) {
			let imageUrl = e.target.result;

			document.body.style.backgroundImage = "url('" + imageUrl + "')";
		};

		reader.readAsDataURL(file);
	}
}
// TODO:
// windows resize from all sides and corners

const windows = document.getElementsByClassName("window");
const toolBarH = document.getElementById("toolbar").clientHeight;

for (let i = 0; i < windows.length; i++) {
	dragElement(windows[i]);
}

// Settings
// change background,

// alert(`
// Hello,
// This project is not finished yet; however I have left here
// a small demo (if you can even call it a demo) which has
// all the features that have been implemented as of now.

// Features:
//   - Tabs:
// 	- moveable/resizable
// 	- opening/closing
// 	- minimize/maximize functions
// 	- snapping to cover a half/quarter the screen
//   - Applications:
// 	- Command Based Console (CBC)
// 	- Notepad
//   - CBC:
// 	- command line interface with functions to
// 	   navigate and make/delete files and directories
// 	- network and some other command not implemented yet
// 	- type "help" to get started
//   - Notepad:
// 	- basic notepad where you can write notes
// 	- saves text when minimized

// `);
