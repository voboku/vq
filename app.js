const backdropCanvas = document.querySelector("#backdropCanvas");
const backdropCtx = backdropCanvas.getContext("2d");
const canvas = document.querySelector("#scoreCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const fileInput = document.querySelector("#fileInput");
const sampleInput = document.querySelector("#sampleInput");
const dropZone = document.querySelector("#dropZone");
const emptyState = document.querySelector("#emptyState");
const playButton = document.querySelector("#playButton");
const loadButton = document.querySelector("#loadButton");
const clearButton = document.querySelector("#clearButton");
const sampleLoadButton = document.querySelector("#sampleLoadButton");
const sampleNameReadout = document.querySelector("#sampleNameReadout");

const controls = {
  edge: document.querySelector("#edgeControl"),
  density: document.querySelector("#densityControl"),
  detail: document.querySelector("#detailControl"),
  contrast: document.querySelector("#contrastControl"),
  viewMode: document.querySelector("#viewMode"),
  bpm: document.querySelector("#bpmControl"),
  loopBars: document.querySelector("#loopBarsControl"),
  meter: document.querySelector("#meterControl"),
  key: document.querySelector("#keyControl"),
  scale: document.querySelector("#scaleControl"),
  octave: document.querySelector("#octaveControl"),
  voice: document.querySelector("#voiceControl"),
  sampleLevel: document.querySelector("#sampleLevelControl"),
  sampleWindow: document.querySelector("#sampleWindowControl"),
  colorMap: document.querySelector("#colorMapControl"),
  cutoff: document.querySelector("#cutoffControl"),
  resonance: document.querySelector("#resonanceControl"),
  attack: document.querySelector("#attackControl"),
  release: document.querySelector("#releaseControl"),
  glide: document.querySelector("#glideControl"),
  grind: document.querySelector("#grindControl"),
  grain: document.querySelector("#grainControl"),
  voices: document.querySelector("#voicesControl"),
  chance: document.querySelector("#chanceControl"),
  swing: document.querySelector("#swingControl"),
  stutter: document.querySelector("#stutterControl"),
  drone: document.querySelector("#droneControl"),
  reverb: document.querySelector("#reverbControl"),
  delay: document.querySelector("#delayControl"),
  feedback: document.querySelector("#feedbackControl"),
  granular: document.querySelector("#granularControl"),
  granularLevel: document.querySelector("#granularLevelControl"),
  granularSize: document.querySelector("#granularSizeControl"),
  granularDensity: document.querySelector("#granularDensityControl"),
  granularSpray: document.querySelector("#granularSprayControl"),
  granularPitch: document.querySelector("#granularPitchControl"),
  granularMute: document.querySelector("#granularMuteControl"),
  synthMute: document.querySelector("#synthMuteControl"),
  loop: document.querySelector("#loopControl"),
  reverse: document.querySelector("#reverseControl"),
  trace: document.querySelector("#traceControl"),
  marks: document.querySelector("#marksControl")
};

const readouts = {
  scan: document.querySelector("#scanReadout"),
  events: document.querySelector("#eventReadout"),
  scale: document.querySelector("#scaleReadout"),
  voice: document.querySelector("#voiceReadout"),
  image: document.querySelector("#imageReadout"),
  bpm: document.querySelector("#bpmReadout"),
  filter: document.querySelector("#filterReadout"),
  space: document.querySelector("#spaceReadout"),
  granular: document.querySelector("#granularReadout"),
  perform: document.querySelector("#performReadout")
};

const state = {
  image: null,
  imageData: null,
  originalImageData: null,
  gray: [],
  edges: [],
  maps: {},
  layerStats: {},
  imageSignature: null,
  activeLayer: "field",
  colors: [],
  colorProfile: null,
  imageMetrics: {
    density: 0,
    emptiness: 1,
    complexity: 0,
    softness: 1,
    overexposure: 0,
    darkness: 0,
    distance: 0.5,
    atmosphere: 0.5
  },
  events: [],
  layerEvents: {},
  isPlaying: false,
  startTime: 0,
  playhead: 0,
  lastColumn: -1,
  lastGranularStep: -1,
  activeVoices: 0,
  maxVoices: 58,
  mobileMode: false,
  frameEventCap: 6,
  lastAudioCheck: 0,
  recoveredErrors: 0,
  audioUnlocked: false,
  audioState: "none",
  audio: null,
  master: null,
  granularBus: null,
  delay: null,
  delayGain: null,
  feedbackGain: null,
  reverb: null,
  reverbGain: null,
  spatial: null,
  noiseBuffer: null,
  sample: null,
  sampleLoading: false,
  triggers: [],
  imageRect: null,
  animation: 0
};

const meters = {
  "4-4": [1, 1, 1, 1],
  "5-8": [1, 1.35, 0.85, 1.2, 0.9],
  "7-8": [1, 1, 1.45, 0.9, 1.05, 1.25, 0.85],
  "9-8": [1, 0.95, 1, 0.95, 1, 0.95, 1.55, 0.8, 1.05],
  "11-8": [1, 0.8, 1.25, 0.75, 1.55, 0.9, 1.1, 0.7, 1.35, 0.9, 1.2],
  free: [1, 0.62, 1.48, 0.76, 1.12, 0.54, 1.72, 0.9]
};

const scaleSystems = {
  major: scale("stable", [0, 2, 4, 5, 7, 9, 11], { center: 0.92, drift: 1, decay: 1.0 }),
  naturalMinor: scale("minor", [0, 2, 3, 5, 7, 8, 10], { center: 0.82, drift: 2, decay: 1.04 }),
  harmonicMinor: scale("ritual", [0, 2, 3, 5, 7, 8, 11], { center: 0.76, drift: 4, bend: 8, decay: 1.08 }),
  melodicMinor: scale("floating", [0, 2, 3, 5, 7, 9, 11], { center: 0.68, drift: 5, mutate: 0.08, decay: 1.08 }),
  chromatic: scale("unstable", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], { center: 0.24, drift: 11, mutate: 0.2, decay: 0.88 }),
  wholeTone: scale("liquid", [0, 2, 4, 6, 8, 10], { center: 0.34, drift: 7, mutate: 0.12, decay: 1.18 }),
  octatonic: scale("mechanical", [0, 1, 3, 4, 6, 7, 9, 10], { center: 0.42, drift: 5, cyclic: 0.18, decay: 0.94 }),
  dorian: scale("loop", [0, 2, 3, 5, 7, 9, 10], { center: 0.72, drift: 3, cyclic: 0.18, decay: 1.06 }),
  lydian: scale("glow", [0, 2, 4, 6, 7, 9, 11], { center: 0.52, drift: 4, mutate: 0.08, decay: 1.16 }),
  mixolydian: scale("human", [0, 2, 4, 5, 7, 9, 10], { center: 0.78, drift: 2, cyclic: 0.1, decay: 1.0 }),
  locrian: scale("collapse", [0, 1, 3, 5, 6, 8, 10], { center: 0.18, drift: 10, mutate: 0.18, decay: 0.92 }),
  minorPentatonic: scale("ground", [0, 3, 5, 7, 10], { center: 0.8, drift: 2, cyclic: 0.13, decay: 1.08 }),
  kalimbaPentatonic: scale("kalimba", [0, 2, 4, 7, 9], { center: 0.7, drift: 8, cyclic: 0.36, layout: "scatter", decay: 1.42, resonance: 0.7 }),
  mbiraCycle: scale("mbira", [0, 2, 4, 7, 9, 12, 14, 16], { center: 0.82, drift: 7, cyclic: 0.62, layout: "interlock", decay: 1.28, resonance: 0.62 }),
  yo: scale("yo", [0, 2, 5, 7, 9], { center: 0.82, drift: 3, decay: 1.12 }),
  inScale: scale("in", [0, 1, 5, 7, 8], { center: 0.62, drift: 7, bend: 10, decay: 1.18 }),
  hirajoshi: scale("hirajoshi", [0, 2, 3, 7, 8], { center: 0.58, drift: 6, bend: 7, decay: 1.18 }),
  iwato: scale("iwato", [0, 1, 5, 6, 10], { center: 0.38, drift: 8, mutate: 0.08, decay: 1.1 }),
  ryukyu: scale("ryukyu", [0, 4, 5, 7, 11], { center: 0.72, drift: 4, decay: 1.18 }),
  slendro: scale("slendro", [0, 2.4, 4.8, 7.2, 9.6], { center: 0.48, drift: 12, cyclic: 0.28, paired: 9, decay: 1.26, resonance: 0.82 }),
  pelog: scale("pelog", [0, 1, 3, 5, 7, 8, 10], { center: 0.46, drift: 10, paired: 7, mutate: 0.09, decay: 1.2, resonance: 0.76 }),
  phrygianDominant: scale("psychedelic", [0, 1, 4, 5, 7, 8, 10], { center: 0.52, drift: 13, bend: 18, mutate: 0.16, decay: 1.14 }),
  doubleHarmonic: scale("ceremony", [0, 1, 4, 5, 7, 8, 11], { center: 0.56, drift: 11, bend: 14, mutate: 0.1, decay: 1.16 }),
  hungarianMinor: scale("strange", [0, 2, 3, 6, 7, 8, 11], { center: 0.42, drift: 12, bend: 12, mutate: 0.14, decay: 1.1 }),
  altered: scale("alien", [0, 1, 3, 4, 6, 8, 10], { center: 0.14, drift: 16, mutate: 0.24, decay: 0.9 }),
  ragaMinor: scale("raga", [0, 1, 3, 5, 7, 8, 10], { center: 0.94, drift: 9, bend: 22, drone: 0.9, decay: 1.34 }),
  ragaMajor: scale("raga", [0, 2, 4, 6, 7, 9, 11], { center: 0.9, drift: 8, bend: 18, drone: 0.84, decay: 1.32 }),
  justIntonation: scale("ratio", [], { ratios: [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2], center: 0.88, drift: 5, decay: 1.22, resonance: 0.9 }),
  tet19: scale("micro", Array.from({ length: 19 }, (_, i) => i * (12 / 19)), { center: 0.32, drift: 14, mutate: 0.12, decay: 1.02 }),
  tet24: scale("micro", Array.from({ length: 24 }, (_, i) => i * 0.5), { center: 0.3, drift: 16, mutate: 0.16, decay: 1.0 }),
  harmonicSeries: scale("spectral", [], { partials: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], center: 0.78, drift: 6, decay: 1.38, resonance: 1.0 }),
  morphing: scale("morph", [0, 2, 4, 7, 9], { morphTo: [0, 2, 4, 6, 7, 9, 11], center: 0.46, drift: 15, mutate: 0.34, decay: 1.24 })
};

const keyOffsets = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11
};

const glyphs = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function scale(family, intervals, behavior = {}) {
  return {
    family,
    intervals,
    center: behavior.center ?? 0.55,
    drift: behavior.drift ?? 0,
    bend: behavior.bend ?? 0,
    mutate: behavior.mutate ?? 0,
    cyclic: behavior.cyclic ?? 0,
    decay: behavior.decay ?? 1,
    resonance: behavior.resonance ?? 0,
    paired: behavior.paired ?? 0,
    drone: behavior.drone ?? 0,
    layout: behavior.layout || "linear",
    ratios: behavior.ratios || null,
    partials: behavior.partials || null,
    morphTo: behavior.morphTo || null
  };
}

function seededWave(value) {
  const raw = Math.sin(value * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

function makeDistortionCurve(amount) {
  const samples = 512;
  const curve = new Float32Array(samples);
  const drive = 1 + amount * 42;
  for (let i = 0; i < samples; i += 1) {
    const x = (i * 2) / samples - 1;
    curve[i] = Math.tanh(x * drive) * (1 - amount * 0.18);
  }
  return curve;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(640, Math.floor(rect.width * ratio));
  canvas.height = Math.max(420, Math.floor(rect.height * ratio));
  render();
}

function resizeBackdrop() {
  const ratio = window.devicePixelRatio || 1;
  backdropCanvas.width = Math.floor(window.innerWidth * ratio);
  backdropCanvas.height = Math.floor(window.innerHeight * ratio);
  drawGeneratedBackdrop();
}

function drawGeneratedBackdrop() {
  const w = backdropCanvas.width;
  const h = backdropCanvas.height;
  const c = backdropCtx;
  c.clearRect(0, 0, w, h);
  c.fillStyle = "#e1e4dd";
  c.fillRect(0, 0, w, h);

  c.save();
  c.globalAlpha = 0.58;
  c.strokeStyle = "rgba(118, 125, 116, 0.048)";
  c.lineWidth = Math.max(1, w / 1800);
  for (let y = 0; y < h; y += Math.max(5, h / 150)) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(w, y + Math.sin(y * 0.017) * 1.2);
    c.stroke();
  }

  c.strokeStyle = "rgba(118, 125, 116, 0.08)";
  c.lineWidth = Math.max(1, w / 1400);
  c.beginPath();
  c.moveTo(w * 0.503, 0);
  c.lineTo(w * 0.496, h);
  c.stroke();

  drawArchiveContours(c, w, h);
  drawCutLines(c, w, h);

  c.fillStyle = "rgba(118, 125, 116, 0.07)";
  for (let i = 0; i < 140; i += 1) {
    const x = (Math.sin(i * 19.91) * 0.5 + 0.5) * w;
    const y = (Math.cos(i * 11.73) * 0.5 + 0.5) * h;
    const size = 0.7 + (i % 5) * 0.45;
    c.fillRect(x, y, size, size * (1 + (i % 3) * 0.4));
  }
  c.restore();
}

function drawArchiveContours(c, w, h) {
  c.save();
  c.strokeStyle = "rgba(118, 125, 116, 0.12)";
  c.lineWidth = Math.max(0.8, w / 2600);
  for (let band = 0; band < 10; band += 1) {
    const cx = w * (0.12 + ((band * 0.173) % 0.78));
    const cy = h * (0.12 + ((band * 0.239) % 0.74));
    const rx = w * (0.055 + (band % 4) * 0.024);
    const ry = h * (0.04 + (band % 5) * 0.018);
    for (let ring = 0; ring < 4; ring += 1) {
      c.beginPath();
      for (let i = 0; i <= 96; i += 1) {
        const t = (i / 96) * Math.PI * 2;
        const warp = 1 + Math.sin(t * (3 + (band % 3)) + band) * 0.16;
        const x = cx + Math.cos(t) * (rx + ring * w * 0.013) * warp;
        const y = cy + Math.sin(t) * (ry + ring * h * 0.01) * (1 + Math.cos(t * 2 + band) * 0.08);
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
  }
  c.restore();
}

function drawPaperBlock(c, x, y, w, h, color, rotation) {
  c.save();
  c.translate(x + w / 2, y + h / 2);
  c.rotate(rotation);
  c.fillStyle = color;
  c.fillRect(-w / 2, -h / 2, w, h);
  c.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 12; i += 1) {
    c.fillRect(-w / 2 + i * w / 14, -h / 2, 1, h);
  }
  c.restore();
}

function drawBlueScribble(c, x, y, w, h) {
  c.save();
  c.strokeStyle = "rgba(118, 130, 135, 0.42)";
  c.lineWidth = Math.max(2, w * 0.01);
  c.lineCap = "round";
  for (let line = 0; line < 8; line += 1) {
    c.beginPath();
    for (let i = 0; i < 42; i += 1) {
      const t = i / 41;
      const px = x + t * w;
      const py = y + h * (0.5 + Math.sin(t * Math.PI * (2 + line * 0.35)) * 0.26 + Math.sin(i * 1.9 + line) * 0.035);
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.stroke();
  }
  c.restore();
}

function drawPixelCluster(c, x, y, count, size) {
  const colors = ["#92998f", "#b8aa62", "#a7afa4", "#c8c9bd", "#9fa99d", "#b7b1aa"];
  for (let i = 0; i < count; i += 1) {
    c.fillStyle = colors[i % colors.length];
    const px = x + ((i * 37) % 11) * size * 1.2;
    const py = y + Math.floor(i / 5) * size * 1.15;
    c.fillRect(px, py, size, size);
  }
}

function drawStar(c, x, y, r, color) {
  c.save();
  c.translate(x, y);
  c.fillStyle = color;
  c.beginPath();
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 2;
    const rr = i % 2 ? r * 0.4 : r;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  }
  c.closePath();
  c.fill();
  c.restore();
}

function drawTab(c, x, y, text, color) {
  c.save();
  c.fillStyle = color;
  c.beginPath();
  c.roundRect(x, y, 78, 28, 14);
  c.fill();
  c.fillStyle = "rgba(96, 102, 94, 0.7)";
  c.font = "14px ui-monospace, Menlo, monospace";
  c.fillText(text, x + 17, y + 18);
  c.restore();
}

function drawCutLines(c, w, h) {
  c.strokeStyle = "rgba(118, 125, 116, 0.16)";
  c.lineWidth = 1;
  for (let i = 0; i < 9; i += 1) {
    const x = (i / 9) * w + w * 0.05;
    c.beginPath();
    c.moveTo(x, h * 0.08);
    c.lineTo(x + Math.sin(i) * w * 0.06, h * 0.94);
    c.stroke();
  }
}

function analyzeColor(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let hue = 0;

  if (delta > 0.0001) {
    if (max === rn) hue = ((gn - bn) / delta) % 6;
    else if (max === gn) hue = (bn - rn) / delta + 2;
    else hue = (rn - gn) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  const value = max;
  const family = colorFamily(hue, saturation, value);
  return { hue, saturation, lightness, value, family };
}

function colorFamily(hue, saturation, value) {
  if (saturation < 0.14 || value < 0.08) return "neutral";
  if (hue < 28 || hue >= 338) return "red";
  if (hue < 78) return "yellow";
  if (hue < 154) return "green";
  if (hue < 205) return "cyan";
  if (hue < 266) return "blue";
  return "purple";
}

function colorCss(color, alpha = null) {
  const palette = {
    red: [91, 74, 66, 0.42],
    yellow: [156, 143, 78, 0.46],
    green: [95, 106, 88, 0.38],
    cyan: [88, 101, 102, 0.36],
    blue: [78, 86, 92, 0.36],
    purple: [86, 78, 88, 0.36],
    neutral: [18, 21, 20, 0.32]
  };
  const [r, g, b, a] = palette[color.family] || palette.neutral;
  return `rgba(${r}, ${g}, ${b}, ${alpha ?? a})`;
}

function dominantColorName(profile = state.colorProfile) {
  if (!profile) return "neutral";
  return Object.entries(profile).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
}

function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      state.image = img;
      emptyState.classList.add("is-hidden");
      analyzeImage();
      render();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

async function loadSampleFile(file) {
  if (!file || !file.type.startsWith("audio/")) return;
  await ensureAudio();
  state.sampleLoading = true;
  updateReadouts();
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const buffer = await state.audio.decodeAudioData(reader.result.slice(0));
      state.sample = {
        name: file.name.replace(/\.[^.]+$/, "").slice(0, 26),
        buffer,
        reverseBuffer: makeReversedBuffer(buffer),
        duration: buffer.duration
      };
      controls.voice.value = "sample";
      state.sampleLoading = false;
      updateReadouts();
    } catch (error) {
      state.sampleLoading = false;
      state.recoveredErrors += 1;
      readouts.perform.textContent = `sample error ${state.recoveredErrors}`;
      updateReadouts();
      console.error(error);
    }
  };
  reader.onerror = () => {
    state.sampleLoading = false;
    updateReadouts();
  };
  reader.readAsArrayBuffer(file);
}

function makeReversedBuffer(buffer) {
  const reversed = state.audio.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const input = buffer.getChannelData(channel);
    const output = reversed.getChannelData(channel);
    for (let i = 0; i < input.length; i += 1) {
      output[i] = input[input.length - 1 - i];
    }
  }
  return reversed;
}

