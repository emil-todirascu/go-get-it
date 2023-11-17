const windowElements = document.getElementsByClassName("window");
const windowsElement = document.getElementById("windows");
const toolBarHeight = document.getElementById("toolbar").clientHeight;
const miniAppsElement = document.getElementById("mini-apps");

function dragElement(element) {
	let mouseMoveX = 0,
		mouseMoveY = 0,
		mouseX = 0,
		mouseY = 0;
	document.getElementById(element.id + "-bar").onmousedown = dragMouseDown;

	document.getElementById(element.id).onmousedown = focusWindow;

	function focusWindow(e) {
		let maxZIndex = 0;
		for (let i = 0; i < windowElements.length; i++) {
			let currentZIndex = parseInt(windowElements[i].style.zIndex);

			if (currentZIndex > maxZIndex) {
				maxZIndex = currentZIndex;
			}
		}

		this.style.zIndex = maxZIndex + 1;
	}

	function dragMouseDown(e) {
		e.preventDefault();
		mouseX = e.clientX;
		mouseY = e.clientY;

		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e.preventDefault();
		const desktopHeight = window.innerHeight - toolBarHeight;

		mouseMoveX = mouseX - e.clientX;
		mouseMoveY = mouseY - e.clientY;

		mouseX = e.clientX;
		mouseY = e.clientY;

		let newTopPosition = element.offsetTop - mouseMoveY;
		let newLeftPosition = element.offsetLeft - mouseMoveX;

		const smallPixelBuffer = 5;
		const inVerticalBounds =
			-1 < newTopPosition && newTopPosition < desktopHeight - smallPixelBuffer;

		if (inVerticalBounds) {
			element.style.top = newTopPosition + "px";
		}
		element.style.left = newLeftPosition + "px";
	}

	function closeDragElement() {
		const desktopWidth = window.innerWidth;
		const desktopHeight = window.innerHeight - toolBarHeight;

		function calculateNewPosition(mouseX, mouseY) {
			let newTop = 0;
			let newLeft = 0;
			let newWidth = desktopWidth;
			let newHeight = desktopHeight;

			const pixelBuffer = 20;
			const mouseLeft = mouseX <= pixelBuffer;
			const mouseRight = mouseX >= desktopWidth - pixelBuffer;
			const mouseTop = mouseY <= pixelBuffer;
			const mouseBottom = mouseY >= desktopHeight - pixelBuffer;

			if (mouseLeft) {
				newLeft = 0;
				newWidth = desktopWidth / 2;
			} else if (mouseRight) {
				newLeft = desktopWidth / 2;
				newWidth = desktopWidth / 2;
			} else {
				newWidth = desktopWidth;
			}

			if (mouseTop && !(mouseLeft || mouseRight)) {
				newTop = 0;
				newHeight = desktopHeight;
			} else if (mouseTop) {
				newTop = 0;
				newHeight = desktopHeight / 2;
			} else if (mouseBottom && (mouseLeft || mouseRight)) {
				newTop = desktopHeight / 2;
				newHeight = desktopHeight / 2;
			} else if (!(mouseLeft || mouseRight)) {
				newTop = 0;
				newLeft = 0;
				newWidth = 0;
				newHeight = 0;
			}

			return { newTop, newLeft, newWidth, newHeight };
		}

		const { newTop, newLeft, newWidth, newHeight } = calculateNewPosition(
			mouseX,
			mouseY
		);

		const hasNewPosition = newTop + newLeft + newWidth + newHeight !== 0;
		if (hasNewPosition) {
			positionElement(newTop, newLeft, newWidth, newHeight);
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
		}, 300);
	}
}

