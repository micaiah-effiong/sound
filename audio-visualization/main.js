const WIDTH = 1000;
const HEIGHT = 1000;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;

let analyzer;
let bufferLength;

async function getAudio() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  analyzer = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyzer);
  // source.connect(analyzer.destination);
  console.log(audioContext);

  analyzer.fftSize = 2 ** 12; // size of data to collect
  // get time and frequency data
  bufferLength = analyzer.frequencyBinCount;
  const timeData = new Uint8Array(bufferLength);
  const frequencyData = new Uint8Array(bufferLength);
  drawTimeData(timeData);
}

function drawTimeData(timeData) {
  // inject time-data to Uint8Array
  analyzer.getByteTimeDomainData(timeData);
  // console.log(timeData);

  // draw
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "pink";
  // ctx.lineCap = "round";
  ctx.beginPath();
  const sliceWidth = WIDTH / bufferLength;
  // console.log(sliceWidth);
  let x = 0;
  timeData.forEach((data, i) => {
    let v = data / 128; // where 128 is assumed value for silence
    let y = (v * HEIGHT) / 2;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  });

  ctx.stroke();

  requestAnimationFrame(() => drawTimeData(timeData));
}

getAudio();