function analyzeImage() {
  if (!state.image) return;
  const work = document.createElement("canvas");
  const detail = Number(controls.detail.value);
  const maxW = 260 + detail * 48;
  const maxH = 170 + detail * 32;
  const scale = Math.min(maxW / state.image.width, maxH / state.image.height);
  work.width = Math.max(48, Math.floor(state.image.width * scale));
  work.height = Math.max(32, Math.floor(state.image.height * scale));
  const wctx = work.getContext("2d", { willReadFrequently: true });
  wctx.fillStyle = "#f2f3ef";
  wctx.fillRect(0, 0, work.width, work.height);
  wctx.drawImage(state.image, 0, 0, work.width, work.height);
  state.imageData = wctx.getImageData(0, 0, work.width, work.height);
  state.originalImageData = new ImageData(
    new Uint8ClampedArray(state.imageData.data),
    state.imageData.width,
    state.imageData.height
  );
  const { data, width, height } = state.imageData;
  state.gray = new Float32Array(width * height);
  state.edges = new Float32Array(width * height);
  state.colors = new Array(width * height);
  const colorProfile = { red: 0, yellow: 0, green: 0, cyan: 0, blue: 0, purple: 0, neutral: 0 };
  let graySum = 0;
  let brightPixels = 0;
  let darkPixels = 0;
  let saturationSum = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const color = analyzeColor(r, g, b);
      const gray = r * 0.299 + g * 0.587 + b * 0.114;
      state.gray[y * width + x] = gray;
      state.colors[y * width + x] = color;
      colorProfile[color.family] += color.saturation * (0.35 + color.value * 0.65);
      graySum += gray;
      saturationSum += color.saturation;
      if (gray > 224) brightPixels += 1;
      if (gray < 48) darkPixels += 1;
    }
  }
  state.colorProfile = colorProfile;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      const gx =
        -state.gray[i - width - 1] -
        2 * state.gray[i - 1] -
        state.gray[i + width - 1] +
        state.gray[i - width + 1] +
        2 * state.gray[i + 1] +
        state.gray[i + width + 1];
      const gy =
        -state.gray[i - width - 1] -
        2 * state.gray[i - width] -
        state.gray[i - width + 1] +
        state.gray[i + width - 1] +
        2 * state.gray[i + width] +
        state.gray[i + width + 1];
      state.edges[i] = Math.min(255, Math.hypot(gx, gy));
    }
  }
  state.imageMetrics = measureImageAtmosphere({
    width,
    height,
    graySum,
    brightPixels,
    darkPixels,
    saturationSum
  });
  state.imageSignature = measureImageSignature(width, height);
  state.maps = buildImageMaps(width, height);
  state.layerStats = measureLayerStats(state.maps, width, height);
  buildEvents();
}

function buildImageMaps(width, height) {
  const size = width * height;
  const signature = state.imageSignature || {};
  const q = signature.gray || { q10: 0.1, q25: 0.25, q50: 0.5, q75: 0.75, q90: 0.9 };
  const edgeStats = signature.edge || { q50: 0.12, q75: 0.22, q90: 0.38, spread: 0.2 };
  const textureStats = signature.texture || { mean: 0.05, peak: 0.18 };
  const colorStats = signature.color || { saturationMean: 0.08, hueVectorX: 0, hueVectorY: 0 };
  const tonalSpread = Math.max(0.08, q.q90 - q.q10);
  const edgeSpread = Math.max(0.04, edgeStats.q90 - edgeStats.q50);
  const textureSpread = Math.max(0.025, textureStats.peak - textureStats.mean);
  const maps = {
    contour: new Float32Array(size),
    shadow: new Float32Array(size),
    dust: new Float32Array(size),
    field: new Float32Array(size),
    object: new Float32Array(size),
    grain: new Float32Array(size),
    colorTrace: new Float32Array(size),
    xray: new Float32Array(size),
    normal: new Float32Array(size),
    ascii: new Float32Array(size)
  };

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      const gray = state.gray[i] / 255;
      const dark = 1 - gray;
      const edge = state.edges[i] / 255;
      const color = state.colors[i] || { saturation: 0, value: gray };
      let neighbor = 0;
      let localDark = 0;
      let localEdge = 0;
      let count = 0;

      for (let oy = -2; oy <= 2; oy += 1) {
        for (let ox = -2; ox <= 2; ox += 1) {
          const ni = (y + oy) * width + x + ox;
          neighbor += state.gray[ni] / 255;
          localDark += 1 - state.gray[ni] / 255;
          localEdge += state.edges[ni] / 255;
          count += 1;
        }
      }

      const localGray = neighbor / count;
      const darkMass = localDark / count;
      const edgeMass = localEdge / count;
      const isolated = Math.abs(gray - localGray);
      const relativeDark = clamp01((q.q50 - gray) / Math.max(0.05, q.q50 - q.q10));
      const relativeBright = clamp01((gray - q.q50) / Math.max(0.05, q.q90 - q.q50));
      const tonalRarity = clamp01(Math.abs(gray - q.q50) / tonalSpread);
      const localContrast = clamp01(isolated / textureSpread);
      const edgeRarity = clamp01((edge - edgeStats.q50) / edgeSpread);
      const strongContour = clamp01((edge - edgeStats.q75) / Math.max(0.035, edgeStats.q90 - edgeStats.q75));
      const flatness = clamp01(1 - edgeRarity * 0.9 - localContrast * 0.42);
      const hueAngle = color.hue * Math.PI / 180;
      const hueX = Math.cos(hueAngle);
      const hueY = Math.sin(hueAngle);
      const hueDistance = Math.hypot(hueX - colorStats.hueVectorX, hueY - colorStats.hueVectorY) * 0.5;
      const saturationRarity = clamp01((color.saturation - colorStats.saturationMean) / 0.42);
      const colorDifference = clamp01(hueDistance * color.saturation + saturationRarity * 0.6);
      const bandPosition = clamp01((gray - q.q10) / tonalSpread);
      const band = Math.abs(((bandPosition * (5 + Math.round(signature.complexityBand || 0))) % 1) - 0.5) * 2;
      const objectMass = clamp01((relativeDark * darkMass + relativeBright * (1 - darkMass)) * (1 - edgeMass * 0.52));

      maps.contour[i] = clamp01(strongContour * 0.72 + edgeRarity * 0.42 + localContrast * 0.18);
      maps.shadow[i] = clamp01(relativeDark * 0.74 + darkMass * relativeDark * 0.34 + tonalRarity * relativeDark * 0.22);
      maps.dust[i] = clamp01(localContrast * 0.86 * (1 - edgeMass * 0.66) + tonalRarity * isolated * 1.4);
      maps.field[i] = clamp01(relativeBright * flatness * 0.92 + (1 - tonalRarity) * flatness * 0.26);
      maps.object[i] = clamp01(objectMass * 0.84 + edgeMass * tonalRarity * 0.24);
      maps.grain[i] = clamp01((localContrast * 0.72 + edgeRarity * 0.28) * (0.48 + seededWave(x * 0.37 + y * 0.91) * 0.34 + tonalRarity * 0.28));
      maps.colorTrace[i] = clamp01(colorDifference * (0.52 + color.value * 0.34) + edgeRarity * color.saturation * 0.22);
      maps.xray[i] = clamp01((1 - band) * 0.48 + tonalRarity * 0.34 + edgeRarity * 0.18 + flatness * relativeBright * 0.12);
      maps.normal[i] = maps.contour[i];
      maps.ascii[i] = maps.contour[i];
    }
  }

  return maps;
}

function measureImageSignature(width, height) {
  const size = Math.max(1, width * height);
  const grayValues = new Float32Array(size);
  const edgeValues = new Float32Array(size);
  let saturationSum = 0;
  let hueVectorX = 0;
  let hueVectorY = 0;
  let textureSum = 0;
  let texturePeak = 0;
  let leftMass = 0;
  let rightMass = 0;
  let topMass = 0;
  let bottomMass = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      const gray = state.gray[i] / 255;
      const edge = state.edges[i] / 255;
      const color = state.colors[i] || { hue: 0, saturation: 0 };
      grayValues[i] = gray;
      edgeValues[i] = edge;
      saturationSum += color.saturation;
      if (color.saturation > 0.08) {
        const hue = color.hue * Math.PI / 180;
        hueVectorX += Math.cos(hue) * color.saturation;
        hueVectorY += Math.sin(hue) * color.saturation;
      }

      if (x > 0 && y > 0) {
        const texture = (Math.abs(state.gray[i] - state.gray[i - 1]) + Math.abs(state.gray[i] - state.gray[i - width])) / 510;
        textureSum += texture;
        texturePeak = Math.max(texturePeak, texture);
      }

      const mass = edge + Math.abs(gray - 0.5) * 0.42 + color.saturation * 0.24;
      if (x < width * 0.5) leftMass += mass;
      else rightMass += mass;
      if (y < height * 0.5) topMass += mass;
      else bottomMass += mass;
    }
  }

  const gray = quantileSummary(grayValues);
  const edge = quantileSummary(edgeValues);
  const sat = Math.max(0.0001, saturationSum);
  const textureMean = textureSum / Math.max(1, (width - 1) * (height - 1));
  const asymmetry = clamp01((Math.abs(leftMass - rightMass) + Math.abs(topMass - bottomMass)) / Math.max(1, leftMass + rightMass + topMass + bottomMass));

  return {
    gray,
    edge: {
      ...edge,
      spread: Math.max(0.035, edge.q90 - edge.q50)
    },
    texture: {
      mean: textureMean,
      peak: texturePeak
    },
    color: {
      saturationMean: saturationSum / size,
      hueVectorX: hueVectorX / sat,
      hueVectorY: hueVectorY / sat
    },
    asymmetry,
    complexityBand: 1 + Math.round(clamp01(edge.q75 * 3 + textureMean * 4 + asymmetry) * 5)
  };
}

function quantileSummary(values) {
  const sorted = Array.from(values).sort((a, b) => a - b);
  const pick = (p) => sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p)))] || 0;
  return {
    q10: pick(0.1),
    q25: pick(0.25),
    q50: pick(0.5),
    q75: pick(0.75),
    q90: pick(0.9),
    mean: sorted.reduce((sum, value) => sum + value, 0) / Math.max(1, sorted.length)
  };
}

function measureLayerStats(maps, width, height) {
  const stats = {};
  const layers = ["contour", "shadow", "dust", "field", "object", "grain", "colorTrace", "xray"];
  layers.forEach((layer) => {
    const map = maps[layer];
    let sum = 0;
    let peak = 0;
    let active = 0;
    for (let i = 0; i < map.length; i += 1) {
      const value = map[i];
      sum += value;
      peak = Math.max(peak, value);
      if (value > 0.38) active += 1;
    }
    const total = Math.max(1, width * height);
    stats[layer] = {
      average: sum / total,
      peak,
      coverage: active / total
    };
  });
  return stats;
}

function measureImageAtmosphere({ width, height, graySum, brightPixels, darkPixels, saturationSum }) {
  const total = Math.max(1, width * height);
  let edgeSum = 0;
  let edgePeak = 0;
  let activePixels = 0;
  let horizontalFlux = 0;
  let verticalFlux = 0;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      const edge = state.edges[i] / 255;
      const dark = 1 - state.gray[i] / 255;
      edgeSum += edge;
      edgePeak = Math.max(edgePeak, edge);
      if (edge > 0.12 || dark > 0.62) activePixels += 1;
      horizontalFlux += Math.abs(state.gray[i] - state.gray[i - 1]) / 255;
      verticalFlux += Math.abs(state.gray[i] - state.gray[i - width]) / 255;
    }
  }

  const inner = Math.max(1, (width - 2) * (height - 2));
  const averageGray = graySum / total / 255;
  const edgeAverage = edgeSum / inner;
  const density = clamp01(activePixels / inner);
  const emptiness = clamp01(1 - density * 1.38);
  const complexity = clamp01(edgeAverage * 3.2 + edgePeak * 0.28);
  const softness = clamp01(1 - complexity * 0.72);
  const overexposure = clamp01(brightPixels / total * 2.4 + averageGray * 0.18);
  const darkness = darkPixels / total;
  const directionality = clamp01(Math.abs(horizontalFlux - verticalFlux) / inner * 5.5);
  const atmosphere = clamp01(softness * 0.42 + emptiness * 0.28 + overexposure * 0.2 + (saturationSum / total) * 0.1);
  const distance = clamp01(0.24 + emptiness * 0.38 + softness * 0.26 + overexposure * 0.18 - darkness * 0.18);

  return {
    density,
    emptiness,
    complexity,
    softness,
    overexposure,
    darkness,
    distance,
    atmosphere,
    directionality
  };
}

