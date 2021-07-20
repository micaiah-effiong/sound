// load song(s) to player display
// select song to play on media player
// song play auto
let audioCtx;
const audioElt = document.querySelector("#player");
const playBtn = document.querySelector("#playBtn");
const gainBtn = document.querySelector("#volumeBtn");
const panBtn = document.querySelector("#panBtn");
const audioLoader = document.querySelector("#audioLoader");
const audioListDisplay = document.querySelector("#audioListDisplay");
let audioList;
const bqfTypes = document.querySelector("#filterType");

const bqfDdetuneBtn = document.querySelector("#detuneBtn");
const bqfFrequencyBtn = document.querySelector("#frequencyBtn");
const bqfGainBtn = document.querySelector("#gainBtn");
const bqfQBtn = document.querySelector("#qBtn");

const bqfFilterToggle = document.querySelector("#filterToggle");

function handleFeqFilter(evt) {
  bqf.frequency.setValueAtTime(evt.target.value, audioCtx.currentTime);
}

function handleGainFilter(evt) {
  bqf.gain.setValueAtTime(evt.target.value, audioCtx.currentTime);
}

function handleDetuneFilter(evt) {
  bqf.detune.setValueAtTime(evt.target.value, audioCtx.currentTime);
}

function handleQFilter(evt) {
  bqf.Q.setValueAtTime(evt.target.value, audioCtx.currentTime);
}

function handleFilterType(evt) {
  bqf.type = evt.target.value;

  switch (evt.target.value) {
    case "lowpass":
    case "highpass":
    case "bandpass":
      setFilterUiActiveState(bqfGainBtn, false);
      setFilterUiActiveState(bqfQBtn, true);
      break;
    case "lowshelf":
    case "highshelf":
      setFilterUiActiveState(bqfQBtn, false);
      setFilterUiActiveState(bqfGainBtn, true);
      break;
    // case "peaking":
    //   break;
    case "notch":
    case "allpass":
      setFilterUiActiveState(bqfGainBtn, false);
      setFilterUiActiveState(bqfQBtn, true);
      break;
    default:
      void 0;
      break;
  }
}

function setFilterUiActiveState(elt, state) {
  elt.disabled = !state;
}

bqfFilterToggle.addEventListener("change", function (evt) {
  if (evt.target.checked) {
    trackPlayer
      .connect(bqf)
      .connect(gainNode)
      .connect(panner)
      .connect(audioCtx.destination);
  } else {
    trackPlayer.disconnect(bqf);
    bqf.disconnect(gainNode);
    trackPlayer.connect(gainNode).connect(panner).connect(audioCtx.destination);
  }
});

bqfTypes.addEventListener("change", handleFilterType);
bqfDdetuneBtn.addEventListener("input", handleDetuneFilter);
bqfFrequencyBtn.addEventListener("input", handleFeqFilter);
bqfGainBtn.addEventListener("input", handleGainFilter);
bqfQBtn.addEventListener("input", handleQFilter);

playBtn.addEventListener("click", function () {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
    console.log("resume");
  }

  if (audioElt.paused) {
    audioElt.play();
    console.log("play");
  } else {
    audioElt.pause();
    console.log("pause");
  }
});

gainBtn.addEventListener("input", function (evt) {
  gainNode.gain.value = evt.target.value;
});

panBtn.addEventListener("input", function (evt) {
  panner.pan.value = evt.target.value;
});

audioLoader.oninput = function (evt) {
  console.log(this.files);
  const files = Array.from(this.files);
  audioList = files;
  const filesHtml = files.map((file) => `<li>${file.name}</li>`);
  audioListDisplay.innerHTML = filesHtml.join(" ");
  /*  if (!audioCtx) {
    init();
  }*/
};

audioListDisplay.onclick = function (evt) {
  evt.preventDefault();
  evt.stopPropagation();
  if (evt.target.parentElement !== this) {
    return;
  }
  // find song
  const songName = evt.target.innerText;
  const audioFile = audioList.find((file) => file.name === songName);
  console.log(audioFile);
  playFromFile(audioFile);
};

function playFromFile(blob) {
  const reader = new FileReader();
  reader.onload = () => {
    audioElt.src = reader.result;
    console.log(blob, reader.result);
  };
  reader.readAsDataURL(blob);
}

// create audio context
audioCtx = new AudioContext();
const trackPlayer = audioCtx.createMediaElementSource(audioElt);

// create audio gain or volume
const gainNode = audioCtx.createGain();

// create stereo pan
const panner = audioCtx.createStereoPanner();

// create Biquad Filter
const bqf = audioCtx.createBiquadFilter();

// run audio connections
trackPlayer
  // .connect(bqf)
  .connect(gainNode)
  .connect(panner)
  .connect(audioCtx.destination);
