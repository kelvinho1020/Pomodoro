const song = document.querySelector(".song");
const play = document.querySelector(".play");
const resetButton = document.querySelector(".reset");
const outline = document.querySelector(".moving-outline circle");

const sounds = document.querySelectorAll(".sound_picker button");
const timeSelect = document.querySelectorAll(".time_select button");
const timeDisplay = document.querySelector(".time-display");
const countDisplay = document.querySelector(".count-display");

// Default
let tempDuration = 600;
let tempColor = "#03c6fc";
let tempBackground = `url('./img/rain.jpg')`;
let tempSong = "./sounds/rain.mp3";
let countDefault = 0;
let defaultDuration = 600;
let notYetRest = true;

const outlineLength = outline.getTotalLength();
outline.style.strokeDasharray = outlineLength;
outline.style.strokeDashoffset = outlineLength;

///// Function /////
function pause() {
	song.pause();
	play.src = "./svg/play.svg";
}

function togglePlaying(song) {
	if (song.paused) {
		song.play();
		play.src = "./svg/pause.svg";
	} else {
		pause();
	}
}

function rest() {
	outline.style.stroke = "#42f593";
	defaultDuration = 5;
	document.documentElement.style.setProperty("--background", `url('./img/rest.jpg')`);
}

function reset() {
	outline.style.stroke = tempColor;
	tempDuration = 600;
	defaultDuration = tempDuration;
	song.currentTime = 0;
	document.documentElement.style.setProperty("--background", tempBackground);
	notYetRest = true;
}

///// Action /////
// Play sound
play.addEventListener("click", () => {
	togglePlaying(song);
});

// Reset
resetButton.addEventListener("click", () => {
	pause();
	reset();
	countDefault = 0;
	countDisplay.textContent = `count: ${countDefault}`;
});

// Select Time
timeSelect.forEach(option => {
	option.addEventListener("click", function () {
		notYetRest = true;
		reset();
		pause();
		countDisplay.textContent = `count: ${countDefault}`;
		tempDuration = this.dataset.time;
		defaultDuration = this.dataset.time;
		timeDisplay.textContent = `${Math.floor(defaultDuration / 60)}:${Math.floor(defaultDuration % 60)}`;
	});
});

// Select Song
sounds.forEach(sound => {
	sound.addEventListener("click", function () {
		notYetRest = true;
		document.documentElement.style.setProperty("--background", `url(${this.dataset.background})`);
		countDisplay.textContent = `count: ${countDefault}`;
		outline.style.stroke = this.dataset.color;
		tempColor = this.dataset.color;
		tempSong = this.dataset.sound;
		tempBackground = `url(${this.dataset.background})`;
		song.src = this.dataset.sound;
		defaultDuration = tempDuration;
		pause();
	});
});

// Update circle animation every second
song.ontimeupdate = () => {
	let currentTime = song.currentTime;
	let elapsed = defaultDuration - currentTime;
	let seconds =
		Math.floor(elapsed % 60) === 0 || Math.floor(elapsed % 60) < 10
			? "0" + Math.floor(elapsed % 60)
			: Math.floor(elapsed % 60);
	let minutes = Math.floor(elapsed / 60);

	let progress = outlineLength - (currentTime / defaultDuration) * outlineLength;
	outline.style.strokeDashoffset = progress;

	timeDisplay.textContent = `${minutes}:${seconds}`;

	// Switching rest
	if (currentTime >= defaultDuration) {
		song.currentTime = 0;
		if (notYetRest) {
			countDefault++;
			countDisplay.textContent = `Take a rest`;
			song.src = "./sounds/rest.mp3";
			song.play();
			rest();
			notYetRest = !notYetRest;
		} else {
			countDisplay.textContent = `count: ${countDefault}`;
			outline.style.stroke = tempColor;
			defaultDuration = tempDuration;
			notYetRest = !notYetRest;
			song.src = tempSong;
			song.play();
			document.documentElement.style.setProperty("--background", tempBackground);
		}
	}
};
