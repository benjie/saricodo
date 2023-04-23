const configureEl = document.getElementById("configure");
const segmentCountEl = document.getElementById("segment_count");
const segmentMinEl = document.getElementById("segment_min");
const segmentMaxEl = document.getElementById("segment_max");
const startTimeEl = document.getElementById("start_time");
const generateEl = document.getElementById("generate");
const generatedUrlEl = document.getElementById("generated_url");
const countdownWillStartEl = document.getElementById("countdown_will_start");
const countdownEl = document.getElementById("countdown");
const bangEl = document.getElementById("bang");
const bangFadeEl = document.getElementById("bang_fade");

const aEl = document.getElementById("a");
const bEl = document.getElementById("b");
const cEl = document.getElementById("c");
const dEl = document.getElementById("d");
const eEl = document.getElementById("e");

const INTERVAL = 33;

// Seed with any uint32_t
function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateValues(_count, _min, _max, _start, _seed) {
  const count = parseInt(_count, 10);
  const min = parseInt(_min, 10);
  const max = parseInt(_max, 10);
  const startTime = new Date();
  const parts = _start.split(":");
  startTime.setHours(parseInt(parts[0], 10));
  startTime.setMinutes(parseInt(parts[1], 10));
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);
  const seed = parseInt(_seed, 10);

  const rng = mulberry32(seed);
  const durations = [];
  let totalSeconds = 0;
  for (let i = 0; i < count; i++) {
    const duration = min + Math.floor(rng() * (1 + max - min));
    durations.push(duration);
    totalSeconds += duration;
  }
  const finish = new Date(+startTime + totalSeconds * 1000);
  return { durations, startTime, finish };
}

generateEl.onclick = (e) => {
  e.preventDefault();
  const seed = Math.floor(Math.random() * 2 ** 32);
  const count = parseInt(segmentCountEl.value, 10);
  const min = parseInt(segmentMinEl.value, 10);
  const max = parseInt(segmentMaxEl.value, 10);
  const start = startTimeEl.value;
  const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?count=${count}&min=${min}&max=${max}&start=${start}&seed=${seed}`;
  generatedUrlEl.value = url;
  const { durations, startTime, finish } = generateValues(
    count,
    min,
    max,
    start,
    seed
  );
  console.dir(startTime);
  console.dir(durations);
  console.log(finish);
};

if (window.location.search?.length > 0) {
  const parts = window.location.search.substring(1).split("&");
  const obj = Object.create(null);
  for (const part of parts) {
    const [key, value] = part.split("=");
    obj[key] = value;
  }
  startCountdown(obj.count, obj.min, obj.max, obj.start, obj.seed);
}

function startCountdown(count, min, max, start, seed) {
  const { durations, startTime, finish } = generateValues(
    count,
    min,
    max,
    start,
    seed
  );
  configureEl.style.display = "none";
  let timer;
  function updateCountdown() {
    clearTimeout(timer);
    let startOfCurrentMinute = new Date(+startTime);
    let nextMinute = null;
    let currentDuration = null;
    let now = Date.now();
    let minute = durations.length - 1;
    for (currentDuration of durations) {
      nextMinute = new Date(+startOfCurrentMinute + currentDuration * 1000);
      if (nextMinute <= now) {
        minute--;
        startOfCurrentMinute = nextMinute;
      } else {
        break;
      }
    }
    if (startOfCurrentMinute === nextMinute) {
      updateState();
      return;
    }
    const percent = (+nextMinute - Date.now()) / (currentDuration * 1000);
    const seconds = Math.floor(percent * 60);
    const splitSeconds = Math.floor(percent * 600) % 10;
    const [a, b] = String(minute).padStart(2, "0");
    const [c, d] = String(seconds).padStart(2, "0");
    const e = String(splitSeconds);
    aEl.style.backgroundPosition = `-${parseInt(a, 10) * 100}px 0px`;
    bEl.style.backgroundPosition = `-${parseInt(b, 10) * 100}px 0px`;
    cEl.style.backgroundPosition = `-${parseInt(c, 10) * 100}px 0px`;
    dEl.style.backgroundPosition = `-${parseInt(d, 10) * 100}px 0px`;
    eEl.style.backgroundPosition = `-${parseInt(e, 10) * 100}px 0px`;
    timeout = setTimeout(updateCountdown, INTERVAL);
  }
  function updateState() {
    clearTimeout(timer);
    countdownWillStartEl.style.display = "none";
    countdownEl.style.display = "none";
    bangEl.style.display = "none";
    document.body.style.backgroundColor = "";
    if (Date.now() > +finish) {
      bangEl.style.display = "block";
      bangFadeEl.style.display = "block";
      document.body.style.backgroundColor = "black";
      setTimeout(() => {
        bangFadeEl.style.opacity = "0";
      }, 2000);
    } else if (Date.now() > +startTime) {
      setTimeout(updateCountdown, INTERVAL);
      updateCountdown();
      countdownEl.style.display = "block";
      document.body.style.backgroundColor = "black";
    } else {
      const minute = durations.length;
      const [a, b] = String(minute).padStart(2, "0");
      countdownWillStartEl.innerHTML = `
<p>&nbsp;</p>
<img src='img/${a}.png' width=100 height=150 />
<img src='img/${b}.png' width=100 height=150 />
<img src='img/coplon.png' width=100 height=150 />
<img src='img/0.png' width=100 height=150 />
<img src='img/0.png' width=100 height=150 />
<img src='img/coplon.png' width=100 height=150 />
<img src='img/0.png' width=100 height=150 />
<p style='color: #333;text-align: center; font-family: sans-serif;'>Starts at ${startTime.toTimeString()}</p>
      `;
      document.body.style.backgroundColor = "black";
      countdownWillStartEl.style.display = "block";
      setTimeout(updateState, +startTime - Date.now());
    }
  }
  updateState();
}