function buildEvents() {
  if (!state.imageData) return;
  const { width, height } = state.imageData;
  const scan = analysisScan(controls.viewMode.value);
  const threshold = Number(controls.edge.value);
  const step = Math.max(1, 13 - Number(controls.density.value));
  const detailBias = Number(controls.detail.value) * 3.2;
  const layerScans = activeScanLayers();
  state.layerEvents = {};
  layerScans.forEach((layer) => {
    state.layerEvents[layer] = collectEventsForScan(layer, width, height, step, threshold, detailBias);
  });
  state.activeLayer = scan === "auto" ? dominantAnalysisLayer() : scan;
  state.events = state.layerEvents[state.activeLayer] || collectEventsForScan(state.activeLayer, width, height, step, threshold, detailBias);
  updateReadouts();
}

function analysisScan(mode) {
  if (mode === "normal" || mode === "ascii") return "auto";
  return mode;
}

function activeScanLayers() {
  return ["field", "colorTrace", "xray"];
}

function dominantAnalysisLayer() {
  const metric = state.imageMetrics;
  const stats = state.layerStats || {};
  const colorStrength = Object.entries(state.colorProfile || {}).reduce((sum, [key, value]) => key === "neutral" ? sum : sum + value, 0);
  const candidates = {
    field: (stats.field?.coverage || 0) * 0.9 + metric.emptiness * 1.35 + metric.overexposure * 0.72,
    colorTrace: (stats.colorTrace?.average || 0) * 2.2 + colorStrength * 0.00008,
    xray: (stats.xray?.peak || 0) * 0.94 + (stats.xray?.coverage || 0) * 0.28 + metric.softness * 0.12
  };
  return Object.entries(candidates).sort((a, b) => b[1] - a[1])[0]?.[0] || "field";
}

function collectEventsForScan(scan, width, height, step, threshold, detailBias) {
  const map = state.maps[scan] || state.maps.field;
  const signature = state.imageSignature || {};
  const q = signature.gray || { q10: 0.1, q50: 0.5, q90: 0.9 };
  const tonalSpread = Math.max(0.08, q.q90 - q.q10);
  const modeThreshold = scanThreshold(scan, threshold, detailBias);
  const adaptive = adaptiveScanThreshold(scan, modeThreshold);
  const events = [];

  for (let x = 1; x < width - 1; x += step) {
    for (let y = 1; y < height - 1; y += step) {
      const i = y * width + x;
      const edge = state.edges[y * width + x];
      const gray = state.gray[y * width + x];
      const color = state.colors[y * width + x];
      const right = state.gray[y * width + Math.min(width - 1, x + 1)];
      const down = state.gray[Math.min(height - 1, y + 1) * width + x];
      const angle = Math.atan2(down - gray, right - gray);
      const bright = gray / 255;
      const edgeNorm = edge / 255;
      const dark = 1 - gray / 255;
      const softPresence = Math.max(0, 1 - edgeNorm * 2.2) * bright;
      const scanValue = map[i] || 0;
      const accepted = scanValue > adaptive || scanFallback(scan, { edgeNorm, dark, bright, softPresence, color });
      if (accepted) {
        const tonalRarity = clamp01(Math.abs(bright - q.q50) / tonalSpread);
        const colorRarity = color ? clamp01((color.saturation - (signature.color?.saturationMean || 0)) / 0.42) : 0;
        const localContrast = clamp01(Math.abs(bright - ((right + down) / 510)) / Math.max(0.035, signature.texture?.peak || 0.12));
        const orientation = (angle + Math.PI) / (Math.PI * 2);
        const sourceStrength = clamp01(scanValue * 0.58 + tonalRarity * 0.18 + localContrast * 0.16 + colorRarity * 0.12);
        const pitchBias = scanPitchBias(scan, {
          tonalRarity,
          colorRarity,
          localContrast,
          orientation,
          bright,
          dark
        });
        events.push({
          x: x / width,
          y: y / height,
          edge: edgeNorm,
          dark,
          color,
          angle,
          soft: softPresence,
          scan,
          scanValue,
          sourceStrength,
          tonalRarity,
          colorRarity,
          localContrast,
          orientation,
          pitchBias,
          atmosphere: state.imageMetrics.atmosphere,
          distance: state.imageMetrics.distance
        });
      }
    }
  }

  const maxEventsByScan = {
    field: 1400,
    colorTrace: 1200,
    xray: 520
  };
  const densityBoost = Number(controls.density.value) * (scan === "xray" ? 28 : 90);
  const detailBoost = Number(controls.detail.value) * (scan === "xray" ? 32 : 140);
  const maxEvents = Math.round((maxEventsByScan[scan] || 900) + detailBoost + densityBoost);
  return pruneEvents(events, maxEvents);
}

function scanPitchBias(scan, event) {
  const table = {
    contour: (event.orientation - 0.5) * 0.18 + event.localContrast * 0.06,
    shadow: -0.18 - event.dark * 0.08 + event.tonalRarity * 0.05,
    dust: 0.18 + event.localContrast * 0.12,
    field: 0.12 + event.bright * 0.08,
    object: -0.08 + event.tonalRarity * 0.04,
    grain: (event.localContrast - 0.5) * 0.2,
    colorTrace: (event.colorRarity - 0.35) * 0.26,
    xray: Math.sin(event.tonalRarity * Math.PI * 2) * 0.16
  };
  return table[scan] || 0;
}

function adaptiveScanThreshold(scan, fallback) {
  const stat = state.layerStats?.[scan];
  if (!stat) return fallback;
  const strictness = {
    field: 0.58,
    colorTrace: 0.5,
    xray: 0.72
  }[scan] ?? 0.52;
  const adaptive = stat.average + (stat.peak - stat.average) * strictness;
  return Math.max(fallback * 0.72, Math.min(scan === "xray" ? 0.92 : 0.82, adaptive));
}

function scanThreshold(scan, threshold, detailBias) {
  const base = clamp01((threshold - detailBias) / 255);
  const table = {
    field: 0.42,
    colorTrace: 0.18,
    xray: 0.66
  };
  return table[scan] ?? table.field;
}

function scanFallback(scan, event) {
  if (scan === "field") return event.bright > 0.78 && event.edgeNorm < 0.14;
  if (scan === "colorTrace") return event.color && event.color.saturation > 0.18;
  if (scan === "xray") return event.edgeNorm > 0.34 && Math.abs(event.bright - 0.5) < 0.045;
  return false;
}

function pruneEvents(events, maxEvents) {
  if (events.length <= maxEvents) return events;
  const stride = Math.max(1, Math.floor(events.length / maxEvents));
  const selected = [];
  const buckets = new Map();

  for (let i = 0; i < events.length; i += stride) {
    const event = events[i];
    const bucketX = Math.floor(event.x * 180);
    const bucketY = Math.floor(event.y * 90);
    const key = `${bucketX}:${bucketY}`;
    const score = event.edge * 0.62 + event.dark * 0.24 + (event.soft || 0) * 0.14;
    const current = buckets.get(key);
    if (!current || score > current.score) buckets.set(key, { event, score });
  }

  for (const item of buckets.values()) selected.push(item.event);
  if (selected.length > maxEvents) selected.length = maxEvents;
  return selected.sort((a, b) => a.x - b.x);
}

function render() {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  drawBackground(w, h);

  if (!state.imageData) {
    drawIdleGrid(w, h);
    return;
  }

  const pad = Math.round(Math.min(w, h) * 0.055);
  const area = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };
  const imageRect = renderedImageRect(area);
  state.imageRect = imageRect;
  drawScore(area, imageRect);
  drawEventField(imageRect);
  drawTriggers(imageRect);
  drawPlayhead(imageRect);
}

function renderedImageRect(area) {
  return area;
}

function drawBackground(w, h) {
  ctx.fillStyle = "#f4f5f1";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(126, 133, 123, 0.04)";
  ctx.lineWidth = 1;
  for (let y = 6; y <= h; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  for (let y = 2; y <= h; y += 19) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(126, 133, 123, 0.032)";
  const grid = Math.max(46, Math.floor(w / 24));
  for (let x = 0; x <= w; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
}

function drawIdleGrid(w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(24, 27, 24, 0.055)";
  ctx.lineWidth = 1;
  const left = Math.round(w * 0.34);
  const right = Math.round(w * 0.66);
  const top = Math.round(h * 0.24);
  const bottom = Math.round(h * 0.68);
  const columns = 40;
  const spacing = (right - left) / columns;
  for (let i = 0; i <= columns; i += 1) {
    const x = Math.round(left + spacing * i) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(24, 27, 24, 0.028)";
  const rows = 8;
  const rowSpacing = (bottom - top) / rows;
  for (let i = 0; i <= rows; i += 1) {
    const y = Math.round(top + rowSpacing * i) + 0.5;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(24, 27, 24, 0.05)";
  ctx.beginPath();
  ctx.moveTo(Math.round(w * 0.3) + 0.5, Math.round(h * 0.46) + 0.5);
  ctx.lineTo(left, Math.round(h * 0.46) + 0.5);
  ctx.moveTo(right, Math.round(h * 0.46) + 0.5);
  ctx.lineTo(Math.round(w * 0.7) + 0.5, Math.round(h * 0.46) + 0.5);
  ctx.stroke();
  ctx.restore();
}

function drawScore(area, imageRect) {
  const contrast = Number(controls.contrast.value) / 6;
  const mode = controls.viewMode.value;
  const lineW = Math.max(1, canvas.width / 900);
  const grindVisual = Number(controls.grind.value) / 100;
  const localImage = {
    x: imageRect.x - area.x,
    y: imageRect.y - area.y,
    w: imageRect.w,
    h: imageRect.h
  };
  const layerArea = { x: 0, y: 0, w: localImage.w, h: localImage.h };
  ctx.save();
  ctx.translate(area.x, area.y);

  drawSourceImage(area, localImage, mode);
  ctx.save();
  ctx.beginPath();
  ctx.rect(localImage.x, localImage.y, localImage.w, localImage.h);
  ctx.clip();
  ctx.translate(localImage.x, localImage.y);
  ctx.globalAlpha = modeOverlayAlpha(mode);
  if (mode !== "normal" && mode !== "ascii") {
    drawScanMap(layerArea, mode);
  }
  if (mode === "ascii") drawAsciiLayer(layerArea, contrast);
  ctx.restore();

  if (mode === "lines" || mode === "hybrid" || mode === "notation") {
    ctx.strokeStyle = mode === "notation" ? "rgba(99, 105, 98, 0.46)" : "rgba(92, 98, 91, 0.54)";
    ctx.lineWidth = lineW;
    state.events.forEach((event, index) => {
      if (mode === "scanlines" && index % 2 !== 0) return;
      if (mode !== "notation" && index % 3 !== 0 && event.edge < 0.35) return;
      const jitter = grindVisual * Math.sin(index * 8.31) * 5;
      const x = localImage.x + event.x * localImage.w + jitter;
      const y = localImage.y + event.y * localImage.h + grindVisual * Math.cos(index * 3.11) * 3;
      const length = (mode === "notation" ? 4 : 7) + event.edge * (mode === "notation" ? 18 : 24) * contrast;
      const angle = (event.angle || 0) + grindVisual * Math.sin(index) * 0.6;
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(angle) * length * 0.5, y - Math.sin(angle) * length * 0.5);
      ctx.lineTo(x + Math.cos(angle) * length * 0.5, y + Math.sin(angle) * length * 0.5);
      ctx.stroke();

      if (mode === "notation" && index % 5 === 0) {
        ctx.fillStyle = event.dark > 0.7 ? "rgba(92,98,91,0.52)" : "rgba(112,118,109,0.32)";
        ctx.fillRect(x - lineW, y - lineW, lineW * (1.5 + event.dark * 2.4), lineW * (1.5 + event.edge * 2.8));
      }

      if (mode === "notation" && grindVisual > 0.35 && index % 23 === 0) {
        ctx.fillStyle = `rgba(112,118,109,${0.14 + grindVisual * 0.22})`;
        ctx.fillRect(x - length, y + 4, length * (1.4 + grindVisual), 2 + grindVisual * 4);
      }
    });
  }

  if (mode === "hybrid" || mode === "notation") {
    const cell = Math.max(mode === "notation" ? 6 : 10, Math.floor(localImage.w / (mode === "notation" ? 170 : 112)));
    ctx.font = `${cell}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textBaseline = "middle";
    state.events.forEach((event, index) => {
      if (index % 2 && mode === "hybrid") return;
      if (mode === "notation" && index % 4) return;
      const x = localImage.x + event.x * localImage.w;
      const y = localImage.y + event.y * localImage.h;
      const power = Math.min(1, (event.edge + event.dark) * 0.65 * contrast);
      const glyph = glyphs[Math.min(glyphs.length - 1, Math.floor(power * glyphs.length))];
      ctx.fillStyle = mode === "notation" ? `rgba(102, 108, 100, ${0.12 + power * 0.34})` : `rgba(92, 98, 91, ${0.15 + power * 0.42})`;
      ctx.fillText(glyph, x, y);
    });
  }

  if (mode === "notation") {
    ctx.save();
    ctx.translate(localImage.x, localImage.y);
    drawMicroNotation(layerArea);
    ctx.restore();
  }

  drawArchiveWear(area);
  ctx.strokeStyle = "rgba(114, 121, 112, 0.22)";
  ctx.lineWidth = lineW;
  ctx.strokeRect(localImage.x, localImage.y, localImage.w, localImage.h);
  ctx.restore();
}

function modeOverlayAlpha(mode) {
  return {
    field: 0.72,
    colorTrace: 0.72,
    xray: 0.96,
    ascii: 0.9,
    normal: 0
  }[mode] ?? 0.64;
}

function drawSourceImage(area, imageRect, mode = "normal") {
  if (!state.image) return;
  const alpha = {
    normal: 0.9,
    field: 0.34,
    colorTrace: 0.54,
    xray: 0.12,
    ascii: 0.1
  }[mode] ?? 0.5;
  const filter = {
    normal: "grayscale(0.32) saturate(0.62) contrast(0.98) brightness(1.04)",
    xray: "grayscale(1) invert(0.28) contrast(0.78) brightness(1.18)",
    field: "grayscale(0.86) saturate(0.2) contrast(0.82) brightness(1.12)",
    ascii: "grayscale(1) saturate(0) contrast(0.74) brightness(1.2)"
  }[mode] ?? "grayscale(0.72) saturate(0.42) contrast(0.9) brightness(1.08)";
  ctx.save();
  ctx.fillStyle = "rgba(249, 250, 247, 0.5)";
  ctx.fillRect(0, 0, area.w, area.h);
  ctx.globalAlpha = alpha;
  ctx.filter = filter;
  ctx.drawImage(state.image, imageRect.x, imageRect.y, imageRect.w, imageRect.h);
  ctx.restore();
}

function drawScanMap(area, mode) {
  const { width, height } = state.imageData;
  const map = state.maps[mode] || state.maps.field || state.edges;
  const rowStep = Math.max(1, Math.floor(height / (mode === "xray" ? 190 : 230)));
  const colStep = Math.max(1, Math.floor(width / (mode === "xray" ? 260 : 500)));
  const lineW = Math.max(0.7, canvas.width / 1800);

  ctx.save();
  drawModePaper(area, mode);
  ctx.fillRect(0, 0, area.w, area.h);
  ctx.lineWidth = lineW;

  if (mode === "xray") {
    drawXrayMap(area, map, rowStep, colStep, lineW);
    drawScanNeedle(area);
    ctx.restore();
    return;
  }

  for (let y = 1; y < height - 1; y += rowStep) {
    let drawing = false;
    for (let x = 1; x < width - 1; x += colStep) {
      const i = y * width + x;
      const value = map[i] || 0;
      const px = (x / width) * area.w;
      const py = (y / height) * area.h;
      const active = value > visualThreshold(mode);

      if (active) {
        const alpha = Math.min(0.52, 0.055 + value * visualAlpha(mode));
        if (mode === "field") {
          drawAnalysisMarker(px, py, "field", alpha, 8 + value * 22, x * 0.11 + y);
          continue;
        }
        if (mode === "colorTrace") {
          const color = state.colors[i];
          ctx.fillStyle = color ? colorCss(color, alpha * 0.72) : `rgba(122, 127, 118, ${alpha})`;
          ctx.fillRect(px, py, Math.max(1, value * 5), Math.max(1, lineW * 1.4));
          continue;
        }
        ctx.strokeStyle = `rgba(102, 109, 101, ${alpha})`;
        if (!drawing) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          drawing = true;
        } else {
          const drift = mode === "xray" ? Math.sin(value * 18 + x * 0.03) * 2.2 : Math.sin((x + y) * 0.04) * 0.8;
          ctx.lineTo(px, py + drift);
        }
      } else if (drawing) {
        ctx.stroke();
        drawing = false;
      }
    }
    if (drawing) ctx.stroke();
  }

  if (mode === "field") {
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "rgba(116, 123, 114, 0.16)";
    const skip = Math.max(1, Math.floor(state.events.length / 360));
    state.events.forEach((event, index) => {
      if (index % skip) return;
      const size = 1 + (event.scanValue || 0) * 5;
      ctx.fillRect(event.x * area.w, event.y * area.h, size, Math.max(1, size * 0.45));
    });
    ctx.globalAlpha = 1;
  }

  drawScanNeedle(area);
  ctx.restore();
}

function drawXrayMap(area, map, rowStep, colStep, lineW) {
  const { width, height } = state.imageData;
  ctx.save();
  ctx.fillStyle = "rgba(224, 228, 224, 0.4)";
  ctx.fillRect(0, 0, area.w, area.h);
  ctx.strokeStyle = "rgba(76, 83, 78, 0.058)";
  ctx.lineWidth = Math.max(0.7, lineW);
  for (let y = 0; y <= area.h; y += Math.max(3, area.h / 120)) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(area.w, y);
    ctx.stroke();
  }

  ctx.lineWidth = Math.max(1, lineW * 1.15);
  for (let y = 1; y < height - 1; y += rowStep) {
    let drawing = false;
    for (let x = 1; x < width - 1; x += colStep) {
      const i = y * width + x;
      const value = map[i] || 0;
      const px = (x / width) * area.w;
      const py = (y / height) * area.h;
      if (value > visualThreshold("xray")) {
        const alpha = Math.min(0.5, 0.045 + value * 0.46);
        ctx.strokeStyle = `rgba(59, 66, 62, ${alpha})`;
        if (!drawing) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          drawing = true;
        } else {
          ctx.lineTo(px, py + Math.sin(value * 12 + y * 0.06) * 0.8);
        }
      } else if (drawing) {
        ctx.stroke();
        drawing = false;
      }
    }
    if (drawing) ctx.stroke();
  }

  const xrayEvents = state.layerEvents.xray || [];
  const skip = Math.max(1, Math.floor(xrayEvents.length / 220));
  ctx.fillStyle = "rgba(248, 250, 244, 0.24)";
  xrayEvents.forEach((event, index) => {
    if (index % skip) return;
    const x = event.x * area.w;
    const y = event.y * area.h;
    const size = 1 + (event.scanValue || 0) * 3.2;
    ctx.fillRect(x, Math.max(0, y - size), Math.max(1, lineW * 1.2), size * 2.4);
  });
  ctx.restore();
}

function drawModePaper(area, mode) {
  const fill = {
    field: "rgba(251, 252, 249, 0.38)",
    colorTrace: "rgba(249, 250, 247, 0.22)",
    xray: "rgba(214, 219, 216, 0.48)"
  }[mode] || "rgba(247, 248, 244, 0.16)";
  ctx.fillStyle = fill;
}

function drawAnalysisMarker(x, y, source, alpha = 0.16, size = 4, phase = 0) {
  ctx.save();
  ctx.lineWidth = 1;
  const pulse = 0.78 + Math.sin(phase * 0.13 + performance.now() * 0.002) * 0.22;
  const radius = Math.max(1, size * pulse);

  if (source === "contour") {
    ctx.strokeStyle = `rgba(82, 88, 83, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(2, radius), 0, Math.PI * 2);
    ctx.stroke();
  } else if (source === "shadow" || source === "low" || source === "sub") {
    ctx.fillStyle = `rgba(68, 74, 70, ${alpha * 0.55})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (source === "dust" || source === "grain") {
    ctx.strokeStyle = `rgba(70, 76, 72, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x, y + radius);
    ctx.stroke();
  } else if (source === "field" || source === "air" || source === "choir") {
    ctx.strokeStyle = `rgba(250, 250, 246, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.8, 0, Math.PI * 2);
    ctx.stroke();
  } else if (source === "xray") {
    ctx.strokeStyle = `rgba(72, 78, 74, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, y - radius * 3.2);
    ctx.lineTo(x, y + radius * 3.2);
    ctx.stroke();
  } else if (source === "colorTrace" || source === "color") {
    ctx.fillStyle = `rgba(116, 112, 91, ${alpha})`;
    ctx.fillRect(x - radius, y + radius * 0.8, radius * 2.4, Math.max(1, radius * 0.42));
  } else if (source === "object" || source === "dual") {
    ctx.strokeStyle = `rgba(82, 88, 83, ${alpha * 0.82})`;
    ctx.strokeRect(x - radius * 1.8, y - radius, radius * 3.6, radius * 2);
  } else {
    ctx.fillStyle = `rgba(250, 250, 246, ${alpha})`;
    ctx.fillRect(x, y, Math.max(1, radius), 1);
  }

  ctx.restore();
}

function drawFeatureGlyph(x, y, event, alpha = 0.16, scale = 1, phase = 0) {
  const source = event.scan || event.family || "contour";
  const strength = clamp01((event.scanValue || 0.5) * 0.62 + (event.edge || 0) * 0.2 + (event.dark || 0) * 0.18);
  const size = (2.2 + strength * 10) * scale;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.globalAlpha = clamp01(alpha);

  if (source === "contour" || source === "pluck" || source === "sine") {
    const angle = event.angle || phase * 0.01;
    ctx.strokeStyle = "rgba(72, 78, 74, 0.72)";
    ctx.beginPath();
    ctx.moveTo(x - Math.cos(angle) * size, y - Math.sin(angle) * size);
    ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
    ctx.stroke();
  } else if (source === "shadow" || source === "low" || source === "sub") {
    ctx.fillStyle = "rgba(62, 68, 64, 0.38)";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
    ctx.fill();
  } else if (source === "dust" || source === "grain") {
    ctx.fillStyle = "rgba(54, 60, 56, 0.56)";
    const px = Math.round(x) + 0.5;
    const py = Math.round(y) + 0.5;
    ctx.fillRect(px, py, Math.max(1, size * 0.28), 1);
    ctx.fillRect(px + size * 0.42, py + 2, 1, 1);
  } else if (source === "field" || source === "air" || source === "choir") {
    ctx.strokeStyle = "rgba(255, 255, 250, 0.76)";
    ctx.beginPath();
    ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 250, 0.1)";
    ctx.fillRect(x - size * 2.5, y - size, size * 5, size * 2);
  } else if (source === "xray" || source === "cluster") {
    ctx.strokeStyle = "rgba(58, 64, 60, 0.62)";
    ctx.beginPath();
    ctx.moveTo(x, y - size * 2.8);
    ctx.lineTo(x, y + size * 2.8);
    ctx.stroke();
  } else if (source === "colorTrace" || source === "color") {
    ctx.fillStyle = event.color ? colorCss(event.color, 0.58) : "rgba(116, 112, 91, 0.5)";
    ctx.fillRect(x - size, y + size * 0.6, size * 2.4, Math.max(1, size * 0.22));
  } else if (source === "object" || source === "dual") {
    ctx.strokeStyle = "rgba(70, 76, 72, 0.46)";
    ctx.strokeRect(x - size * 1.7, y - size, size * 3.4, size * 2);
  }

  ctx.restore();
}

function visualThreshold(mode) {
  return {
    field: 0.48,
    colorTrace: 0.2,
    xray: 0.68
  }[mode] ?? 0.32;
}

function visualAlpha(mode) {
  return {
    field: 0.12,
    colorTrace: 0.26,
    xray: 0.44
  }[mode] ?? 0.25;
}

function drawArchiveWear(area) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  for (let i = 0; i < 14; i += 1) {
    const x = ((Math.sin(i * 12.13) * 0.5 + 0.5) * area.w) | 0;
    const y = ((Math.cos(i * 7.91) * 0.5 + 0.5) * area.h) | 0;
    ctx.fillRect(x, y, 1 + (i % 3), 12 + (i % 9) * 5);
  }
  ctx.strokeStyle = "rgba(126, 133, 123, 0.035)";
  ctx.lineWidth = 1;
  for (let x = 0; x < area.w; x += Math.max(48, area.w / 20)) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + Math.sin(x * 0.02) * 4, area.h);
    ctx.stroke();
  }
  ctx.restore();
}

