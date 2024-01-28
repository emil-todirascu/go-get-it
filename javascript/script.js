const windowElements = document.getElementsByClassName("window");
const windowsElement = document.getElementById("windows");
const toolBarHeight = document.getElementById("toolbar").clientHeight;
const miniAppsElement = document.getElementById("mini-apps");

let maxZIndex = 0;
function dragElement(element) {
	let mouseMoveX = 0,
		mouseMoveY = 0,
		mouseX = 0,
		mouseY = 0;
	document.getElementById(element.id + "-bar").onmousedown = dragMouseDown;

	document.getElementById(element.id).onmousedown = focusWindow;

	function focusWindow() {
		maxZIndex++;
		this.style.zIndex = maxZIndex;
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
		"width 600ms, height 600ms, top 600ms, left 600ms, border-radius 600ms, opacity 200ms";

	// windowElement.style.overflow = "hidden";
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
	}, 600);
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

	if (windowElement.style.width === "0px") {
		return;
	}

	windowElement.style.transition = "all 300ms ease-in";

	windowElement.style.minHeight = "0px";
	windowElement.style.minWidth = "0px";
	windowElement.style.opacity = "0";

	const desktopHeight = window.innerHeight;
	windowElement.style.top = desktopHeight + "px";
	windowElement.style.left = 0 + "px";
	windowElement.style.width = 0 + "px";
	windowElement.style.height = 0 + "px";

	const position = [
		windowElement.offsetTop,
		windowElement.offsetLeft,
		windowElement.offsetWidth,
		windowElement.offsetHeight,
	];
	window.setTimeout(function () {
		windowElement.style.transition = "none";
		newMiniWindow(windowTitle, windowIcon, id, position);
	}, 300);
}

let windowID = 100;
function newWindow(content, tabName, icon) {
	const windowHTML = `
    <div class="window" id="window${++windowID}" style="z-index: ${++maxZIndex}">
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
	const windowElement = document.getElementById("window" + windowID);
	dragElement(windowElement);

	windowElement.style.transition = "all 300ms ease-out";

	window.setTimeout(function () {
		windowElement.style.minHeight = "20rem";
		windowElement.style.minWidth = "20rem";
		windowElement.style.opacity = "1";

		windowElement.style.top = "calc(50% - 10rem)";
		windowElement.style.left = "calc(50% - 15rem)";
		windowElement.style.width = "30rem";
		windowElement.style.height = "20rem";
		windowElement.style.zIndex = ++maxZIndex;
	}, 10);

	window.setTimeout(function () {
		windowElement.style.transition = "none";
	}, 300);
}

function newFile(fileName, fileContent) {
	const windowHTML = `
    <div class="window" id="window${++windowID}" style="z-index: ${++maxZIndex}">
        <div class="window-top">
            <div class="window-bar" id="window${windowID}-bar">
                <div class="window-icon">
					<i class="fa-solid fa-file"></i>
                </div>
                <div class="window-name">
                	${fileName}
                </div>
            </div>
            <div class="window-control">
                <button class="btn-control" type="button" onclick="maxWindow(${windowID})">
                    <div class="ctrl-file-maxi ctrl">
                        <i class="fa-solid fa-tv"></i>
                    </div>
                </button>
                <button class="btn-control" type="button" onclick="closeFile(${windowID}, \`${fileName}\`)">
                    <div class="ctrl-close ctrl">
                        <i class="fa-solid fa-x"></i>
                    </div>
                </button>
            </div>
        </div>
        <div class="window-content">
			<textarea name="file-text" class="file-text">${fileContent}</textarea>
        </div>
    </div>
    `;
	windowsElement.insertAdjacentHTML("beforeend", windowHTML);
	const windowElement = document.getElementById("window" + windowID);
	dragElement(windowElement);

	windowElement.style.minHeight = "0";
	windowElement.style.minWidth = "0";
	windowElement.style.opacity = "0";

	windowElement.style.top = "50%";
	windowElement.style.left = "50%";
	windowElement.style.width = "0";
	windowElement.style.height = "0";

	windowElement.style.transition = "all 300ms ease-out";

	window.setTimeout(function () {
		windowElement.style.minHeight = "20rem";
		windowElement.style.minWidth = "20rem";
		windowElement.style.opacity = "1";

		windowElement.style.top = "calc(50% - 10rem)";
		windowElement.style.left = "calc(50% - 15rem)";
		windowElement.style.width = "30rem";
		windowElement.style.height = "20rem";
		windowElement.style.zIndex = ++maxZIndex;
	}, 10);

	window.setTimeout(function () {
		windowElement.style.transition = "none";
	}, 300);
}

function closeFile(id, fileName) {
	const fileText = document.querySelector(`#window${id} textarea`).value;
	let fileIndex = 0;
	for (let i = 0; i < openedFiles.length; i++) {
		if (openedFiles[i].name === fileName) {
			fileIndex = i;
			break;
		}
	}
	openedFiles[fileIndex].content = fileText;

	delWindow(id);
	openedFiles.splice(fileIndex, 1);
}

