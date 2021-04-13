const song = document.querySelector(".song");
const play = document.querySelector(".play");
const video = document.querySelector(".video_container video");
const outline = document.querySelector(".moving-outline circle");

const sounds = document.querySelectorAll(".sound_picker button");
const timeSelect = document.querySelectorAll(".time_select button");
const timeDisplay = document.querySelector(".time-display");

// Default
let defaultDuration = 600;
const outlineLength = outline.getTotalLength();
outline.style.strokeDasharray = outlineLength;
outline.style.strokeDashoffset = outlineLength;

///// Function /////
function reset() {
	song.pause();
	video.pause();
	play.src = "./svg/play.svg";
}

function togglePlaying(song) {
	if (song.paused) {
		song.play();
		video.play();
		play.src = "./svg/pause.svg";
	} else {
		reset();
	}
}

///// Action /////
// Play sound
play.addEventListener("click", () => {
	togglePlaying(song);
});

// Select Time
timeSelect.forEach(option => {
	option.addEventListener("click", function () {
		song.currentTime = 0;
		reset();
		defaultDuration = this.dataset.time;
		timeDisplay.textContent = `${Math.floor(defaultDuration / 60)}:${Math.floor(defaultDuration % 60)}`;
	});
});

// Select Song
sounds.forEach(sound => {
	sound.addEventListener("click", function () {
		song.src = this.dataset.sound;
		video.src = this.dataset.video;
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

	if (currentTime > defaultDuration) {
		song.currentTime = 0;
		reset();
	}
};