function delWindow(id) {
	const windowElement = document.getElementById("window" + id);

	windowElement.style.transition =
		"width 500ms, height 500ms, top 500ms, left 500ms, opacity 300ms";

	windowElement.style.overflow = "hidden";
	windowElement.style.minHeight = "0px";
	windowElement.style.minWidth = "0px";
	windowElement.style.top =
		parseInt(windowElement.offsetTop) +
		parseInt(windowElement.offsetHeight) / 2 +
		"px";
	windowElement.style.left =
		parseInt(windowElement.offsetLeft) +
		parseInt(windowElement.offsetWidth) / 2 +
		"px";

	windowElement.style.width = 0 + "px";
	windowElement.style.height = 0 + "px";
	windowElement.style.opacity = 0;

	window.setTimeout(function () {
		windowElement.style.transition = "none";
		windowElement.remove();
	}, 500);
}

function maxWindow(id) {
	const windowElement = document.getElementById("window" + id);

	const desktopHeight = window.innerHeight - toolBarHeight;
	const desktopWidth = window.innerWidth;

	windowElement.style.transition =
		"top 300ms, left 300ms, width 300ms, height 300ms";

	const isBig =
		windowElement.style.top === 0 + "px" &&
		windowElement.style.left === 0 + "px" &&
		windowElement.style.width === desktopWidth + "px" &&
		windowElement.style.height === desktopHeight + "px";

	if (isBig) {
		windowElement.style.top = parseInt(desktopHeight) / 4 + "px";
		windowElement.style.left = parseInt(desktopWidth) / 4 + "px";
		windowElement.style.width = parseInt(desktopWidth) / 2 + "px";
		windowElement.style.height = parseInt(desktopHeight) / 2 + "px";
	} else {
		windowElement.style.top = 0 + "px";
		windowElement.style.left = 0 + "px";
		windowElement.style.width = desktopWidth + "px";
		windowElement.style.height = desktopHeight + "px";
	}

	window.setTimeout(function () {
		windowElement.style.transition = "none";
	}, 300);
}

function minWindow(id) {
	const windowElementBar = document.getElementById("window" + id + "-bar");
	const windowElement = document.getElementById("window" + id);
	const windowTitle = windowElementBar.children[1].innerHTML.trim();
	const windowIcon = windowElementBar.children[0].innerHTML;

	let windowContent;
	if (windowTitle === "Notepad") {
		windowContent = `
		<textarea name="notepad-text" class="notepad-text">${windowElement.children[1].children[0].value}</textarea>
		`;
	} else {
		windowContent = windowElement.children[1].innerHTML.trim();
	}

	windowElement.style.transition =
		"top 500ms, bottom 500ms, left 500ms, width 500ms, height 500ms, opacity 300ms, min-width 500ms, min-height 500ms";

	windowElement.style.overflow = "hidden";
	windowElement.style.minHeight = "0px";
	windowElement.style.minWidth = "0px";
	windowElement.style.opacity = "0";

	const desktopHeight = window.innerHeight;
	windowElement.style.top = desktopHeight + "px";
	windowElement.style.left = 0 + "px";
	windowElement.style.width = 0 + "px";
	windowElement.style.height = 0 + "px";

	window.setTimeout(function () {
		windowElement.style.transition = "none";
		newMiniWindow(windowTitle, windowIcon, id, windowContent);
		delWindow(id);
	}, 300);
}