let windowPosition = {};
function newMiniWindow(title, icon, id, position) {
	windowPosition[id] = position;
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
	miniAppElement.style.transition = "all 500ms";
	miniAppElement.style.opacity = "0";
	miniAppElement.style.maxWidth = "0px";

	window.setTimeout(function () {
		miniAppElement.style.opacity = "1";
		miniAppElement.style.maxWidth = "15rem";
	}, 10);
}

function openMiniWindow(id) {
	const miniAppElement = document.getElementById(`mini-app${id}`);
	const windowElement = document.getElementById("window" + id);

	miniAppElement.style.transition = "all 200ms";
	miniAppElement.style.opacity = "0";
	miniAppElement.style.maxWidth = "0px";
	miniAppElement.style.paddingLeft = "0px";
	miniAppElement.style.paddingRight = "0px";

	window.setTimeout(function () {
		miniAppElement.remove();
		openExistingWindow(windowElement);
	}, 200);
}

function openExistingWindow(windowElement) {
	const id = windowElement.id.substring(6);
	const position = windowPosition[id];

	windowElement.style.transition = "all 300ms ease-out";

	windowElement.style.minHeight = "20rem";
	windowElement.style.minWidth = "20rem";
	windowElement.style.opacity = "1";

	windowElement.style.top = position[0] + "px";
	windowElement.style.left = position[1] + "px";
	windowElement.style.width = position[2] + "px";
	windowElement.style.height = position[3] + "px";
	windowElement.style.zIndex = ++maxZIndex;

	window.setTimeout(function () {
		windowElement.style.transition = "none";
	}, 300);
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
	<form onsubmit="changeBackground(event)">
		<input type="file" id="newImage" name="filename" autocomplete="off"><input type="submit" value="Set Background">
	</form>
	`;

	newWindow(content, "Settings", `<i class="fa-solid fa-gear"></i>`);
}

function openChat() {
	const isDuplicate = checkDuplicateWindow("Chat");
	if (isDuplicate) {
		alert("You can only have one Chat open.");
		return;
	}
	const content = `
	<div class="chat-content">
		<div class="chat-top">
			Cody
		</div>
		<div class="chat-mid">
			<div class="chat-messages" id="chat-messages">
			</div>
		</div>
		<div class="chat-bot" id="options">
			<button class="chat-option" onclick="chooseOption(0)"></button>
			<button class="chat-option" onclick="chooseOption(1)"></button>
			<button class="chat-option" onclick="chooseOption(2)"></button>
		</div>
	</div>
	`;
	newWindow(content, "Chat", `<i class="fa-solid fa-comment"></i>`);
	initChat();
}

for (let i = 0; i < windowElements.length; i++) {
	dragElement(windowElements[i]);
}