function drawContourMap(area) {
  const { width, height } = state.imageData;
  const edgeThreshold = Number(controls.edge.value) / 255;
  const contrast = Number(controls.contrast.value) / 6;
  const rowStep = Math.max(1, Math.floor(height / 260));
  const colStep = Math.max(1, Math.floor(width / 520));
  const lineW = Math.max(0.7, canvas.width / 1800);

  ctx.save();
  ctx.fillStyle = "rgba(247, 248, 244, 0.12)";
  ctx.fillRect(0, 0, area.w, area.h);

  ctx.strokeStyle = "rgba(35, 42, 39, 0.034)";
  ctx.lineWidth = 1;
  for (let y = 0; y <= area.h; y += Math.max(9, area.h / 58)) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(area.w, y + Math.sin(y * 0.035) * 1.4);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  for (let y = 2; y <= area.h; y += Math.max(18, area.h / 34)) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(area.w, y);
    ctx.stroke();
  }

  ctx.lineWidth = lineW;
  for (let y = 1; y < height - 1; y += rowStep) {
    let drawing = false;
    for (let x = 1; x < width - 1; x += colStep) {
      const i = y * width + x;
      const edge = state.edges[i] / 255;
      const dark = 1 - state.gray[i] / 255;
      const isLine = edge > Math.max(0.08, edgeThreshold * 0.52) || (dark > 0.68 && edge > 0.025);
      const px = (x / width) * area.w;
      const py = (y / height) * area.h;

      if (isLine) {
        const alpha = Math.min(0.32, 0.045 + edge * 0.42 + dark * 0.05);
        ctx.strokeStyle = `rgba(98, 105, 97, ${alpha})`;
        if (!drawing) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          drawing = true;
        } else {
          const drift = Math.sin((x + y) * 0.11) * contrast * 0.35;
          ctx.lineTo(px, py + drift);
        }
      } else if (drawing) {
        ctx.stroke();
        drawing = false;
      }
    }
    if (drawing) ctx.stroke();
  }

  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "rgba(98, 105, 97, 0.24)";
  const skip = Math.max(1, Math.floor(state.events.length / 520));
  state.events.forEach((event, index) => {
    if (index % skip !== 0) return;
    const strength = event.edge + event.dark * 0.45;
    if (strength < 0.45) return;
    const x = event.x * area.w;
    const y = event.y * area.h;
    const size = 0.7 + Math.min(2.5, strength * 2.1);
    ctx.fillRect(x, y, size * 2.4, Math.max(1, size * 0.32));
  });
  ctx.globalAlpha = 1;

  drawScanNeedle(area);
  ctx.restore();
}

function drawScanNeedle(area) {
  ctx.save();
  ctx.strokeStyle = "rgba(132, 119, 57, 0.24)";
  ctx.lineWidth = Math.max(0.8, canvas.width / 1300);
  const x = state.playhead * area.w;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x + Math.sin(x * 0.04) * 4, area.h);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 247, 174, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 3, 0);
  ctx.lineTo(x + 3 + Math.sin(x * 0.04) * 3, area.h);
  ctx.stroke();
  ctx.restore();
}

function drawColorTrace(area) {
  ctx.save();
  ctx.globalAlpha = 0.52;
  const events = state.layerEvents.colorTrace || [];
  const skip = Math.max(1, Math.floor(events.length / 900));
  events.forEach((event, index) => {
    if (index % skip !== 0 || !event.color || event.color.saturation < 0.12) return;
    const x = event.x * area.w;
    const y = event.y * area.h;
    const width = 1 + event.color.saturation * 4;
    ctx.fillStyle = colorCss(event.color);
    ctx.fillRect(x, y, width, Math.max(1, width * 0.42));
  });
  ctx.restore();
}

