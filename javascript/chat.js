let optionsElement;
let chatElement;

function initChat() {
	optionsElement = document.getElementById("options");
	chatElement = document.getElementById("chat-messages");
	console.log("Chat initialized");
	startChat();
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

	receiveMessageCody(message);
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
	receiveMessageHuman(message);
}

function receiveMessageCody(message) {
	if (humHowAreYou.includes(message)) {
		let time = Math.random() * 1000 + 1000;
		sendMessageCody(codImGood, time);
		sendMessageCody(codGetToWork, time + 2000);
		return;
	}
	if (messagesCody.has(message)) {
		sendMessageCody(messagesCody.get(message), Math.random() * 1000 + 1000);
	}
}

function receiveMessageHuman(message) {
	console.log(message);
	if (messagesHuman.has(message)) {
		showOptions(messagesHuman.get(message));
	}
}

function getRandomOption(options) {
	return options[Math.floor(Math.random() * options.length)];
}

function startChat() {
	addMessageComing(getRandomOption(bothGreetings));
	showOptions(bothGreetings);
}

function sendMessageCody(options, time) {
	window.setTimeout(function () {
		addMessageComing(getRandomOption(options));
	}, time);
}

// start of chat
const bothGreetings = ["yo", "hello", "hey"];
const codHowAreYou = ["whats goin on?", "how you doin?", "how are you?"];
const humHowAreYou = ["good, u?", "not bad, hbu?", "im fine, you?"];
const codImGood = ["good good", "im aight", "im ok thx"];
const codGetToWork = [
	"ima get working lmk when youre ready",
	"message me when you can help, im starting work",
	"ok, im gonna starting work, msg me when you wanna start",
];
const humStart = ["ok im ready", "im good to go", "lets start"];

// start of quest 1
const codQuest11 = ["kk", "alright, give me a sec", "aight, lemme see"];
const codQuest12 = ["so i need you to crack this guy's password"];
const codQuest13 = ["his username is arnold276"];
const humQuest14 = ["you have his ip?", "ok, sure", "aight, im on it"];
const codQuest15 = ["yeah, its 110.210.112.54", "good luck", "ok"];

messagesCody = new Map();
for (let i = 0; i < bothGreetings.length; i++) {
	messagesCody.set(bothGreetings[i], codHowAreYou);
}
for (let i = 0; i < humHowAreYou.length; i++) {
	messagesCody.set(humHowAreYou[i], codImGood);
}

messagesHuman = new Map();
for (let i = 0; i < codHowAreYou.length; i++) {
	messagesHuman.set(codHowAreYou[i], humHowAreYou);
}
for (let i = 0; i < codImGood.length; i++) {
	messagesHuman.set(codGetToWork[i], humStart);
}

// temp
initChat();
