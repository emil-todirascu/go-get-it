class CodyMessage {
	constructor(message, next) {
		this.message = message;
		this.next = next;
	}
}

class Cody {
	constructor() {
		this.responses = new Map([
			["yo", codHowAreYou],
			["hello", codHowAreYou],
			["hey", codHowAreYou],

			["good, u?", codImGood],
			["not bad, hbu?", codImGood],
			["im fine, you?", codImGood],

			["ok im ready", codQuest11],
			["im good to go", codQuest11],
			["lets start", codQuest11],

			["you have his ip?", codQuest141],
			["ok, sure", codQuest15],
			["aight, im on it", codQuest15],
		]);
	}

	receiveMessage(humMessage) {
		if (this.responses.has(humMessage)) {
			let time = Math.random() * 1000 + 1000;

			let responseObject = this.responses.get(humMessage);
			let possibleResponses = responseObject.message;

			this.send(possibleResponses, time);

			while (responseObject.next != null) {
				time += Math.random() * 1000 + 3000;

				responseObject = responseObject.next;
				possibleResponses = responseObject.message;

				this.send(possibleResponses, time);
			}
		}
	}

	startChat() {
		addMessageCody(this.getRandomOption(["yo", "hello", "hey"]));
	}

	getRandomOption(options) {
		return options[Math.floor(Math.random() * options.length)];
	}

	send(options, time) {
		const message = this.getRandomOption(options);
		window.setTimeout(function () {
			addMessageCody(message);
		}, time);
	}
}

const codHowAreYou = new CodyMessage(
	["whats goin on?", "how you doin?", "how are you?"],
	null
);

const codImGood = new CodyMessage(["good good", "im aight", "im ok thx"], null);

const codGetToWork = new CodyMessage(
	[
		"ima get working lmk when youre ready",
		"message me when you can help, im starting work",
		"ok, im gonna start work, msg me when you wanna start",
	],
	null
);
codImGood.next = codGetToWork;

const codQuest11 = new CodyMessage(
	["kk", "alright, give me a sec", "aight, lemme see"],
	null
);

const codQuest12 = new CodyMessage(
	["so i need you to crack this guy's password"],
	null
);
codQuest11.next = codQuest12;

const codQuest13 = new CodyMessage(["his username is arnold276"], null);
codQuest12.next = codQuest13;

const codQuest141 = new CodyMessage(["one sec"], null);
const codQuest142 = new CodyMessage(["its 110.210.112.54"], null);
codQuest141.next = codQuest142;

const codQuest15 = new CodyMessage(["good luck", "ok, good luck"], null);
codQuest142.next = codQuest15;
