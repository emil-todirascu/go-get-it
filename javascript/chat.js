let optionsElement;
let chatElement;

function initChat() {
	optionsElement = document.getElementById("options");
	chatElement = document.getElementById("chat-messages");
	console.log("Chat initialized");
}

function chooseOption(option) {
	const height = optionsElement.offsetHeight;
	optionsElement.style.marginBottom = "-" + height + "px";

	window.setTimeout(function () {
		const message = optionsElement.children[option].innerHTML;
		addMessageGoing(message);
	}, 300);
}

function showOptions(options) {
	optionsElement.innerHTML = "";
	for (let i = 0; i < options.length; i++) {
		const optionElement = document.createElement("button");
		optionElement.classList.add("chat-option");
		optionElement.innerHTML = options[i];
		optionElement.setAttribute("onclick", "chooseOption(" + i + ")");
		optionsElement.appendChild(optionElement);
	}

	optionsElement.style.marginBottom = "0px";

	window.setTimeout(function () {
		chatElement.scrollTop = chatElement.scrollHeight;
	}, 300);
}

function addMessageGoing(message) {
	const messageElement = `
    <div class="message-going" style="transform: translateX(150%)">${message}</div>
    `;
	chatElement.innerHTML += messageElement;
	chatElement.scrollTop = chatElement.scrollHeight;

	const messageGoingElement =
		chatElement.children[chatElement.children.length - 1];

	messageGoingElement.style.transition = "transform 0.3s";
	messageGoingElement.style.transform = "translateX(0)";

	window.setTimeout(function () {
		messageGoingElement.style.transition = "none";
	}, 300);

	receiveMessage(message);
}

function addMessageComing(message) {
	const messageElement = `
	<div class="message-coming" style="transform: translateX(-150%)">${message}</div>
	`;
	chatElement.innerHTML += messageElement;
	chatElement.scrollTop = chatElement.scrollHeight;

	const messageComingElement =
		chatElement.children[chatElement.children.length - 1];

	messageComingElement.style.transition = "transform 0.3s";
	messageComingElement.style.transform = "translateX(0)";

	window.setTimeout(function () {
		messageComingElement.style.transition = "none";
		showOptions(["Option 1", "Option 2", "Option 3"]);
	}, 300);
}

expectingMessages = {};
function receiveMessage(message) {
	window.setTimeout(function () {
		addMessageComing(message);
	}, 1000);
}

// temp
initChat();
