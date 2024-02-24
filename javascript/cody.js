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
		this.currentMission = null;
		this.missionTriggerSent = false;
	}

	receiveMessage(humMessage) {
		if (!this.responses.has(humMessage)) {
			return;
		}
		let time = Math.random() * 1000 + 1000;

		let responseObject = this.responses.get(humMessage);
		this.send(responseObject, time);
	}

	startChat() {
		addMessageCody(this.getRandomOption(["yo", "hello", "hey"]), true);
	}

	getRandomOption(options) {
		return options[Math.floor(Math.random() * options.length)];
	}

	send(messageObject, time) {
		const message = this.getRandomOption(messageObject.message);

		// start misison 1
		if (message === "so i need you to crack this guy's secmail password") {
			this.currentMission = 1;
			console.log("mission 1 started");
		}

		window.setTimeout(function () {
			addMessageCody(message, true);
		}, time);

		if (messageObject.next != null) {
			time += Math.random() * 1000 + 3000;

			messageObject = messageObject.next;

			this.send(messageObject, time);
		}
	}

	// details = [ip, port]
	missionTrigger(details) {
		if (!this.currentMission) return;
		if (this.missionTriggerSent) return;
		if (
			this.currentMission === 1 &&
			correctPorts.has(details[0]) &&
			correctPorts.get(details[0])[0] === details[1]
		) {
			const time = Math.random() * 7000 + 5000;
			this.send(codQuest16, time);
			this.missionTriggerSent = true;
		}
	}

	missionEnd(file) {
		if (!this.currentMission) return;
		if (file.content === "supersecret-password") {
			const time = Math.random() * 3000 + 12000;
			this.send(codQuest18, time);
			this.currentMission = null;
		}
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
	["so i need you to crack this guy's secmail password"],
	null
);
codQuest11.next = codQuest12;

const codQuest13 = new CodyMessage(["his username is arnold276"], null);
codQuest12.next = codQuest13;

const codQuest141 = new CodyMessage(["one sec"], null);
const codQuest142 = new CodyMessage(["its 110.210.112.54"], null);
codQuest141.next = codQuest142;

const codQuest15 = new CodyMessage(["alright, go get it"], null);
codQuest142.next = codQuest15;

const codQuest16 = new CodyMessage(["btw"], null);
const codQuest17 = new CodyMessage(
	["when you get it, just upload it to the company server: 21.174.143.111:657"],
	null
);
codQuest16.next = codQuest17;

const codQuest18 = new CodyMessage(
	["nice, i got it", "received, thank you", "got it, thx"],
	null
);
