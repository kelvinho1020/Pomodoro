const song = document.querySelector(".song");
const play = document.querySelector(".play");
const resetButton = document.querySelector(".reset");
const outline = document.querySelector(".moving-outline circle");
const volume = document.querySelector(".volume");
const title = document.querySelector("h1");
const subTitle = document.querySelectorAll("h3");

const sounds = document.querySelectorAll(".sound_picker button");
const timeSelect = document.querySelectorAll(".time_select button");
const timeDisplay = document.querySelector(".time-display");
const countDisplay = document.querySelector(".count-display");

// Default
let state = {
	duration: 1500,
	color: "#03c6fc",
	song: "./sounds/rain.mp3",
	background: `url('./img/rain.png')`,
};
let restTime = 299;
let defaultCount = 0;
let defaultDuration = 1500;
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

function reset() {
	// Style
	outline.style.stroke = state.color;
	document.documentElement.style.setProperty("--background", state.background);

	// Time
	state.duration = 1500;
	defaultDuration = state.duration;
	song.currentTime = 0;

	// Count
	countDisplay.textContent = `count: ${defaultCount}`;
}

function countCheck() {
	if (defaultCount >= 9) {
		title.classList.add("complete");
		subTitle.forEach(title => title.classList.add("complete"));
	} else {
		title.classList.remove("complete");
		subTitle.forEach(title => title.classList.remove("complete"));
	}
}

///// Action /////
// Play sound
play.addEventListener("click", () => {
	togglePlaying(song);
});

volume.addEventListener("change", function () {
	song.volume = this.value / 100;
});

window.addEventListener("keyup", e => {
	if (e.keyCode === 32) {
		togglePlaying(song);
	}
	if (e.keyCode === 82) {
		defaultCount = 0;
		notYetRest = true;
		pause();
		reset();
	}
	if (e.keyCode === 39) {
		volume.value = +volume.value + 10;
		song.volume = volume.value / 100;
	}
	if (e.keyCode === 37) {
		volume.value -= 10;
		song.volume = volume.value / 100;
	}
});

// Reset
resetButton.addEventListener("click", () => {
	defaultCount = 0;
	notYetRest = true;
	localStorage.setItem("count", +0);
	countCheck();
	pause();
	reset();
});

// Select Time
timeSelect.forEach(option => {
	option.addEventListener("click", function () {
		notYetRest = true;

		reset();
		pause();

		state.duration = +this.dataset.time;
		defaultDuration = +this.dataset.time;
		timeDisplay.textContent = `${Math.floor(defaultDuration / 60)}:${Math.floor(defaultDuration % 60)}`;
	});
});

// Select Song
sounds.forEach(sound => {
	sound.addEventListener("click", function () {
		console.log(this.dataset.background);
		notYetRest = true;

		// Style
		outline.style.stroke = this.dataset.color;
		state.color = this.dataset.color;
		state.background = `url(${this.dataset.background})`;
		document.documentElement.style.setProperty("--background", state.background);

		// Count
		countDisplay.textContent = `count: ${defaultCount}`;
		defaultDuration = state.duration;

		// Song
		state.song = this.dataset.sound;
		song.src = this.dataset.sound;
		pause();
	});
});

// Update circle animation every second
song.ontimeupdate = () => {
	let currentTime = Math.floor(song.currentTime);
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
			// CountCheck
			countCheck();

			// Style
			outline.style.stroke = "#42f593";
			document.documentElement.style.setProperty("--background", `url('./img/rest.jpg')`);

			// Count
			defaultCount++;
			localStorage.setItem("count", defaultCount);
			countDisplay.textContent = `Take a rest`;

			// Song
			song.src = "./sounds/rest.mp3";
			song.play();

			defaultDuration = restTime;
			notYetRest = false;
		} else {
			// Back from rest to State
			countDisplay.textContent = `count: ${defaultCount}`;
			outline.style.stroke = state.color;
			defaultDuration = state.duration;
			document.documentElement.style.setProperty("--background", state.background);
			song.src = state.song;

			// Others
			song.play();
			notYetRest = true;
		}
	}
};

window.addEventListener("load", function () {
	if (!localStorage.getItem("count")) {
		localStorage.setItem("count", 0);
	} else {
		countDisplay.textContent = `count: ${localStorage.getItem("count")}`;
		defaultCount = localStorage.getItem("count");
		countCheck();
	}
});
