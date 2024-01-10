let optionsElement;
let chatElement;

function initChat() {
	optionsElement = document.getElementById("options");
	chatElement = document.getElementById("chat-messages");
	console.log("Chat initialized");
}

function chooseOption(option) {
	const height = optionsElement.offsetHeight;

	optionsElement.style.transition = "margin 0.3s";
	optionsElement.style.marginBottom = "-" + height + "px";

	window.setTimeout(function () {
		optionsElement.style.transition = "none";
		optionsElement.style.display = "none";
		const message = optionsElement.children[option].innerHTML;
		addMessageGoing(message);
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
	}, 300);
}

// temp
initChat();
