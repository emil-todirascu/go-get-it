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

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();

		// initial cursor pos
		pos3 = e.clientX;
		pos4 = e.clientY;

		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
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

		// console.log("height " + height);
		// console.log("width " + width);

		// set new pos
		let newTop = element.offsetTop - pos2;
		let newLeft = element.offsetLeft - pos1;

		// console.log({newTop, newLeft})

		if (-1 < newTop && newTop < height - 5) {
			element.style.top = newTop + "px";
		}

		if (newLeft < width) {
			element.style.left = newLeft + "px";
		}
	}

	function closeDragElement() {
		let height = window.innerHeight - toolBarH;
		let width = window.innerWidth;
		// console.log({height, width})

		if (pos3 <= 5) {
			element.style.transition =
				"top 500ms, left 500ms, width 500ms, height 500ms";
			element.style.top = 0 + "px";
			element.style.left = 0 + "px";
			element.style.width = parseInt(width) / 2 + "px";
			element.style.height = height + "px";
			window.setTimeout(function () {
				element.style.transition = "none";
			}, 500);
		} else if (pos4 <= 10) {
			element.style.transition =
				"top 500ms, left 500ms, width 500ms, height 500ms";
			element.style.top = 0 + "px";
			element.style.left = 0 + "px";
			element.style.width = width + "px";
			element.style.height = height + "px";
			window.setTimeout(function () {
				element.style.transition = "none";
			}, 500);
		} else if (pos3 >= width - 11) {
			element.style.transition =
				"top 500ms, left 500ms, width 500ms, height 500ms";
			element.style.top = 0 + "px";
			element.style.left = parseInt(width) / 2 + "px";
			element.style.width = parseInt(width) / 2 + "px";
			element.style.height = height + "px";
			window.setTimeout(function () {
				element.style.transition = "none";
			}, 500);
		}

		// stop on mouse up
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

function delWindow(id) {
	document.getElementById("window" + id).remove();
}

function maxWindow(id) {
	let win = document.getElementById("window" + id);

	let height = window.innerHeight - toolBarH;
	let width = window.innerWidth;

	win.style.transition = "top 500ms, left 500ms, width 500ms, height 500ms";

	if (
		win.style.width === width + "px" &&
		win.style.height === height + "px" &&
		win.style.top === 0 + "px" &&
		win.style.left === 0 + "px"
	) {
		console.log("already big");
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
	let winBar = document.getElementById("window" + id + "-bar");

	let title = winBar.children[1].innerHTML.trim();
	let icon = winBar.children[0].innerHTML;

	let win = document.getElementById("window" + id);

	if (title === "Notepad") {
		content = `
        <textarea name="notepad-text" id="notepad-text" class="notepad-text">${win.children[1].children[0].value}</textarea>
        `;
	} else {
		let content = win.children[1].innerHTML.trim();
	}
	newMiniWindow(title, icon, id, content);
	delWindow(id);
}

var winID = 100;
function newWindow(content, tabName, icon) {
	winID++;

	let win = `
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
	$("#windows").append(win);
	dragElement(document.getElementById("window" + winID));
}

function newMiniWindow(title, icon, id, content) {
	let app = `
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
	$("#mini-apps").append(app);
}

function openMiniWindow(id) {
	let win = document.getElementById(`mini-app${id}`);
	let icon = win.children[0].outerHTML;
	let title = win.children[1].textContent.trim();
	let content = win.children[2].innerHTML;

	newWindow(content, title, icon);
	win.remove();
}

function newNotepad() {
	let content = `
    <textarea name="notepad-text" id="notepad-text" class="notepad-text"></textarea>
    `;
	newWindow(content, "Notepad", `<i class="fa-solid fa-file-lines"></i>`);
}

windows = document.getElementsByClassName("window");
const toolBarH = document.getElementById("toolbar").clientHeight;

for (let i = 0; i < windows.length; i++) {
	// console.log(i);
	dragElement(windows[i]);
}
