class TreeNodeFolder {
	constructor(value) {
		this.value = value;
		this.children = [];
		this.parent = null;
		this.icon = `<i class="fa-solid fa-folder"></i>`;
	}

	setParent(parentNode) {
		this.parent = parentNode;
	}

	getChild(childValue) {
		for (let node of this.children) {
			if (childValue === node.value) {
				return node;
			}
		}
		throw new Error("Node does not have specified child");
	}

	addChild(childNode) {
		this.children.push(childNode);
	}

	delChild(childNode) {
		const index = this.children.indexOf(childNode);
		if (index > -1) {
			this.children.splice(index, 1);
		}
	}

	hasChild(childValue) {
		for (let node of this.children) {
			if (childValue === node.value) {
				return true;
			}
		}
		return false;
	}
}

class TreeNodeFile {
	constructor(value) {
		this.value = value;
		this.parent = null;
		this.icon = `<i class="fa-solid fa-file"></i>`;
	}

	setParent(parentNode) {
		this.parent = parentNode;
	}
}

function setRelationship(parentNode, childNode) {
	childNode.setParent(parentNode);
	parentNode.addChild(childNode);
}

let fileDirectory;
function initializeBasicTree() {
	fileDirectory = new TreeNodeFolder(":root");
	let files = new TreeNodeFolder("files");
	let downloads = new TreeNodeFolder("downloads");
	setRelationship(fileDirectory, files);
	setRelationship(fileDirectory, downloads);
}

let directoryElement;
let currentDirectory;
function initCBC() {
	currentDirectory = fileDirectory;
	directoryElement = document.getElementById("directory");
	directoryElement.innerText = ":root";
}

