document.addEventListener("DOMContentLoaded", function () {
  const waveform = WaveSurfer.create({
    container: "#waveform",
    waveColor: "#f1f1f1",
    progressColor: "#1b4353",
    height: 40,
    barWidth: 2,
    barRadius: 2,
    responsive: true,
  });

  waveform.load("media/ekosong.mp3");
  // Initialize the AudioContext within a user gesture, like a click event
  document.addEventListener("click", function () {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Now you can use the audioContext for your audio-related operations
    // For example, you can create an instance of WaveSurfer here
    const wavesurfer = WaveSurfer.create({
      container: "#waveform",
      audioContext: audioContext, // Pass the AudioContext here
      // Other WaveSurfer options...
    });

    // Load and play audio
    // wavesurfer.load("media/ekosong.mp3");
    wavesurfer.play();
  });

  // Volume control
  const volumeSlider = document.getElementById("volumeSlider");
  if (volumeSlider) {
    waveform.on("ready", function () {
      volumeSlider.addEventListener("input", function () {
        const volumeValue = parseFloat(volumeSlider.value) / 100; // Convert slider value to a range between 0 and 1
        waveform.setVolume(volumeValue);
      });
    });
  } else {
    console.warn('Element with ID "volumeSlider" not found');
  }

  // Play and pause control
  const playPauseButton = document.getElementById("play-pause-button");
  if (playPauseButton) {
    playPauseButton.addEventListener("click", function () {
      if (waveform.isPlaying()) {
        waveform.pause();
        playPauseButton.innerHTML = "&#9658;";
      } else {
        waveform.play();
        playPauseButton.innerHTML = "&#10074;&#10074;";
      }
    });
  } else {
    console.warn('Element with ID "play-pause-button" not found');
  }
});

// CAROUSEL SECTION
const carousel = document.querySelector(".carousel"),
  firstImg = carousel.querySelectorAll("img")[0],
  arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false,
  isDragging = false,
  prevPageX,
  prevScrollLeft,
  positionDiff;

const showHideIcons = () => {
  // showing and hiding prev/next icon according to carousel scroll left value
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
  arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
  arrowIcons[1].style.display =
    carousel.scrollLeft == scrollWidth ? "none" : "block";
};

arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
    // if clicked icon is left, reduce width value from the carousel scroll left else add to it
    carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
  });
});

const autoSlide = () => {
  // if there is no image left to scroll then return from here
  if (
    carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 ||
    carousel.scrollLeft <= 0
  )
    return;

  positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
  let firstImgWidth = firstImg.clientWidth + 14;
  // getting difference value that needs to add or reduce from carousel left to take middle img center
  let valDifference = firstImgWidth - positionDiff;

  if (carousel.scrollLeft > prevScrollLeft) {
    // if user is scrolling to the right
    return (carousel.scrollLeft +=
      positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
  }
  // if user is scrolling to the left
  carousel.scrollLeft -=
    positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
};

const dragStart = (e) => {
  // updatating global variables value on mouse down event
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  // scrolling images/carousel to left according to mouse pointer
  if (!isDragStart) return;
  e.preventDefault();
  isDragging = true;
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;
  showHideIcons();
};

const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");

  if (!isDragging) return;
  isDragging = false;
  autoSlide();
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

// VOLUME BUTTON CONTROLLER
const playButton = document.getElementById("playButton");
const audio = document.getElementById("myAudio");
const image = document.getElementById("myImage");

playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    image.style.opacity = 0.5; // Example: Reducing image opacity while playing
  } else {
    audio.pause();
    image.style.opacity = 1; // Example: Restoring image opacity when paused
  }
});
