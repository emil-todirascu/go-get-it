class Player {
	constructor() {
		this.options = new Map([
			["yo", humGreetings],
			["hello", humGreetings],
			["hey", humGreetings],

			["whats goin on?", humHowAreYou],
			["how you doin?", humHowAreYou],
			["how are you?", humHowAreYou],

			["ima get working lmk when youre ready", humStart],
			["message me when you can help, im starting work", humStart],
			["ok, im gonna start work, msg me when you wanna start", humStart],

			["his username is arnold276", humQuest14],
		]);
	}

	receiveMessage(message) {
		if (this.options.has(message)) {
			showOptions(this.options.get(message));
		}
	}
}
const humGreetings = ["yo", "hello", "hey"];
const humHowAreYou = ["good, u?", "not bad, hbu?", "im fine, you?"];
const humStart = ["ok im ready", "im good to go", "lets start"];

const humQuest14 = ["you have his ip?", "ok, sure", "aight, im on it"];