function drawAsciiLayer(area, contrast) {
  ctx.save();
  ctx.fillStyle = "rgba(250, 251, 248, 0.34)";
  ctx.fillRect(0, 0, area.w, area.h);
  const { width, height } = state.imageData;
  const dot = Math.max(1.05, Math.min(2.8, area.w / 310));
  const stepX = Math.max(3, Math.floor(width / 170));
  const stepY = Math.max(3, Math.floor(height / 170));
  const q = state.imageSignature?.gray || { q50: 0.5, q90: 0.9 };
  const edgeStats = state.imageSignature?.edge || { q75: 0.2 };

  for (let y = 1; y < height - 1; y += stepY) {
    for (let x = 1; x < width - 1; x += stepX) {
      const i = y * width + x;
      const gray = state.gray[i] / 255;
      const edge = state.edges[i] / 255;
      const dark = 1 - gray;
      const silhouette = clamp01((dark - (1 - q.q50) * 0.52) * 1.8);
      const line = clamp01((edge - edgeStats.q75 * 0.58) * 3.8);
      const value = clamp01(silhouette * 0.72 + line * 0.58);
      if (value < 0.16) continue;
      const px = (x / width) * area.w;
      const py = (y / height) * area.h;
      const radius = dot * (0.45 + value * 0.58) * contrast;
      ctx.fillStyle = `rgba(42, 47, 44, ${0.1 + value * 0.42})`;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawGrayscaleScan(area, segmented) {
  const { width, height } = state.imageData;
  const contrast = Number(controls.contrast.value) / 6;
  const density = Number(controls.density.value);
  const screenRowStep = segmented ? Math.max(2, 6 - Math.floor(density / 3)) : Math.max(1, area.h / height);
  const sourceRowStep = Math.max(1, Math.floor((screenRowStep / area.h) * height));
  const colStep = segmented ? Math.max(1, Math.floor(width / 620)) : Math.max(1, Math.floor(width / 260));
  const lineHeight = segmented ? Math.max(1, Math.min(2.4, screenRowStep * 0.58)) : Math.max(1, area.h / height);

  ctx.save();
  ctx.fillStyle = "#d4d9d7";
  ctx.fillRect(0, 0, area.w, area.h);

  for (let y = 0; y < height; y += sourceRowStep) {
    const yy = (y / height) * area.h;
    if (segmented) {
      const rowPhase = Math.sin(y * 12.9898) * 0.5 + 0.5;
      for (let x = 0; x < width; x += colStep) {
        const sample = scanSample(x, y, colStep, sourceRowStep);
        const dark = Math.max(0, Math.min(1, sample.dark * contrast * 1.15 + sample.edge * 0.52));
        const dither = Math.sin((x + 17) * 0.173 + y * 0.619) * 0.5 + 0.5;
        if (dark < 0.12 && dither > dark * 3.2) continue;
        const xx = (x / width) * area.w;
        const cellW = Math.max(1, (colStep / width) * area.w);
        const taper = 0.42 + dark * 1.35 + sample.edge * 0.52;
        const broken = dark < 0.42 ? 0.46 + dither * 0.54 : 0.88 + rowPhase * 0.16;
        const segW = Math.min(cellW * 1.85, Math.max(1, cellW * taper * broken));
        const alpha = Math.min(0.96, 0.1 + dark * 0.78 + sample.edge * 0.22);
        ctx.fillStyle = `rgba(92, 99, 93, ${Math.min(0.62, alpha)})`;
        ctx.fillRect(xx, yy, segW, lineHeight);

        if (sample.edge > 0.42 && dark > 0.24) {
          ctx.fillStyle = `rgba(92, 99, 93, ${Math.min(0.46, sample.edge * 0.38)})`;
          ctx.fillRect(xx, yy + lineHeight + 1, Math.max(1, segW * 0.74), Math.max(1, lineHeight * 0.72));
        }
      }
    } else {
      const gradient = ctx.createLinearGradient(0, yy, area.w, yy);
      for (let stop = 0; stop <= 1; stop += 0.08) {
        const sampleX = Math.min(width - 1, Math.floor(stop * width));
        const gray = state.gray[y * width + sampleX];
        const value = Math.max(0, Math.min(255, gray));
        gradient.addColorStop(stop, `rgb(${value}, ${value}, ${value})`);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, yy, area.w, Math.max(1, lineHeight));
    }
  }

  ctx.globalAlpha = segmented ? 0.5 : 0.34;
  ctx.strokeStyle = "rgba(105, 112, 104, 0.32)";
  ctx.lineWidth = 1;
  for (let y = 0; y <= area.h; y += segmented ? screenRowStep : Math.max(6, area.h / 44)) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(area.w, y);
    ctx.stroke();
  }
  ctx.restore();
}

function scanSample(x, y, w, h) {
  const { width, height } = state.imageData;
  let gray = 0;
  let edge = 0;
  let count = 0;
  const maxX = Math.min(width - 1, x + w);
  const maxY = Math.min(height - 1, y + h);
  const sx = Math.max(1, Math.floor(w / 2));
  const sy = Math.max(1, Math.floor(h / 2));

  for (let yy = y; yy <= maxY; yy += sy) {
    for (let xx = x; xx <= maxX; xx += sx) {
      const i = yy * width + xx;
      gray += state.gray[i];
      edge += state.edges[i];
      count += 1;
    }
  }

  const averageGray = count ? gray / count : 255;
  const averageEdge = count ? edge / count : 0;
  return {
    dark: 1 - averageGray / 255,
    edge: averageEdge / 255
  };
}

function drawAxisLabels(area) {
  ctx.save();
  ctx.fillStyle = "rgba(18, 21, 20, 0.58)";
  ctx.font = `${Math.max(12, canvas.width / 95)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.textBaseline = "top";
  ctx.fillText("x: time", 12, area.h - 26);
  ctx.save();
  ctx.translate(12, area.h - 42);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("y: pitch / frequency", 0, 0);
  ctx.restore();
  ctx.restore();
}

function drawMicroNotation(area) {
  ctx.save();
  ctx.strokeStyle = "rgba(112, 119, 110, 0.22)";
  ctx.fillStyle = "rgba(132, 119, 57, 0.24)";
  ctx.lineWidth = Math.max(1, canvas.width / 1500);
  const lanes = meters[controls.meter.value] || meters["5-8"];
  let cursor = 0;
  const total = lanes.reduce((sum, beat) => sum + beat, 0);
  lanes.forEach((beat, index) => {
    const x = (cursor / total) * area.w;
    const next = ((cursor + beat) / total) * area.w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + Math.sin(index) * 8, area.h);
    ctx.stroke();
    if (index % 2 === 0) ctx.fillRect(x + 4, 8, Math.max(2, next - x - 8), 4);
    cursor += beat;
  });

  state.events.forEach((event, index) => {
    if (index % 17 !== 0) return;
    const x = event.x * area.w;
    const y = event.y * area.h;
    ctx.strokeStyle = event.dark > 0.55 ? "rgba(105, 112, 104, 0.28)" : "rgba(132, 119, 57, 0.22)";
    ctx.beginPath();
    ctx.arc(x, y, 4 + event.edge * 10, 0, Math.PI * (1.1 + event.dark));
    ctx.stroke();
  });
  ctx.restore();
}

function drawPlayhead(area) {
  if (!state.isPlaying) return;
  const x = area.x + state.playhead * area.w;
  const gradient = ctx.createLinearGradient(x - 24, 0, x + 24, 0);
  gradient.addColorStop(0, "rgba(154, 139, 73, 0)");
  gradient.addColorStop(0.5, "rgba(176, 162, 92, 0.28)");
  gradient.addColorStop(1, "rgba(154, 139, 73, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x - 24, area.y, 48, area.h);
  ctx.strokeStyle = "rgba(136, 122, 67, 0.48)";
  ctx.lineWidth = Math.max(1, canvas.width / 900);
  ctx.beginPath();
  ctx.moveTo(x, area.y);
  ctx.lineTo(x, area.y + area.h);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 255, 250, 0.18)";
  ctx.beginPath();
  ctx.moveTo(x + 3, area.y);
  ctx.lineTo(x + 3, area.y + area.h);
  ctx.stroke();

  if (controls.trace.checked) {
    ctx.fillStyle = "rgba(126, 133, 123, 0.045)";
    ctx.fillRect(area.x, area.y, state.playhead * area.w, area.h);
  }
}

function drawEventField(area) {
  if (!state.events.length) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();
  const scanX = state.playhead;
  const scanBand = state.isPlaying ? 0.018 : 0;
  const readEvents = eventsInWindow(Math.max(0, scanX - 0.026), Math.min(1, scanX + 0.026), 90);
  const ambientEvents = state.isPlaying ? readEvents : state.events;
  const skip = Math.max(1, Math.floor(ambientEvents.length / (state.isPlaying ? 90 : 900)));
  ambientEvents.forEach((event, index) => {
    if (index % skip) return;
    const x = area.x + event.x * area.w;
    const y = area.y + event.y * area.h;
    const distance = Math.abs(event.x - scanX);
    const nearScan = state.isPlaying ? Math.max(0, 1 - distance * 62) : 0;
    const inReadZone = state.isPlaying && distance <= scanBand;
    const frequencyAlpha = (inReadZone ? 0.24 : 0.06) + event.edge * 0.05 + nearScan * 0.2;
    drawFeatureGlyph(x, y, event, frequencyAlpha, inReadZone ? 1.4 : 0.72, index);
    if (nearScan > 0.04) {
      ctx.strokeStyle = `rgba(142, 146, 137, ${nearScan * 0.24})`;
      ctx.beginPath();
      ctx.moveTo(area.x + scanX * area.w, y);
      ctx.lineTo(x + 22 + event.edge * 14, y);
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawTriggers(area) {
  if (!controls.marks.checked || !state.triggers.length) return;
  const now = performance.now();
  state.triggers = state.triggers.filter((trigger) => now - trigger.created < trigger.life);
  state.triggers.forEach((trigger) => {
    const age = (now - trigger.created) / trigger.life;
    const alpha = Math.max(0, 1 - age);
    const x = area.x + trigger.x * area.w;
    const y = area.y + trigger.y * area.h;
    const source = trigger.scan || trigger.family || "contour";
    const radius = trigger.radius * (1 + age * (source === "shadow" || source === "low" ? 3.2 : 2.0));
    ctx.save();
    ctx.beginPath();
    ctx.rect(area.x, area.y, area.w, area.h);
    ctx.clip();
    ctx.strokeStyle = `rgba(124, 129, 121, ${alpha * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(area.x + state.playhead * area.w, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    drawFeatureGlyph(x, y, trigger, alpha * 0.42, 1 + age, age * 37);
    ctx.restore();
  });
}

function recordTrigger(event, family, power = 0.5) {
  if (!event) return;
  state.triggers.push({
    x: clamp01(event.x),
    y: clamp01(event.y),
    scan: event.scan,
    family,
    radius: 2.4 + power * 7,
    edge: event.edge,
    dark: event.dark,
    scanValue: event.scanValue,
    angle: event.angle,
    color: event.color,
    life: 360 + power * 360,
    created: performance.now()
  });
  if (state.triggers.length > 72) state.triggers.splice(0, state.triggers.length - 72);
}

function isMobileAudioDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent));
}

function applyAudioPerformanceProfile() {
  state.mobileMode = isMobileAudioDevice();
  state.maxVoices = state.mobileMode ? 24 : 58;
  state.frameEventCap = state.mobileMode ? 3 : 6;
}

async function ensureAudio() {
  applyAudioPerformanceProfile();
  if (state.audio?.state === "closed") {
    state.audio = null;
    state.audioUnlocked = false;
  }
  if (state.audio) {
    if (state.audio.state === "suspended") {
      await state.audio.resume();
    }
    state.audioState = state.audio.state;
    updateReadouts();
    return state.audio.state === "running";
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audio = new AudioContext();
  const master = audio.createGain();
  const granularBus = audio.createGain();
  const compressor = audio.createDynamicsCompressor();
  const spatial = createSpatialResonance(audio, master);

  master.gain.value = 0.72;
  granularBus.gain.value = controls.granularMute.checked ? 0 : 1;

  granularBus.connect(master);
  granularBus.connect(spatial.input);
  granularBus.connect(spatial.lateInput);
  master.connect(compressor).connect(audio.destination);

  state.audio = audio;
  state.master = master;
  state.granularBus = granularBus;
  state.spatial = spatial;
  state.delay = spatial.earlyInput;
  state.delayGain = spatial.earlyReturn;
  state.feedbackGain = spatial.memory;
  state.reverb = spatial.lateInput;
  state.reverbGain = spatial.lateReturn;
  state.noiseBuffer = makeNoiseBuffer(audio);
  updateEffects();
  if (audio.state === "suspended") await audio.resume();
  state.audioState = audio.state;
  updateReadouts();
  return audio.state === "running";
}

function playSilentUnlockPulse() {
  if (!state.audio || state.audioUnlocked) return;
  const audio = state.audio;
  const buffer = audio.createBuffer(1, Math.max(1, Math.floor(audio.sampleRate * 0.012)), audio.sampleRate);
  const source = audio.createBufferSource();
  const gain = audio.createGain();
  gain.gain.value = 0.00001;
  source.buffer = buffer;
  source.connect(gain).connect(audio.destination);
  source.start(0);
  source.stop(audio.currentTime + 0.018);
  state.audioUnlocked = true;
}

async function unlockAudioFromGesture() {
  const running = await ensureAudio();
  if (state.audio?.state === "suspended") {
    await state.audio.resume();
  }
  playSilentUnlockPulse();
  state.audioState = state.audio?.state || "none";
  updateReadouts();
  return running || state.audioState === "running";
}

function createSpatialResonance(audio, master) {
  const input = audio.createGain();
  const earlyInput = audio.createGain();
  const lateInput = audio.createGain();
  const earlyReturn = audio.createGain();
  const lateReturn = audio.createGain();
  const memory = audio.createGain();
  const air = audio.createBiquadFilter();
  const floor = audio.createBiquadFilter();
  const preDiffuse = audio.createDelay(0.16);
  const preScatter = audio.createDelay(0.21);
  const preGainA = audio.createGain();
  const preGainB = audio.createGain();

  input.gain.value = 0.8;
  earlyInput.gain.value = 0.36;
  lateInput.gain.value = 0.52;
  earlyReturn.gain.value = 0.18;
  lateReturn.gain.value = 0.24;
  memory.gain.value = 0.2;
  air.type = "lowpass";
  air.frequency.value = 6200;
  air.Q.value = 0.4;
  floor.type = "highpass";
  floor.frequency.value = 70;
  floor.Q.value = 0.4;
  preDiffuse.delayTime.value = 0.031;
  preScatter.delayTime.value = 0.057;
  preGainA.gain.value = 0.52;
  preGainB.gain.value = 0.34;

  input.connect(earlyInput);
  input.connect(lateInput);
  lateInput.connect(preDiffuse).connect(preGainA);
  lateInput.connect(preScatter).connect(preGainB);

  const earlyTaps = [0.017, 0.031, 0.049, 0.073].map((time, index) => {
    const delay = audio.createDelay(0.18);
    const gain = audio.createGain();
    const pan = audio.createStereoPanner();
    delay.delayTime.value = time;
    gain.gain.value = 0.08;
    pan.pan.value = [-0.62, 0.38, -0.18, 0.72][index];
    earlyInput.connect(delay).connect(gain).connect(pan).connect(earlyReturn);
    return { delay, gain, pan };
  });
  earlyReturn.connect(master);

  const baseTimes = [0.083, 0.113, 0.149, 0.191, 0.229, 0.271];
  const lines = baseTimes.map((time, index) => {
    const lineInput = audio.createGain();
    const delay = audio.createDelay(0.9);
    const damp = audio.createBiquadFilter();
    const body = audio.createBiquadFilter();
    const pan = audio.createStereoPanner();
    const out = audio.createGain();
    lineInput.gain.value = 0.42;
    delay.delayTime.value = time;
    damp.type = "lowpass";
    damp.frequency.value = 4200 - index * 260;
    damp.Q.value = 0.5;
    body.type = "bandpass";
    body.frequency.value = 240 + index * 210;
    body.Q.value = 0.9;
    pan.pan.value = [-0.72, 0.58, -0.34, 0.28, -0.08, 0.82][index];
    out.gain.value = 0.06;
    lineInput.connect(delay).connect(damp).connect(body).connect(pan).connect(out).connect(lateReturn);
    preGainA.connect(lineInput);
    if (index % 2 === 0) preGainB.connect(lineInput);
    return { input: lineInput, delay, damp, body, pan, out, baseTime: time };
  });

  lines.forEach((source, sourceIndex) => {
    lines.forEach((target, targetIndex) => {
      if (sourceIndex === targetIndex) return;
      const cross = audio.createGain();
      cross.gain.value = ((sourceIndex + targetIndex) % 2 === 0 ? -0.018 : 0.022);
      source.body.connect(cross).connect(target.input);
      source.cross = source.cross || [];
      source.cross.push(cross);
    });
  });

  lateReturn.connect(memory).connect(air).connect(floor).connect(master);

  return {
    input,
    earlyInput,
    lateInput,
    earlyReturn,
    lateReturn,
    memory,
    air,
    floor,
    earlyTaps,
    lines
  };
}

function checkAudioHealth() {
  if (!state.audio) return;
  const now = performance.now();
  if (now - state.lastAudioCheck < 900) return;
  state.lastAudioCheck = now;
  if (state.audio.state === "suspended") {
    state.audio.resume().catch(() => {});
  }
  state.audioState = state.audio.state;
  updateReadouts();
}

function canStartVoice() {
  return state.activeVoices < state.maxVoices;
}

function registerVoice(durationSeconds) {
  state.activeVoices += 1;
  window.setTimeout(() => {
    state.activeVoices = Math.max(0, state.activeVoices - 1);
  }, Math.max(80, Math.min(14000, durationSeconds * 1000 + 180)));
}

function cleanupNodes(nodes, delaySeconds) {
  window.setTimeout(() => {
    nodes.forEach((node) => {
      try {
        node.disconnect();
      } catch (error) {
        // Already disconnected or stopped.
      }
    });
  }, Math.max(80, delaySeconds * 1000 + 160));
}

function makeImpulse(audio) {
  const length = audio.sampleRate * 1.8;
  const impulse = audio.createBuffer(2, length, audio.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.2;
    }
  }
  return impulse;
}

