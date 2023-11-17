function decryptCaesar() {
	let encryptedText = document.getElementById("encrypted-message").value;
	let decryptedText = "";
	for (let i = 0; i < encryptedText.length; i++) {
		let charCode = encryptedText.charCodeAt(i);
		if (charCode >= 65 && charCode <= 90) {
			decryptedText += String.fromCharCode(((charCode - 65 + 23) % 26) + 65);
		} else if (charCode >= 97 && charCode <= 122) {
			decryptedText += String.fromCharCode(((charCode - 97 + 23) % 26) + 97);
		} else {
			decryptedText += encryptedText[i];
		}
	}
	document.querySelector(".caesar-result").innerText = decryptedText;
}

function decryptVigenere() {
	let encryptedText = document.getElementById("encrypted-message").value;
	let decryptedText = "";
	let key = "KEY";
	let keyIndex = 0;

	for (let i = 0; i < encryptedText.length; i++) {
		let charCode = encryptedText.charCodeAt(i);
		let keyChar = key.charCodeAt(keyIndex % key.length);

		let decryptedCharCode;

		if (charCode >= 65 && charCode <= 90) {
			decryptedCharCode = ((charCode - 65 - (keyChar - 65) + 26) % 26) + 65;
		} else if (charCode >= 97 && charCode <= 122) {
			decryptedCharCode = ((charCode - 97 - (keyChar - 65) + 26) % 26) + 97;
		} else {
			decryptedCharCode = charCode;
		}

		decryptedText += String.fromCharCode(decryptedCharCode);

		if (/[A-Za-z]/.test(String.fromCharCode(charCode))) {
			keyIndex++;
		}
	}

	document.querySelector(".vigenere-result").innerText = decryptedText;
}

function decryptBase64() {
	let encryptedText = document.getElementById("encrypted-message").value;
	let decryptedText = "";
	try {
		decryptedText = atob(encryptedText);
	} catch {
		document.querySelector(".base64-result").innerText = " ";
	}
	document.querySelector(".base64-result").innerText = decryptedText;
}

function decrypt() {
	const encryptedMessage = document.getElementById("encrypted-message").value;

	decryptCaesar(encryptedMessage);
	decryptVigenere(encryptedMessage);
	decryptBase64(encryptedMessage);
}