let windowID = 100;
function newWindow(content, tabName, icon) {
	windowID++;
	const windowHTML = `
    <div class="window" id="window${windowID}" style="z-index: 100000">
        <div class="window-top">
            <div class="window-bar" id="window${windowID}-bar">
                <div class="window-icon">
                    ${icon}
                </div>
                <div class="window-name">
                	${tabName}
                </div>
            </div>
            <div class="window-control">
                <button class="btn-control" type="button" onclick="minWindow(${windowID})">
                    <div class="ctrl-mini ctrl">
                        <i class="fa-solid fa-window-minimize"></i>
                    </div>
                </button>
                <button class="btn-control" type="button" onclick="maxWindow(${windowID})">
                    <div class="ctrl-maxi ctrl">
                        <i class="fa-solid fa-tv"></i>
                    </div>
                </button>
                <button class="btn-control" type="button" onclick="delWindow(${windowID})">
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
	windowsElement.insertAdjacentHTML("beforeend", windowHTML);
	dragElement(document.getElementById("window" + windowID));
}

let windowInformation = {};
function newMiniWindow(title, icon, id, content) {
	windowInformation[id] = content;
	const miniAppHTML = `
	<button class="mini-app" id="mini-app${id}" onclick="openMiniWindow(${id})">
		${icon}
		<div class="mini-app-text">
			${title}
		</div>
	</button>
	`;
	miniAppsElement.insertAdjacentHTML("beforeend", miniAppHTML);

	const miniAppElement = document.getElementById(`mini-app${id}`);
	miniAppElement.style.transition = "opacity 500ms, max-width 500ms";
	miniAppElement.style.opacity = "0";
	miniAppElement.style.maxWidth = "0px";

	window.setTimeout(function () {
		miniAppElement.style.opacity = "1";
		miniAppElement.style.maxWidth = "15rem";
	}, 0);
}

function openMiniWindow(id) {
	const miniAppElement = document.getElementById(`mini-app${id}`);
	const icon = miniAppElement.children[0].outerHTML;
	const title = miniAppElement.children[1].textContent.trim();
	const content = windowInformation[id];

	newWindow(content, title, icon);
	miniAppElement.remove();
}

function checkDuplicateWindow(windowName) {
	const miniAppsCount = miniAppsElement.children.length;
	const windowCount = windowElements.length;

	for (let i = 0; i < miniAppsCount; i++) {
		const isWindow =
			miniAppsElement.children[i].children[1].innerHTML.trim() === windowName;
		if (isWindow) {
			openMiniWindow(miniAppsElement.children[i].id.substring(8));
			return true;
		}
	}

	for (let i = 0; i < windowCount; i++) {
		const isWindow =
			windowElements[i].children[0].children[0].children[1].innerHTML.trim() ===
			windowName;
		if (isWindow) {
			return true;
		}
	}
	return false;
}

function newNotepad() {
	const content = `
    <textarea name="notepad-text" class="notepad-text"></textarea>
    `;
	newWindow(content, "Notepad", `<i class="fa-solid fa-file-lines"></i>`);
}

function openCBC() {
	const isDuplicate = checkDuplicateWindow("CBC");
	if (isDuplicate) {
		alert("You can only have one CBC open.");
		return;
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
	</div>
	`;
	newWindow(content, "CBC", `<i class="fa-solid fa-terminal"></i>`);
	initCBC();
}

function openDecryptor() {
	const isDuplicate = checkDuplicateWindow("Decryptor");
	if (isDuplicate) {
		alert("You can only have one Decryptor open.");
		return;
	}
	const content = `
	<div class="decryptor-content">
		<div class="decryptor-top">
			<div class="decryptor-input-wrapper">
				<input type="text" id="encrypted-message" class="decryptor-input" autocomplete="off">
			</div>
			<button class="decryptor-button" onclick="decrypt()">Decrypt</button>
		</div>
		<div class="decryptor-mid">
			<div class="decrypt-caesar">
				<div class="caesar-text">Caesar</div>
				<div class="caesar-result"></div>
			</div>
			<div class="decrypt-vigenere">
				<div class="vigenere-text">Vigenere</div>
				<div class="vigenere-result"></div>
			</div>
			<div class="decrypt-base64">
				<div class="base64-text">Base64</div>
				<div class="base64-result"></div>
			</div>
		</div>
	</div>
	`;

	newWindow(content, "Decryptor", `<i class="fa-solid fa-unlock-keyhole"></i>`);
}

function openSettings() {
	const isDuplicate = checkDuplicateWindow("Settings");
	if (isDuplicate) {
		alert("You can only have one Settings window open.");
		return;
	}
	const content = `
	<div class="window-content">
		<form onsubmit="changeBackground(event)">
			<input type="file" id="newImage" name="filename" autocomplete="off"><input type="submit"
				value="Set Background">
		</form>
	</div>
	`;

	newWindow(content, "Settings", `<i class="fa-solid fa-gear"></i>`);
}
// TODO:
// windows resize from all sides and corners

for (let i = 0; i < windowElements.length; i++) {
	dragElement(windowElements[i]);
}

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