function makeNoiseBuffer(audio) {
  const length = audio.sampleRate * 0.35;
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

async function togglePlay() {
  if (state.isPlaying) {
    stop();
    return;
  }
  if (!state.imageData) {
    fileInput.click();
    return;
  }
  const unlocked = await unlockAudioFromGesture();
  if (!unlocked || state.audio?.state !== "running") {
    state.audioState = state.audio?.state || "none";
    updateReadouts();
    return;
  }
  state.isPlaying = true;
  const timelinePosition = controls.reverse.checked ? 1 - state.playhead : state.playhead;
  state.startTime = performance.now() - timelinePosition * durationMs();
  state.lastColumn = -1;
  state.lastGranularStep = -1;
  playButton.textContent = "stop";
  playButton.classList.add("is-playing");
  animate();
}

function stop() {
  state.isPlaying = false;
  playButton.textContent = "play";
  playButton.classList.remove("is-playing");
  cancelAnimationFrame(state.animation);
  render();
}

function durationMs() {
  const pattern = meters[controls.meter.value] || meters["5-8"];
  const cycleBeats = pattern.reduce((sum, beat) => sum + beat, 0);
  return (60 / Number(controls.bpm.value)) * cycleBeats * Number(controls.loopBars.value) * 1000;
}

function animate() {
  if (!state.isPlaying) return;
  try {
    checkAudioHealth();
    const elapsed = performance.now() - state.startTime;
    let progress = elapsed / durationMs();
    if (progress >= 1) {
      if (controls.loop.checked) {
        state.startTime = performance.now();
        state.lastColumn = -1;
        state.lastGranularStep = -1;
        progress = 0;
      } else {
        state.playhead = controls.reverse.checked ? 0 : 1;
        stop();
        return;
      }
    }

    const warped = rhythmProgress(progress);
    state.playhead = controls.reverse.checked ? 1 - warped : warped;
    triggerColumn(progress, state.playhead);
    render();
  } catch (error) {
    state.recoveredErrors += 1;
    console.error(error);
    readouts.perform.textContent = `recovered ${state.recoveredErrors}`;
  } finally {
    if (state.isPlaying) state.animation = requestAnimationFrame(animate);
  }
}

function rhythmProgress(progress) {
  const swing = Number(controls.swing.value) / 100;
  const pattern = meters[controls.meter.value] || meters["5-8"];
  const total = pattern.reduce((sum, beat) => sum + beat, 0);
  const phrase = progress * total * Number(controls.loopBars.value);
  const cycle = phrase % total;
  let cursor = 0;
  let segmentIndex = 0;
  for (let i = 0; i < pattern.length; i += 1) {
    if (cycle >= cursor && cycle < cursor + pattern[i]) {
      segmentIndex = i;
      break;
    }
    cursor += pattern[i];
  }
  const local = (cycle - cursor) / pattern[segmentIndex];
  const crooked = local + Math.sin(local * Math.PI * 2 + segmentIndex * 1.7) * 0.055 * swing;
  const phraseProgress = (Math.floor(phrase / total) * total + cursor + Math.max(0, Math.min(1, crooked)) * pattern[segmentIndex]) / (total * Number(controls.loopBars.value));
  return Math.max(0, Math.min(1, phraseProgress));
}

function triggerColumn(timelineProgress, scanProgress) {
  if (!state.events.length || !state.audio) return;
  if (state.audio.state !== "running") {
    state.audioState = state.audio.state;
    updateReadouts();
    return;
  }
  if (state.activeVoices > state.maxVoices * 0.88) return;
  const grain = Number(controls.grain.value);
  const bars = Number(controls.loopBars.value);
  const totalSteps = Math.max(16, Math.floor(bars * grain * 4));
  const stepIndex = Math.min(totalSteps - 1, Math.floor(timelineProgress * totalSteps));
  if (stepIndex === state.lastColumn) return;
  state.lastColumn = stepIndex;

  const scanX = Math.max(0, Math.min(0.999, scanProgress));
  const windowSize = Math.max(0.008, 1 / (grain * 3.2));
  const left = Math.max(0, scanX - windowSize);
  const right = Math.min(1, scanX + windowSize);
  const metric = state.imageMetrics;
  const capacity = Math.max(0, state.maxVoices - state.activeVoices);
  const requestedVoices = Number(controls.voices.value);
  const voiceBudget = capacity < 10 ? 1 : capacity < 22 ? 2 : Math.min(requestedVoices, state.frameEventCap);
  const voiceCount = Math.max(1, Math.min(voiceBudget, Math.round(requestedVoices * (0.24 + metric.density * 0.18 + metric.atmosphere * 0.18))));
  const layer = layerForStep(stepIndex);
  const layerCandidates = eventsInLayerWindow(layer, left, right, voiceCount + 1);
  const candidates = eventsInWindow(left, right, voiceCount);
  const activeCandidates = layerCandidates.length
    ? layerCandidates
    : candidates.length
      ? candidates
      : metric.emptiness < 0.68 || stepIndex % 7 === 0
        ? nearestEvents(scanX, voiceCount)
        : [];
  triggerGranular(stepIndex, left, right, scanX, activeCandidates);
  triggerLayerFamilies(stepIndex, left, right, scanX);

  let played = false;
  activeCandidates.slice(0, state.frameEventCap).forEach((event, index) => {
    if (!canStartVoice()) return;
    if (Math.random() * 100 > Number(controls.chance.value)) return;
    const stutter = Number(controls.stutter.value) / 100 * (0.25 + metric.complexity * 0.5);
    const stagger = index * (0.022 + metric.distance * 0.018 + stutter * 0.008);
    const offGrid = Math.sin((state.lastColumn + index) * 1.17 + event.y * 5) * stutter * 0.014;
    const offset = Math.max(0, stagger + offGrid);
    played = playEvent(event, state.audio.currentTime + offset) || played;
    if (stutter > 0.55 && event.edge + event.dark > 0.92 && index % 3 === 0) {
      if (canStartVoice()) {
        playEvent({ ...event, y: Math.max(0, event.y - 0.035), edge: event.edge * 0.8 }, state.audio.currentTime + offset + 0.055);
      }
    }
  });

  if (!played && activeCandidates[0] && canStartVoice()) {
    playEvent(activeCandidates[0], state.audio.currentTime);
  }
}

function layerForStep(stepIndex) {
  const mode = controls.viewMode.value;
  const scan = analysisScan(mode);
  if (scan !== "auto") return scan;
  const weights = layerWeights();
  const total = weights.reduce((sum, item) => sum + item.weight, 0) || 1;
  let cursor = seededWave(stepIndex * 0.917 + state.imageMetrics.complexity * 11.3) * total;
  for (const item of weights) {
    cursor -= item.weight;
    if (cursor <= 0) return item.layer;
  }
  return state.activeLayer || "contour";
}

function layerWeights() {
  const metric = state.imageMetrics;
  const stats = state.layerStats || {};
  const colorStrength = Object.entries(state.colorProfile || {}).reduce((sum, [key, value]) => key === "neutral" ? sum : sum + value, 0);
  return [
    { layer: "field", weight: 0.04 + metric.emptiness * 2.9 + metric.overexposure * 1.8 },
    { layer: "colorTrace", weight: 0.02 + (stats.colorTrace?.average || 0) * 4.8 + colorStrength * 0.00012 },
    { layer: "xray", weight: 0.02 + (stats.xray?.peak || 0) * 1.4 + (stats.xray?.coverage || 0) * 0.62 + metric.softness * 0.22 }
  ]
    .filter((item) => (state.layerEvents[item.layer] || []).length)
    .sort((a, b) => b.weight - a.weight);
}

function eventsInWindow(left, right, count) {
  const start = lowerBoundEventX(left);
  const end = lowerBoundEventX(right);
  return strongestEvents(start, end, count);
}

function strongestEvents(start, end, count) {
  const strongest = [];
  let weakestIndex = -1;
  let weakestScore = Infinity;

  for (let i = start; i < end; i += 1) {
    const event = state.events[i];
    const score = featureScore(event);
    if (strongest.length < count) {
      strongest.push(event);
      if (score < weakestScore) {
        weakestScore = score;
        weakestIndex = strongest.length - 1;
      }
      continue;
    }
    if (score <= weakestScore) continue;
    strongest[weakestIndex] = event;
    weakestScore = Infinity;
    strongest.forEach((candidate, index) => {
      const candidateScore = featureScore(candidate);
      if (candidateScore < weakestScore) {
        weakestScore = candidateScore;
        weakestIndex = index;
      }
    });
  }

  return strongest.sort((a, b) => featureScore(b) - featureScore(a));
}

function lowerBoundEventX(value) {
  let low = 0;
  let high = state.events.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (state.events[mid].x < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

function nearestEvents(scanX, count) {
  const pivot = lowerBoundEventX(scanX);
  const nearest = [];
  let left = pivot - 1;
  let right = pivot;

  while (nearest.length < count && (left >= 0 || right < state.events.length)) {
    const leftDistance = left >= 0 ? Math.abs(state.events[left].x - scanX) : Infinity;
    const rightDistance = right < state.events.length ? Math.abs(state.events[right].x - scanX) : Infinity;
    if (leftDistance <= rightDistance) {
      nearest.push(state.events[left]);
      left -= 1;
    } else {
      nearest.push(state.events[right]);
      right += 1;
    }
  }

  return nearest.sort((a, b) => featureScore(b) - featureScore(a));
}

function eventsInLayerWindow(layer, left, right, count) {
  const events = state.layerEvents[layer] || [];
  if (!events.length) return [];
  const start = lowerBoundInEvents(events, left);
  const end = lowerBoundInEvents(events, right);
  return strongestFromEvents(events, start, end, count);
}

function lowerBoundInEvents(events, value) {
  let low = 0;
  let high = events.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (events[mid].x < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

function strongestFromEvents(events, start, end, count) {
  return events
    .slice(start, end)
    .sort((a, b) => featureScore(b) - featureScore(a))
    .slice(0, count);
}

function featureScore(event) {
  return (event.sourceStrength || 0) * 0.82
    + (event.scanValue || 0) * 0.52
    + (event.tonalRarity || 0) * 0.24
    + (event.localContrast || 0) * 0.22
    + event.edge * 0.18
    + event.dark * 0.12
    + (event.soft || 0) * 0.1;
}

function triggerGranular(stepIndex, left, right, scanX, fallbackEvents) {
  if (!controls.granular.checked || controls.granularMute.checked || controls.synthMute.checked || !state.audio) return;
  if (stepIndex === state.lastGranularStep || state.activeVoices > state.maxVoices * 0.82) return;
  const metric = state.imageMetrics;
  const level = Number(controls.granularLevel.value) / 100;
  if (level <= 0) return;
  const density = Math.max(1, Math.min(Number(controls.granularDensity.value), state.mobileMode ? 2 : 6));
  const fieldEvents = eventsInLayerWindow("field", left, right, 1);
  const colorEvents = eventsInLayerWindow("colorTrace", left, right, Math.max(1, density));
  const xrayEvents = eventsInLayerWindow("xray", left, right, Math.max(1, Math.ceil(density * 0.5)));
  const sources = [...colorEvents, ...xrayEvents, ...fieldEvents, ...fallbackEvents];
  const source = sources[stepIndex % Math.max(1, sources.length)] || nearestEvents(scanX, 1)[0];
  if (!source) return;

  const imageChance = clamp01(metric.complexity * 0.28 + metric.density * 0.22 + (source.scanValue || 0) * 0.28 + source.edge * 0.2);
  const erosion = Number(controls.chance.value) / 70;
  const grainChance = clamp01(0.22 + imageChance * 0.58 + level * 0.24 + erosion * 0.16);
  if (seededWave(stepIndex * 19.7 + source.x * 41) > grainChance) return;

  state.lastGranularStep = stepIndex;
  const count = Math.min(density, state.mobileMode ? 2 : 6, Math.max(1, state.maxVoices - state.activeVoices));
  for (let i = 0; i < count; i += 1) {
    const event = sources[(stepIndex + i * 3) % Math.max(1, sources.length)] || source;
    if (!event || !canStartVoice()) break;
    playGranularGrain(event, state.audio.currentTime + 0.01 + i * (0.012 + metric.distance * 0.012), stepIndex + i * 13);
  }
}

function triggerLayerFamilies(stepIndex, left, right, scanX) {
  if (!state.audio || state.activeVoices > state.maxVoices * 0.78) return;
  const time = state.audio.currentTime;
  const weights = layerWeights().slice(0, 4);
  let anyLocal = false;

  weights.forEach((weighted, index) => {
    if (!canStartVoice()) return;
    const cadence = 2 + index + Math.round((1 - Math.min(1, weighted.weight / 5)) * 2);
    if (stepIndex % cadence !== 0) return;
    if (weighted.layer === "colorTrace" && !controls.colorMap.checked) return;
    const event = eventsInLayerWindow(weighted.layer, left, right, index === 0 ? 2 : 1)[0];
    if (!event) return;
    anyLocal = true;
    playEvent({ ...event, soundFamily: soundFamilyForLayer(weighted.layer) }, time + 0.006 + index * 0.014);
  });

  if (!anyLocal && state.imageMetrics.emptiness < 0.38 && stepIndex % 9 === 0) {
    const near = nearestEvents(scanX, 1)[0];
    if (near && canStartVoice()) {
      playEvent({ ...near, soundFamily: soundFamilyForLayer(near.scan) }, time);
    }
  }
}

function soundFamilyForLayer(layer) {
  const table = {
    field: "air",
    colorTrace: "color",
    xray: "air"
  };
  return table[layer] || "fallback";
}

function playGranularGrain(event, time, seed) {
  if (!canStartVoice()) return false;
  const audio = state.audio;
  const metric = state.imageMetrics;
  const level = Number(controls.granularLevel.value) / 100;
  const size = Number(controls.granularSize.value);
  const spray = Number(controls.granularSpray.value) / 100;
  const pitchShift = Number(controls.granularPitch.value);
  const power = clamp01((event.scanValue || 0) * 0.46 + event.edge * 0.26 + event.dark * 0.12 + (event.soft || 0) * 0.2 + metric.complexity * 0.14);
  const duration = Math.max(0.018, Math.min(0.34, size / 1000 * (0.48 + power * 0.92 + metric.softness * 0.28)));
  const pitchInfo = frequencyForEvent(event, time);
  const pitch = Math.max(34, pitchInfo.frequency * 2 ** (pitchShift / 12));
  const detune = (seededWave(seed * 7.1 + event.x * 13) - 0.5) * (12 + spray * 64 + metric.complexity * 22);
  const reverseBias = seededWave(seed + event.y * 31) < spray * 0.24;

  registerVoice(duration);
  const osc = audio.createOscillator();
  const toneGain = audio.createGain();
  const noise = audio.createBufferSource();
  const noiseFilter = audio.createBiquadFilter();
  const noiseGain = audio.createGain();
  const filter = audio.createBiquadFilter();
  const pan = audio.createStereoPanner();
  const gain = audio.createGain();
  const nodes = [osc, toneGain, noise, noiseFilter, noiseGain, filter, pan, gain];

  osc.type = event.scan === "dust" || event.scan === "grain" ? "triangle" : "sine";
  osc.frequency.setValueAtTime(pitch * (reverseBias ? 1.5 : 1), time);
  osc.frequency.exponentialRampToValueAtTime(Math.max(24, pitch * (1 + (event.edge - 0.5) * spray * 0.18)), time + duration * 0.86);
  osc.detune.setValueAtTime(detune + pitchInfo.cents * 0.4, time);
  toneGain.gain.setValueAtTime(0.62 + power * 0.38, time);

  noise.buffer = state.noiseBuffer;
  noise.loop = true;
  noise.playbackRate.setValueAtTime(0.32 + event.edge * 2.2 + spray * 1.6, time);
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(420 + event.y * 5200 + power * 2400, time);
  noiseFilter.Q.setValueAtTime(4 + event.edge * 10 + spray * 8, time);
  noiseGain.gain.setValueAtTime((0.006 + event.edge * 0.018) * level * (0.34 + spray), time);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(Math.min(9800, 160 + pitch * (1.4 + event.dark * 3.2)), time);
  filter.Q.setValueAtTime(1.2 + Number(controls.resonance.value) * 0.12 + power * 5.2, time);
  pan.pan.setValueAtTime((event.x * 2 - 1) * (0.42 + spray * 0.5), time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime((0.012 + power * 0.04) * level, time + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(toneGain).connect(filter);
  noise.connect(noiseFilter).connect(noiseGain).connect(filter);
  filter.connect(pan).connect(gain);
  gain.connect(state.granularBus || state.master);

  recordTrigger(event, event.scan === "dust" ? "dust" : "grain", power);

  osc.start(time);
  noise.start(time + (reverseBias ? duration * 0.18 : 0));
  osc.stop(time + duration + 0.02);
  noise.stop(time + duration + 0.02);
  cleanupNodes(nodes, duration + 0.1);
  return true;
}

function voiceForEvent(event) {
  if (controls.voice.value === "sample") return state.sample ? "sample" : "sine";
  if (controls.voice.value !== "auto") return controls.voice.value;
  if (!controls.colorMap.checked || !event.color) {
    if (state.imageMetrics.atmosphere > 0.62) return "choir";
    if (state.imageMetrics.complexity > 0.52) return "cluster";
    return "sine";
  }
  const byColor = {
    red: "reed",
    yellow: "bell",
    green: "triangle",
    cyan: "cluster",
    blue: "fm",
    purple: "dual",
    neutral: "sine"
  };
  return byColor[event.color.family] || "sine";
}

function timbreForEvent(event) {
  if (!controls.colorMap.checked || !event.color) {
    return { amp: 1, cutoff: 1, resonance: 0, detune: 0, fmRatio: 1.5, fmDepth: 1 };
  }

  const saturation = event.color.saturation;
  const value = event.color.value;
  const table = {
    red: { amp: 1.14, cutoff: 0.92, resonance: 2.2, detune: -8, fmRatio: 1.25, fmDepth: 1.1 },
    yellow: { amp: 1.06, cutoff: 1.55, resonance: 1.4, detune: 10, fmRatio: 2.0, fmDepth: 0.8 },
    green: { amp: 0.96, cutoff: 1.12, resonance: 0.7, detune: -3, fmRatio: 1.5, fmDepth: 0.7 },
    cyan: { amp: 0.94, cutoff: 1.42, resonance: 1.0, detune: 5, fmRatio: 1.75, fmDepth: 0.85 },
    blue: { amp: 0.9, cutoff: 0.78, resonance: 2.8, detune: -14, fmRatio: 2.75, fmDepth: 1.45 },
    purple: { amp: 1.0, cutoff: 0.86, resonance: 3.2, detune: 16, fmRatio: 3.5, fmDepth: 1.7 },
    neutral: { amp: 1, cutoff: 1, resonance: 0, detune: 0, fmRatio: 1.5, fmDepth: 1 }
  };
  const shape = table[event.color.family] || table.neutral;
  return {
    amp: 1 + (shape.amp - 1) * saturation,
    cutoff: 1 + (shape.cutoff - 1) * saturation,
    resonance: shape.resonance * saturation,
    detune: shape.detune * saturation,
    fmRatio: shape.fmRatio,
    fmDepth: shape.fmDepth * (0.55 + saturation)
  };
}

function scanBehavior(event) {
  const value = clamp01(event.scanValue || 0);
  const table = {
    contour: { amp: 1.0, attack: 0.9, release: 0.92, cutoff: 1.08, resonance: 0.5, pan: 1.0, voice: null },
    shadow: { amp: 0.86, attack: 1.35, release: 1.22, cutoff: 0.62, resonance: 1.4, pan: 0.62, voice: "sub" },
    dust: { amp: 0.64, attack: 0.34, release: 0.38, cutoff: 1.75, resonance: 0.2, pan: 1.34, voice: "pluck" },
    field: { amp: 0.54, attack: 1.9, release: 1.55, cutoff: 0.82, resonance: 0.85, pan: 0.44, voice: "choir" },
    object: { amp: 0.94, attack: 1.22, release: 1.34, cutoff: 0.72, resonance: 1.8, pan: 0.52, voice: "dual" },
    grain: { amp: 0.72, attack: 0.48, release: 0.58, cutoff: 1.42, resonance: 0.65, pan: 1.24, voice: "fm" },
    colorTrace: { amp: 0.92, attack: 0.78, release: 0.96, cutoff: 1.24, resonance: 1.05, pan: 1.08, voice: null },
    xray: { amp: 0.78, attack: 1.08, release: 1.08, cutoff: 1.0, resonance: 2.15, pan: 0.74, voice: "cluster" }
  };
  const behavior = table[event.scan] || table.contour;
  return {
    ...behavior,
    amp: behavior.amp * (0.72 + value * 0.56),
    cutoff: behavior.cutoff * (0.82 + value * 0.42),
    resonance: behavior.resonance * (0.55 + value * 0.9)
  };
}

function startOscillator(type, frequency, time, duration, destination, detune = 0) {
  const osc = state.audio.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(20, frequency), time);
  osc.detune.setValueAtTime(detune, time);
  osc.connect(destination);
  osc.start(time);
  osc.stop(time + duration + 0.02);
  return osc;
}

function startLayeredOscillators(layers, time, duration, destination) {
  const nodes = [];
  layers.forEach((layer) => {
    const layerGain = state.audio.createGain();
    layerGain.gain.setValueAtTime(layer.gain, time);
    const osc = startOscillator(layer.type, layer.frequency, time, duration, layerGain, layer.detune || 0);
    layerGain.connect(destination);
    nodes.push(osc, layerGain);
  });
  return nodes;
}

function playEvent(event, time) {
  if (controls.synthMute.checked) return false;
  if (!canStartVoice()) return false;
  const audio = state.audio;
  const gain = audio.createGain();
  const pan = audio.createStereoPanner();
  const filter = audio.createBiquadFilter();
  const preGain = audio.createGain();
  const grind = audio.createWaveShaper();
  const grindMix = audio.createGain();
  const cleanMix = audio.createGain();
  const grindFilter = audio.createBiquadFilter();
  const sourceNodes = [];
  let voice = voiceForEvent(event);
  if (event.soundFamily) voice = voiceForSoundFamily(event.soundFamily, event);
  const timbre = timbreForEvent(event);
  const scanTone = scanBehavior(event);
  if (!event.soundFamily && controls.voice.value === "auto" && scanTone.voice) voice = scanTone.voice;
  const pitchInfo = frequencyForEvent(event, time);
  const pitch = pitchInfo.frequency;
  const scaleBehavior = pitchInfo.behavior;
  if (controls.voice.value === "auto") {
    if (scaleBehavior.family === "kalimba" || scaleBehavior.family === "mbira" || scaleBehavior.family === "slendro" || scaleBehavior.family === "pelog") voice = "bell";
    if (scaleBehavior.family === "raga" || scaleBehavior.family === "spectral") voice = "choir";
  }
  const metric = state.imageMetrics;
  const power = clamp01(event.edge * 0.34 + event.dark * 0.2 + (event.soft || 0) * 0.24 + (event.scanValue || 0) * 0.42 + metric.atmosphere * 0.16);
  let attack = Number(controls.attack.value) / 1000;
  const release = Math.min(Number(controls.release.value) / 1000, state.mobileMode ? 0.72 : 1.6);
  attack += metric.softness * 0.06 + metric.distance * 0.04;
  attack *= scanTone.attack;
  let duration = Math.max(0.18, release * (0.58 + power * 0.58 + metric.distance * 0.32));
  duration = Math.min(duration * scaleBehavior.decay * scanTone.release, 1.28 + metric.atmosphere * 0.42 + scaleBehavior.decay * 0.22);
  if (voice === "pluck") {
    attack = Math.min(attack, 0.006);
    duration = Math.min(duration, 0.34 + power * 0.18);
  }
  if (voice === "bell") {
    attack = Math.min(attack, 0.018);
    duration = Math.min(Math.max(duration, 0.52 + power * 0.34), 1.62);
  }
  if (voice === "sub") {
    duration = Math.max(duration, 0.38);
  }
  registerVoice(duration);
  const transparency = 0.42 + metric.emptiness * 0.26 + metric.overexposure * 0.16;
  const amp = (0.012 + power * 0.052) * timbre.amp * scanTone.amp * (0.82 + metric.density * 0.34);
  const cutoff = Number(controls.cutoff.value) * (0.44 + power * 0.82 + metric.overexposure * 0.38) * timbre.cutoff * scanTone.cutoff;
  const glide = Number(controls.glide.value);
  const grindAmount = 0;
  const detune = (event.edge - 0.5) * (8 + glide * 0.28 + metric.complexity * 12) + timbre.detune + metric.distance * 4 + pitchInfo.cents;

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(Math.min(12000, cutoff), time);
  filter.Q.setValueAtTime(Number(controls.resonance.value) * (0.18 + power * 0.08 + metric.complexity * 0.08) + timbre.resonance * 0.55 + scaleBehavior.resonance * 2.2 + scanTone.resonance, time);
  grind.curve = makeDistortionCurve((grindAmount * 0.25) + (power * grindAmount * 0.75));
  grind.oversample = "4x";
  grindFilter.type = "bandpass";
  grindFilter.frequency.setValueAtTime(360 + power * 2600 + grindAmount * 1800, time);
  grindFilter.Q.setValueAtTime(2 + grindAmount * 11, time);
  preGain.gain.setValueAtTime(1 + grindAmount * 5.5 + event.dark * grindAmount * 4, time);
  cleanMix.gain.setValueAtTime(Math.max(0.24, transparency - grindAmount * 0.48), time);
  grindMix.gain.setValueAtTime(grindAmount * (0.08 + power * 0.12), time);
  pan.pan.setValueAtTime((event.x * 2 - 1) * (0.36 + metric.distance * 0.5) * scanTone.pan + Math.sin(event.y * 19 + time) * scaleBehavior.cyclic * 0.18, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(amp, time + Math.max(0.004, attack));
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  if (voice === "fm") {
    const carrier = audio.createOscillator();
    const mod = audio.createOscillator();
    const modGain = audio.createGain();
    carrier.type = "sine";
    mod.type = "triangle";
    carrier.frequency.setValueAtTime(pitch, time);
    if (glide > 0) carrier.frequency.exponentialRampToValueAtTime(pitch * (1 + (event.edge - 0.5) * glide * 0.002), time + duration * 0.55);
    mod.frequency.setValueAtTime(pitch * (timbre.fmRatio + event.dark), time);
    modGain.gain.setValueAtTime((18 + power * 120) * timbre.fmDepth, time);
    mod.connect(modGain).connect(carrier.frequency);
    carrier.detune.setValueAtTime(detune, time);
    carrier.connect(preGain);
    sourceNodes.push(carrier, mod, modGain);
    mod.start(time);
    carrier.start(time);
    mod.stop(time + duration + 0.02);
    carrier.stop(time + duration + 0.02);
  } else if (voice === "dual") {
    sourceNodes.push(...startLayeredOscillators([
      { type: "sine", frequency: pitch, gain: 0.82, detune },
      { type: "triangle", frequency: pitch * 1.505, gain: 0.28 + power * 0.18, detune: detune * 0.35 + 7 },
      { type: "sine", frequency: pitch * 0.5, gain: 0.18 * event.dark, detune: -4 }
    ], time, duration, preGain));
  } else if (voice === "bell") {
    sourceNodes.push(...startLayeredOscillators([
      { type: "sine", frequency: pitch, gain: 0.72, detune },
      { type: "sine", frequency: pitch * 2.01, gain: 0.22 + power * 0.14, detune: 5 },
      { type: "triangle", frequency: pitch * 3.02, gain: 0.12 + event.edge * 0.12, detune: -9 }
    ], time, duration, preGain));
  } else if (voice === "pluck") {
    sourceNodes.push(...startLayeredOscillators([
      { type: "triangle", frequency: pitch, gain: 0.78, detune },
      { type: "square", frequency: pitch * 2, gain: 0.12 + event.edge * 0.12, detune: detune * 0.2 }
    ], time, duration, preGain));
  } else if (voice === "reed") {
    sourceNodes.push(...startLayeredOscillators([
      { type: "sawtooth", frequency: pitch, gain: 0.76, detune },
      { type: "square", frequency: pitch, gain: 0.18 + event.dark * 0.18, detune: detune + 6 }
    ], time, duration, preGain));
  } else if (voice === "sub") {
    sourceNodes.push(...startLayeredOscillators([
      { type: "square", frequency: pitch * 0.5, gain: 0.68, detune },
      { type: "sine", frequency: pitch, gain: 0.2 + power * 0.12, detune: detune * 0.25 }
    ], time, duration, preGain));
  } else if (voice === "cluster") {
    sourceNodes.push(...startLayeredOscillators([
      { type: "sine", frequency: pitch, gain: 0.48, detune: detune - 11 },
      { type: "sine", frequency: pitch * 1.005, gain: 0.42, detune: detune + 13 },
      { type: "triangle", frequency: pitch * 2.01, gain: 0.15 + power * 0.1, detune: 4 }
    ], time, duration, preGain));
  } else if (voice === "choir") {
    sourceNodes.push(...startLayeredOscillators([
      { type: "sine", frequency: pitch * 0.5, gain: 0.2 + metric.distance * 0.18, detune: detune - 9 },
      { type: "sine", frequency: pitch, gain: 0.34, detune: detune + 4 },
      { type: "triangle", frequency: pitch * 1.5, gain: 0.16 + metric.atmosphere * 0.16, detune: detune + 11 },
      { type: "sine", frequency: pitch * 2.01, gain: 0.09 + power * 0.08, detune: -13 }
    ], time, duration * 1.24, preGain));
  } else if (voice === "sample" && state.sample) {
    const sampleNodes = startSampleVoice(event, pitchInfo, time, duration, preGain, power);
    sourceNodes.push(...sampleNodes);
  } else {
    const osc = audio.createOscillator();
    osc.type = voice;
    osc.frequency.setValueAtTime(pitch, time);
    if (glide > 0) osc.frequency.exponentialRampToValueAtTime(pitch * (1 + (event.dark - 0.5) * glide * 0.002), time + duration * 0.65);
    osc.detune.setValueAtTime(detune, time);
    osc.connect(preGain);
    sourceNodes.push(osc);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  if (event.dark * Number(controls.drone.value) > 56) {
    const drone = audio.createOscillator();
    const droneGain = audio.createGain();
    drone.type = "sine";
    drone.frequency.setValueAtTime(pitch * 0.5, time);
    droneGain.gain.setValueAtTime(0.0001, time);
    droneGain.gain.exponentialRampToValueAtTime(0.018 * event.dark, time + 0.08);
    droneGain.gain.exponentialRampToValueAtTime(0.0001, time + Math.max(0.5, release * 1.7));
    drone.connect(droneGain).connect(state.reverb);
    droneGain.connect(state.master);
    sourceNodes.push(drone, droneGain);
    drone.start(time);
    drone.stop(time + Math.max(0.6, release * 1.8));
  }

  preGain.connect(filter);
  filter.connect(cleanMix).connect(pan);
  filter.connect(grind).connect(grindFilter).connect(grindMix).connect(pan);
  pan.connect(gain);
  gain.connect(state.master);
  gain.connect(state.delay);
  gain.connect(state.reverb);

  recordTrigger(event, event.soundFamily || voice, power);
  cleanupNodes([...sourceNodes, gain, pan, filter, preGain, grind, grindMix, cleanMix, grindFilter], duration + 0.2);
  return true;
}

function voiceForSoundFamily(family, event) {
  const table = {
    pluck: event.edge > 0.42 ? "pluck" : "sine",
    low: "sub",
    air: "choir",
    color: null,
    fallback: "sine"
  };
  if (family === "color") return voiceForEvent(event);
  return table[family] || voiceForEvent(event);
}

function startSampleVoice(event, pitchInfo, time, duration, destination, power) {
  const audio = state.audio;
  const sample = state.sample;
  const buffer = sample.buffer;
  const reverseChance = clamp01(Number(controls.granularSpray.value) / 120 + event.tonalRarity * 0.22 + event.x * 0.08);
  const reverse = seededWave(event.x * 151 + event.y * 313 + state.lastColumn * 0.27) < reverseChance;
  const source = audio.createBufferSource();
  const body = audio.createBiquadFilter();
  const trim = audio.createGain();
  const windowMs = Number(controls.sampleWindow.value);
  const level = Number(controls.sampleLevel.value) / 100;
  const texture = clamp01((event.localContrast || 0) * 0.44 + (event.scanValue || 0) * 0.36 + event.edge * 0.2);
  const sourceWindow = Math.min(buffer.duration, Math.max(0.025, windowMs / 1000 * (0.48 + texture)));
  const maxOffset = Math.max(0, buffer.duration - sourceWindow - 0.002);
  const positionSeed = clamp01(event.x * 0.44 + event.y * 0.18 + (event.colorRarity || 0) * 0.22 + (event.tonalRarity || 0) * 0.16);
  const offset = maxOffset * positionSeed;
  const pitchRatio = clamp01(pitchInfo.frequency / 880);
  const rate = Math.max(0.2, Math.min(3.8, 0.5 + pitchRatio * 1.6 + (event.pitchBias || 0) * 0.7));
  const nodeDuration = Math.min(duration * (0.72 + texture * 0.5), sourceWindow / rate + 0.08);

  source.buffer = reverse ? sample.reverseBuffer : buffer;
  source.playbackRate.setValueAtTime(rate, time);
  body.type = event.scan === "xray" ? "bandpass" : "lowpass";
  body.frequency.setValueAtTime(Math.min(11800, 420 + pitchInfo.frequency * (1.6 + texture * 4.2)), time);
  body.Q.setValueAtTime(0.7 + texture * 5 + Number(controls.resonance.value) * 0.08, time);
  trim.gain.setValueAtTime((0.34 + power * 0.88) * level, time);

  source.connect(body).connect(trim).connect(destination);
  source.start(time, reverse ? Math.max(0, buffer.duration - offset - sourceWindow) : offset, sourceWindow);
  source.stop(time + nodeDuration + 0.04);

  const resonatorGain = audio.createGain();
  resonatorGain.gain.setValueAtTime(0.12 * level * (0.3 + texture), time);
  resonatorGain.connect(destination);
  const resonators = startLayeredOscillators([
    { type: "sine", frequency: pitchInfo.frequency, gain: 0.28 + texture * 0.22, detune: pitchInfo.cents * 0.25 },
    { type: "triangle", frequency: pitchInfo.frequency * (1.5 + event.dark * 0.12), gain: 0.08 + event.edge * 0.08, detune: -7 + (event.colorRarity || 0) * 11 }
  ], time, Math.min(duration, 0.72 + texture * 0.5), resonatorGain);

  return [source, body, trim, resonatorGain, ...resonators];
}

function frequencyForEvent(event, time = 0) {
  const system = scaleSystems[controls.scale.value] || scaleSystems.kalimbaPentatonic;
  const baseMidi = 48 + keyOffsets[controls.key.value] + Number(controls.octave.value) * 12;
  const metric = state.imageMetrics;
  const phase = (state.playhead || 0) + event.x * 0.37 + event.y * 0.19;
  const living = Math.sin(phase * Math.PI * 2 + metric.complexity * 3.1);
  const signature = state.imageSignature || {};
  const asymmetry = signature.asymmetry || 0;
  const imageBias = (event.pitchBias || 0)
    + (event.tonalRarity || 0) * (0.08 + asymmetry * 0.08)
    + (event.localContrast || 0) * 0.05
    - (event.soft || 0) * 0.04;
  const centeredY = clamp01((1 - event.y) * (0.82 + system.center * 0.18) + event.dark * (1 - system.center) * 0.16 + imageBias);
  const layoutY = system.layout === "scatter"
    ? clamp01(centeredY + Math.sin(event.x * 27 + event.y * 9) * 0.18)
    : system.layout === "interlock"
      ? clamp01((centeredY * 0.72 + ((Math.floor(event.x * 18) % 2) ? 0.22 : -0.08)))
      : centeredY;

  const octaveShift = Math.floor(layoutY * 2.999);
  let semitone = 0;
  let index = 0;

  if (system.ratios) {
    index = Math.max(0, Math.min(system.ratios.length - 1, Math.floor(layoutY * system.ratios.length)));
    const ratio = system.ratios[index] * 2 ** octaveShift;
    const base = 440 * 2 ** ((baseMidi - 69) / 12);
    const cents = living * system.drift + (seededWave(event.x * 37 + event.y * 61) - 0.5) * system.drift;
    return { frequency: base * ratio * 2 ** (cents / 1200), cents, behavior: system };
  }

  if (system.partials) {
    index = Math.max(0, Math.min(system.partials.length - 1, Math.floor(layoutY * system.partials.length)));
    const partial = system.partials[index];
    const octaveFold = partial / 2 ** Math.floor(Math.log2(partial));
    const base = 440 * 2 ** ((baseMidi - 69) / 12);
    const cents = living * system.drift + (partial > 7 ? (partial - 7) * 1.6 : 0);
    return { frequency: base * octaveFold * 2 ** octaveShift * 2 ** (cents / 1200), cents, behavior: system };
  }

  let pool = system.intervals;
  if (system.morphTo) {
    const morph = clamp01(metric.atmosphere * 0.44 + metric.complexity * 0.34 + (Math.sin(phase * Math.PI * 2) + 1) * 0.11);
    const max = Math.max(system.intervals.length, system.morphTo.length);
    pool = Array.from({ length: max }, (_, i) => {
      const a = system.intervals[i % system.intervals.length];
      const b = system.morphTo[i % system.morphTo.length];
      return a + (b - a) * morph;
    });
  }

  index = Math.max(0, Math.min(pool.length - 1, Math.floor(layoutY * pool.length)));
  const anchorPull = seededWave(event.x * 97 + state.lastColumn * 0.013);
  if (anchorPull < system.center * 0.22) index = 0;
  if (anchorPull > 0.91 && system.center > 0.68) index = Math.min(pool.length - 1, pool.findIndex((note) => note >= 7) || index);
  semitone = pool[index] + octaveShift * 12;

  if (system.mutate) {
    const neighbor = pool[Math.max(0, Math.min(pool.length - 1, index + (living > 0 ? 1 : -1)))] + octaveShift * 12;
    semitone += (neighbor - semitone) * system.mutate * clamp01(metric.complexity + event.edge);
  }

  const micro = (seededWave(event.x * 311 + event.y * 719 + state.lastColumn * 0.17) - 0.5)
    * system.drift
    * (0.62 + metric.complexity + (event.colorRarity || 0) * 0.34 + (event.tonalRarity || 0) * 0.22);
  const bend = Math.sin(time * 0.37 + event.x * 8.1) * system.bend * clamp01(event.soft + metric.atmosphere * 0.4);
  const paired = system.paired ? (seededWave(event.y * 53 + event.x * 31) > 0.5 ? system.paired : -system.paired) : 0;
  const cents = micro + bend + paired;
  const midi = baseMidi + semitone;
  return { frequency: 440 * 2 ** ((midi - 69 + cents / 100) / 12), cents, behavior: system };
}

function updateEffects() {
  if (!state.audio || !state.spatial) return;
  const metric = state.imageMetrics;
  const spatial = state.spatial;
  const scan = controls.viewMode.value;
  const resolution = Number(controls.grain.value) / 18;
  const resonance = Number(controls.voices.value) / 10;
  const erosion = Number(controls.chance.value) / 70;
  const gravity = Number(controls.swing.value) / 100;
  const fold = Number(controls.stutter.value) / 100;
  const floor = Number(controls.drone.value) / 100;
  const air = Number(controls.reverb.value) / 100;
  const memory = Number(controls.feedback.value) / 86;
  const topology = spatialTopology(scan, metric);
  const roomSize = clamp01(topology.roomSize + metric.emptiness * 0.28 + metric.distance * 0.22 + air * 0.24 - metric.density * 0.12);
  const reflectionDensity = clamp01(topology.reflectionDensity + resolution * 0.22 + metric.complexity * 0.24);
  const decayTopology = clamp01(topology.decay + memory * 0.34 + air * 0.24 - erosion * 0.1);
  const width = clamp01(topology.width + metric.directionality * 0.24 + gravity * 0.1);
  const clustering = clamp01(topology.clustering + resonance * 0.28 + metric.density * 0.22);
  const diffusion = clamp01(topology.diffusion + fold * 0.28 + metric.softness * 0.16);
  const damping = clamp01(topology.damping + (1 - air) * 0.28 + metric.darkness * 0.18);
  const fragmentation = clamp01(topology.fragmentation + (1 - erosion) * 0.18 + metric.complexity * 0.18);
  const now = state.audio.currentTime;

  if (state.granularBus) {
    state.granularBus.gain.setTargetAtTime(controls.granularMute.checked ? 0.0001 : 1, now, 0.035);
  }
  spatial.input.gain.setTargetAtTime(0.42 + resonance * 0.36, now, 0.04);
  spatial.earlyInput.gain.setTargetAtTime((0.12 + reflectionDensity * 0.42) * (state.mobileMode ? 0.72 : 1), now, 0.06);
  spatial.lateInput.gain.setTargetAtTime((0.18 + decayTopology * 0.48) * (state.mobileMode ? 0.62 : 1), now, 0.06);
  spatial.earlyReturn.gain.setTargetAtTime(0.08 + reflectionDensity * 0.22 + fragmentation * 0.08, now, 0.08);
  spatial.lateReturn.gain.setTargetAtTime(0.1 + air * 0.32 + roomSize * 0.18, now, 0.08);
  spatial.memory.gain.setTargetAtTime(Math.min(0.72, 0.08 + memory * 0.34 + decayTopology * 0.2), now, 0.08);
  spatial.air.frequency.setTargetAtTime(950 + air * 7600 - damping * 2400 + metric.overexposure * 1800, now, 0.08);
  spatial.floor.frequency.setTargetAtTime(34 + floor * 180 + metric.density * 120, now, 0.08);

  spatial.earlyTaps.forEach((tap, index) => {
    const offset = 1 + index * 0.37;
    const time = 0.009 + (0.014 + roomSize * 0.09) * offset * (0.72 + fragmentation * 0.42);
    tap.delay.delayTime.setTargetAtTime(Math.min(0.17, time), now, 0.12);
    tap.gain.gain.setTargetAtTime((0.026 + reflectionDensity * 0.05) * (1 - index * 0.09) * (state.mobileMode && index > 1 ? 0.25 : 1), now, 0.08);
    tap.pan.pan.setTargetAtTime((index % 2 ? 1 : -1) * (0.16 + width * 0.72), now, 0.12);
  });

  spatial.lines.forEach((line, index) => {
    const mod = Math.sin(now * (0.035 + index * 0.007) + index * 1.71) * (0.002 + diffusion * 0.006);
    const contourOffset = Math.sin(metric.complexity * 4 + index) * clustering * 0.018;
    const time = line.baseTime * (0.58 + roomSize * 1.55) + contourOffset + mod;
    line.delay.delayTime.setTargetAtTime(Math.max(0.026, Math.min(0.82, time)), now, 0.16);
    line.damp.frequency.setTargetAtTime(Math.max(580, 8500 - damping * 6500 - index * 220 + air * 1600), now, 0.1);
    line.body.frequency.setTargetAtTime(120 + floor * 540 + clustering * 1200 + index * (90 + resonance * 90), now, 0.1);
    line.body.Q.setTargetAtTime(0.5 + clustering * 4.2 + resonance * 1.8, now, 0.12);
    line.pan.pan.setTargetAtTime((index % 2 ? 1 : -1) * (0.12 + width * 0.82) * (0.55 + seededWave(index + scan.length) * 0.45), now, 0.14);
    line.out.gain.setTargetAtTime((0.024 + decayTopology * 0.048 + reflectionDensity * 0.012) * (state.mobileMode && index > 2 ? 0.28 : 1), now, 0.08);
    if (line.cross) {
      line.cross.forEach((cross, crossIndex) => {
        const sign = (index + crossIndex) % 2 ? 1 : -1;
        cross.gain.setTargetAtTime(sign * Math.min(0.046, 0.008 + memory * 0.026 + diffusion * 0.012), now, 0.14);
      });
    }
  });
}

function spatialTopology(scan, metric) {
  const byScan = {
    contour: { roomSize: 0.46, reflectionDensity: 0.55, decay: 0.48, width: 0.62, clustering: 0.48, diffusion: 0.58, damping: 0.36, fragmentation: 0.34 },
    shadow: { roomSize: 0.24, reflectionDensity: 0.72, decay: 0.34, width: 0.32, clustering: 0.82, diffusion: 0.38, damping: 0.7, fragmentation: 0.28 },
    dust: { roomSize: 0.34, reflectionDensity: 0.88, decay: 0.22, width: 0.78, clustering: 0.42, diffusion: 0.82, damping: 0.48, fragmentation: 0.94 },
    field: { roomSize: 0.9, reflectionDensity: 0.28, decay: 0.86, width: 0.82, clustering: 0.22, diffusion: 0.68, damping: 0.18, fragmentation: 0.18 },
    object: { roomSize: 0.42, reflectionDensity: 0.48, decay: 0.58, width: 0.42, clustering: 0.78, diffusion: 0.42, damping: 0.52, fragmentation: 0.22 },
    grain: { roomSize: 0.38, reflectionDensity: 0.84, decay: 0.3, width: 0.72, clustering: 0.5, diffusion: 0.74, damping: 0.44, fragmentation: 0.82 },
    colorTrace: { roomSize: 0.58, reflectionDensity: 0.46, decay: 0.62, width: 0.76, clustering: 0.36, diffusion: 0.54, damping: 0.28, fragmentation: 0.42 },
    xray: { roomSize: 0.5, reflectionDensity: 0.68, decay: 0.52, width: 0.5, clustering: 0.74, diffusion: 0.5, damping: 0.42, fragmentation: 0.58 }
  };
  const base = byScan[scan] || byScan.contour;
  return {
    ...base,
    roomSize: clamp01(base.roomSize + metric.emptiness * 0.1 - metric.density * 0.06),
    clustering: clamp01(base.clustering + metric.density * 0.08),
    fragmentation: clamp01(base.fragmentation + metric.complexity * 0.08)
  };
}

function updateReadouts() {
  const scaleName = controls.scale.options[controls.scale.selectedIndex].text;
  const voiceName = controls.voice.options[controls.voice.selectedIndex].text;
  const viewName = controls.viewMode.options[controls.viewMode.selectedIndex].text;
  const colorName = dominantColorName();
  const metric = state.imageMetrics;
  const atmosphere = Math.round(metric.atmosphere * 100);
  const distance = Math.round(metric.distance * 100);
  const sampleName = state.sampleLoading ? "loading" : state.sample ? state.sample.name : "no sample";
  sampleLoadButton.textContent = state.sampleLoading ? "loading sample" : state.sample ? sampleName : "load sample";
  sampleLoadButton.title = state.sample ? "replace sample" : "load sample";
  sampleNameReadout.textContent = state.sample ? `${sampleName} / ${state.sample.duration.toFixed(2)}s` : sampleName;
  readouts.events.textContent = String(state.events.length);
  readouts.scale.textContent = `${controls.key.value} ${scaleName}`;
  readouts.voice.textContent = controls.colorMap.checked ? `${colorName} map / ${voiceName}` : voiceName;
  readouts.image.textContent = state.activeLayer && state.activeLayer !== viewName ? `${viewName} / ${state.activeLayer}` : viewName;
  readouts.bpm.textContent = `${controls.bpm.value} bpm`;
  readouts.filter.textContent = controls.voice.value === "sample"
    ? `${sampleName} / ${controls.sampleLevel.value}`
    : controls.colorMap.checked
      ? `${(Number(controls.cutoff.value) / 1000).toFixed(1)} kHz / ${colorName}`
      : `${(Number(controls.cutoff.value) / 1000).toFixed(1)} kHz / air ${atmosphere}`;
  readouts.space.textContent = `${distance} burn / ${controls.voices.value} resonance`;
  readouts.granular.textContent = controls.granular.checked
    ? `${controls.granularMute.checked ? "muted" : `${controls.granularDensity.value} grains`} / ${controls.granularLevel.value} level`
    : "off";
  const audioState = state.audio?.state || state.audioState || "none";
  readouts.perform.textContent = [
    `audio ${audioState}`,
    state.mobileMode ? "mobile" : "desktop",
    controls.synthMute.checked ? "muted" : "sound"
  ].join(" · ");
  readouts.scan.textContent = controls.reverse.checked ? "right → left" : "left → right";
}

function clearScore() {
  stop();
  state.image = null;
  state.imageData = null;
  state.gray = [];
  state.edges = [];
  state.colors = [];
  state.colorProfile = null;
  state.maps = {};
  state.layerStats = {};
  state.activeLayer = "field";
  state.imageMetrics = {
    density: 0,
    emptiness: 1,
    complexity: 0,
    softness: 1,
    overexposure: 0,
    darkness: 0,
    distance: 0.5,
    atmosphere: 0.5
  };
  state.events = [];
  state.layerEvents = {};
  state.triggers = [];
  state.playhead = 0;
  emptyState.classList.remove("is-hidden");
  updateReadouts();
  render();
}

loadButton.addEventListener("click", () => fileInput.click());
playButton.addEventListener("pointerdown", () => {
  unlockAudioFromGesture().catch(() => {});
}, { passive: true });
playButton.addEventListener("touchend", () => {
  unlockAudioFromGesture().catch(() => {});
}, { passive: true });
playButton.addEventListener("click", togglePlay);
clearButton.addEventListener("click", clearScore);
sampleLoadButton.addEventListener("click", () => sampleInput.click());
fileInput.addEventListener("change", (event) => loadFile(event.target.files[0]));
sampleInput.addEventListener("change", (event) => {
  loadSampleFile(event.target.files[0]);
  event.target.value = "";
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("is-dragging");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-dragging"));
dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("is-dragging");
  const file = event.dataTransfer.files[0];
  if (file?.type.startsWith("audio/")) loadSampleFile(file);
  else loadFile(file);
});

Object.values(controls).forEach((control) => {
  control.addEventListener("input", () => {
    if (control.id === "detailControl") analyzeImage();
    if (["edgeControl", "densityControl", "viewMode"].includes(control.id)) buildEvents();
    updateEffects();
    updateReadouts();
    render();
  });
});

window.addEventListener("resize", () => {
  resizeCanvas();
  resizeBackdrop();
});
resizeCanvas();
resizeBackdrop();
updateReadouts();
