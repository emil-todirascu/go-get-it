let optionsElement;
let chatElement;
let chatInitiated = false;
let messageHistory = {};

const cody = new Cody();
const player = new Player();

function initChat() {
	optionsElement = document.getElementById("options");
	chatElement = document.getElementById("chat-messages");

	if (chatInitiated) {
		updateChat();
		return;
	}

	cody.startChat();
	chatInitiated = true;
}

function chooseOption(option) {
	const height = optionsElement.offsetHeight;
	optionsElement.style.marginBottom = "-" + height + "px";

	window.setTimeout(function () {
		const message = optionsElement.children[option].innerHTML;
		addMessagePlayer(message, true);
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

function addMessagePlayer(message, receive) {
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

	if (receive) {
		cody.receiveMessage(message);
		messageHistory[Object.keys(messageHistory).length] = [message, "player"];
	}
}

function addMessageCody(message, receive) {
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
	}, 300);

	if (receive) {
		player.receiveMessage(message);
		messageHistory[Object.keys(messageHistory).length] = [message, "cody"];
	}
}

function updateChat() {
	const height = optionsElement.offsetHeight;
	optionsElement.style.marginBottom = "-" + height + "px";

	for (message in messageHistory) {
		console.log(messageHistory[message]);
		if (messageHistory[message][1] == "player") {
			addMessagePlayer(messageHistory[message][0], false);
		} else {
			addMessageCody(messageHistory[message][0], false);
		}
	}

	if (messageHistory[Object.keys(messageHistory).length - 1][1] == "cody") {
		player.receiveMessage(
			messageHistory[Object.keys(messageHistory).length - 1][0]
		);
	}
}