function sanitize(string) {
	const map = {
		"&": "",
		"<": "",
		">": "",
		'"': "",
		"'": "",
		"/": "",
	};
	const reg = /[&<>"'/]/gi;
	return string.replace(reg, (match) => map[match]);
}

let commandsElement;
function newCommand(e) {
	e.preventDefault();

	const form = e.target;
	const inputValue = form.querySelector("#command").value;
	const inputValueSanitized = sanitize(inputValue);
	commandsElement = document.getElementById(`cbc-commands`);
	if (inputValue !== inputValueSanitized) {
		outputCommand(
			"error: command cannot contain any of the following chracters:&<>\"'./"
		);
		form.reset();
		return;
	}

	handleCommand(inputValue);
	form.reset();
}

function outputCommand(command) {
	const output = `<p class="cbc-command">${command}</p>`;
	commandsElement.insertAdjacentHTML("beforeend", output);
	commandsElement.scrollTo(0, commandsElement.scrollHeight);
}

let awaitingConfirmation = false;
let gotConfirmation = false;
let commandAwaitingConfirmation = null;
function handleCommand(command) {
	outputCommand(directoryElement.innerText + ">" + command);

	let commandStart = command.split(" ")[0];

	if (awaitingConfirmation) {
		getConfirmation(command);
		return;
	}

	switch (commandStart) {
		case "help":
			handleHelp(command);
			break;
		case "list":
			handleList();
			break;
		case "clear":
			document.getElementById("cbc-commands").innerText = "";
			break;
		case "exit":
			handleExit();
			break;
		case "make":
			const makeFileName = command.split(" ")[1];
			handleMake(makeFileName);
			break;
		case "open":
			const openFileName = command.split(" ")[1];
			handleOpen(openFileName);
			break;
		case "makedir":
			const newDirectory = command.split(" ")[1];
			handleMakedir(newDirectory);
			break;
		case "opendir":
			const openDirectory = command.split(" ")[1];
			handleOpendir(openDirectory);
			break;
		case "backdir":
			handleBackdir();
			break;
		case "move":
			const moveFileName = command.split(" ")[1];
			const moveNewDirectory = command.split(" ")[2];
			handleMove(moveFileName, moveNewDirectory);
			break;
		case "name":
			const oldName = command.split(" ")[1];
			const newName = command.split(" ")[2];
			handleName(oldName, newName);
			break;
		case "del":
			const deleteFileName = command.split(" ")[1];
			handleDel(deleteFileName);
			break;
		case "con":
			const network = command.split(" ")[1];
			handleCon(network);
			break;
		case "dcon":
			handleDcon();
			break;
		case "scan":
			handleScan();
			break;
		case "port":
			const port = command.split(" ")[1];
			handlePort(port);
			break;
		default:
			outputCommand(`"${command}" is not a valid command`);
	}
}

function requestConfirmation(command) {
	awaitingConfirmation = true;
	outputCommand("are you sure you want to " + command + "? (y/n)");
}

function getConfirmation(confirmation) {
	if (confirmation === "y") {
		gotConfirmation = true;
		commandAwaitingConfirmation();
		commandAwaitingConfirmation = null;
		awaitingConfirmation = false;
	} else if (confirmation === "n") {
		gotConfirmation = false;
		commandAwaitingConfirmation = null;
		outputCommand("cancelled");
		awaitingConfirmation = false;
	} else {
		outputCommand("invalid confirmation, enter y or n");
	}
}

function handleHelp(command) {
	const words = command.split(" ");
	if (words.length === 1) {
		outputGeneralCommands();
		return;
	}
	const givenCommand = words[1];
	if (givenCommand === "help") {
		outputCommand("provides information about cbc commands");
		outputCommand("format: help {command}");
		outputCommand(
			"{command} - displays more information about the given command"
		);
	} else if (givenCommand === "list") {
		outputCommand("lists all files and directories in the current directory");
		outputCommand("format: list");
	} else if (givenCommand === "clear") {
		outputCommand("clears the console of all previous commands");
		outputCommand("format: clear");
	} else if (givenCommand === "exit") {
		outputCommand("closes the command based console");
		outputCommand("format: exit");
	} else if (givenCommand === "make") {
		outputCommand("creates a file in the current directory");
		outputCommand("format: make [file-name]");
		outputCommand("[file-name] - name of the file to be created");
	} else if (givenCommand === "open") {
		outputCommand("opens a file from the current directory");
		outputCommand("format: open [file-name]");
		outputCommand("[file-name] - name of the file to be opened");
	} else if (givenCommand === "makedir") {
		outputCommand("creates a directory in the current directory");
		outputCommand("format: makedir [directory-name]");
		outputCommand("[directory-name] - name of the directory to be created");
	} else if (givenCommand === "opendir") {
		outputCommand("opens a directory from the current directory");
		outputCommand("format: opendir [directory-name]");
		outputCommand("[directory-name] - name of the directory to be opened");
	} else if (givenCommand === "backdir") {
		outputCommand("opens the previous directory");
		outputCommand("format: backdir");
	} else if (givenCommand === "move") {
		outputCommand(
			"moves a file or directory from the current directory to another directory"
		);
		outputCommand("format: move [target-name] [destination-name]");
		outputCommand("[target-name] - name of the file or directory to be moved");
		outputCommand(
			"{destination-name} - name of the directory to move to (defaults to parent directory if unspecified)"
		);
	} else if (givenCommand === "name") {
		outputCommand("renames a file or directory from the current directory");
		outputCommand("format: name [target-name] [new-name]");
		outputCommand(
			"[target-name] - name of the file or directory to be renamed"
		);
		outputCommand("[new-name] - new name of the file or directory");
	} else if (givenCommand === "del") {
		outputCommand("deletes a file or directory from the current directory");
		outputCommand("format: del [target-name]");
		outputCommand(
			"[target-name] - name of the file or directory to be deleted"
		);
	} else if (givenCommand === "con") {
		outputCommand("connects to a network");
		outputCommand("format: con [network-name]");
		outputCommand("[network-name] - name of the network to connect to");
	} else if (givenCommand === "dcon") {
		outputCommand("disconnects from the current network");
		outputCommand("format: dcon");
	} else if (givenCommand === "scan") {
		outputCommand("scans the current network for open ports");
		outputCommand("format: scan");
	} else if (givenCommand === "port") {
		outputCommand("connects to a port of the current network");
		outputCommand("format: port [port-number]");
		outputCommand("[port-number] - port number to connect to");
	} else {
		outputCommand(`"${givenCommand}" is not a valid command`);
	}
}

function outputGeneralCommands() {
	outputCommand("---");
	outputCommand("GENERAL COMMANDS");
	outputCommand("help {command} - provides information about commmands");
	outputCommand("list - list directory contents");
	outputCommand("clear - clear console");
	outputCommand("exit - exit cbc");
	outputCommand("---");
	outputCommand("FILE/DIRECTORY COMMANDS");
	outputCommand("make [file-name] - make file");
	outputCommand("open [file-name] - open file");
	outputCommand("makedir [directory-name] - make directory");
	outputCommand("opendir [directory-name] - open directory");
	outputCommand("backdir - open previous directory");
	outputCommand("move [target-name] {destination-name} - move file/directory");
	outputCommand("name [target-name] [new-name] - rename file/directory");
	outputCommand("del [target-name] - delete file/directory");
	outputCommand("---");
	outputCommand("NETWORK COMMANDS");
	outputCommand("con [network-name] - connect to a network");
	outputCommand("dcon - disconnect from current network");
	outputCommand("scan - scan current network for open ports");
	outputCommand(
		"port [port-number] - connect to a port of the current network"
	);
	outputCommand("---");
	outputCommand("COMMAND PARAMETERS");
	outputCommand("{parameter} - optional parameter");
	outputCommand("[parameter] - required parameter");
}

function handleList() {
	const children = currentDirectory.children;
	if (children.length === 0) {
		outputCommand("no files or directories");
		return;
	}
	for (let child of children) {
		outputCommand(child.icon + child.value);
	}
}

function handleExit() {
	// TODO EXIT CBC
	outputCommand("exit not implemented yet");
}

function handleMake(fileName) {
	if (!fileName) {
		outputCommand("missing file name");
		return;
	}
	if (currentDirectory.hasChild(fileName)) {
		outputCommand(`file or directory "${fileName}" already exists`);
		return;
	}

	const newFile = new TreeNodeFile(fileName);
	currentDirectory.addChild(newFile);
	outputCommand(`"${fileName}" created`);
}

function handleOpen(fileName) {
	if (!currentDirectory.hasChild(fileName)) {
		outputCommand(`"${fileName}" does not exist`);
		return;
	}
	const file = currentDirectory.getChild(fileName);

	if (!(file instanceof TreeNodeFile)) {
		outputCommand(`"${fileName}" is not a file`);
		return;
	}
	outputCommand(`"${fileName}" opened`);
	// TODO OPEN FILE
	outputCommand("open not implemented yet");
}

function handleMakedir(directory) {
	if (!directory) {
		outputCommand("missing file name");
		return;
	}
	if (currentDirectory.hasChild(directory)) {
		outputCommand(`file or directory "${directory}" already exists`);
		return;
	}
	const newDirectory = new TreeNodeFolder(directory);
	setRelationship(currentDirectory, newDirectory);
	outputCommand(`"${directory}" created`);
}

function handleOpendir(directory) {
	if (
		!(
			currentDirectory.hasChild(directory) &&
			currentDirectory.getChild(directory) instanceof TreeNodeFolder
		)
	) {
		outputCommand(`"${directory}" is not a valid directory`);
		return;
	}

	const childDirectory = currentDirectory.getChild(directory);
	currentDirectory = childDirectory;
	directoryElement.insertAdjacentText("beforeend", "/" + directory);
}

function handleBackdir() {
	if (currentDirectory.value === ":root") {
		outputCommand("cannot go back from root");
		return;
	}
	currentDirectory = currentDirectory.parent;
	path = directoryElement.innerText;
	if (path.includes("/")) {
		path = path.substring(0, path.lastIndexOf("/"));
	}

	directoryElement.innerText = path;
}

function handleMove(fileName, newDirectory) {
	if (!currentDirectory.hasChild(fileName)) {
		outputCommand(`"${fileName}" does not exist`);
		return;
	}
	if (newDirectory === undefined && currentDirectory.value === ":root") {
		outputCommand(`"${fileName}" already in root`);
		return;
	}
	if (!currentDirectory.hasChild(newDirectory) && newDirectory !== undefined) {
		outputCommand(`"${newDirectory}" does not exist`);
		return;
	}
	let directory;
	if (newDirectory === undefined && currentDirectory.parent !== undefined) {
		directory = currentDirectory.parent;
		newDirectory = currentDirectory.parent.value;
	} else {
		directory = currentDirectory.getChild(newDirectory);
	}
	const file = currentDirectory.getChild(fileName);
	if (directory == file) {
		outputCommand("cannot move directory to itself");
		return;
	}
	if (directory instanceof TreeNodeFile) {
		outputCommand(`"${newDirectory}" is not a directory`);
		return;
	}
	setRelationship(directory, file);
	currentDirectory.delChild(file);
	outputCommand(`"${fileName}" moved to "${newDirectory}"`);
}

function handleName(oldName, newName) {
	if (!currentDirectory.hasChild(oldName)) {
		outputCommand(`"${oldName}" does not exist`);
		return;
	}
	if (currentDirectory.hasChild(newName)) {
		outputCommand(`"${newName}" already exists`);
		return;
	}
	const file = currentDirectory.getChild(oldName);
	file.value = newName;
	outputCommand(`"${oldName}" renamed to "${newName}"`);
}

function handleDel(fileName) {
	if (!currentDirectory.hasChild(fileName)) {
		outputCommand(`"${fileName}" does not exist`);
		return;
	}

	if (!awaitingConfirmation) {
		commandAwaitingConfirmation = handleDel(fileName);
		requestConfirmation(`delete "${fileName}"`);
		return;
	}
	if (!gotConfirmation) {
		return;
	}
	const file = currentDirectory.getChild(fileName);
	currentDirectory.delChild(file);
	outputCommand(`"${fileName}" deleted`);
}

function handleCon(networkName) {
	// TODO network connection
	outputCommand("con not implemented yet");
}

function handleDcon() {
	// TODO network disconnection
	outputCommand("dcon not implemented yet");
}

function handleScan() {
	// TODO network scan
	outputCommand("scan not implemented yet");
}

function handlePort(portNumber) {
	// TODO network port
	outputCommand("port not implemented yet");
}

initializeBasicTree();
