const hit = document.getElementById('hit');
const roll = document.getElementById('roll');
const nextRoll = document.getElementById('nextroll');
const stopButton = document.getElementById('stop');
const startButton = document.getElementById('restart');
const rollsToggle = document.getElementById('rolls');
const variantsToggle = document.getElementById('variants');
const patternsToggle = document.getElementById('patterns');
const chordsToggle = document.getElementById('chords');
const bpmDisplay = document.getElementById('bpm');
const plusfivebutton = document.getElementById('plusfive');
const minusfivebutton = document.getElementById('minusfive');

const rollnames = ['forward', 'backward', 'forward-reverse', 'mixed'];
const chords = ['G', 'C', 'D7'];
const patterns = ['G->C', 'D->C',];
let rollName = 'forward';
let chord = 'G';
let beatCount = 0;
let bpm = 90;
hit.volume = .5;
let withRolls = false;
let withVariants = false;
let withChords = true;
let variant = '';

const changeRoll = () => {
  rollName = rollnames[Math.floor(Math.random() * rollnames.length)];
  if (withVariants && Math.random() < .5)
    variant = ' variant';
  else
    variant = '';
}

const changeChord = () => {
  chord = chords[Math.floor(Math.random()*chords.length)];
}
let changeOne = changeChord;
let changeTwo = changeChord;

let accumulator = 0;
let currTime;
let beatInterval = 60000/bpm;
const main = newTime => {
  const frameTime = newTime - currTime;
  currTime = newTime;
  accumulator += frameTime;
  while (accumulator >= beatInterval) {
    hit.currentTime = 0;
    beat.innerHTML = beatCount % 4 + 1;
    if (beatCount % 4 === 0) {
      const rand = Math.random();
      if (rand < .5) {
        changeOne(rand);
      } else {
        changeTwo(rand);
      }
      roll.innerHTML = nextRoll.innerHTML;
      nextRoll.innerHTML = `${chord} ${rollName} ${variant}`;
    }
    beatCount++;
    accumulator = 0;
  }
  setTimeout(() => main(performance.now(), 1));
};

let loop;
const stop = () => {
  beatCount = 0;
  beat.innerHTML = 1;
  clearInterval(loop);
  hit.pause();
  hit.currentTime = 0;
};

const start = () => {
  stop();
  hit.play();
  accumulator = 0;
  currTime = performance.now();
  main(performance.now());
};

stopButton.onclick = stop;
startButton.onclick = start;

rollsToggle.onclick = () => {
  rollsToggle.classList.toggle('selected');
  withRolls = !withRolls;
  changeTwo = changeTwo == changeRoll ? changeChord : changeRoll;
};
variantsToggle.onclick = () => {
  variantsToggle.classList.toggle('selected');
  withVariants = !withVariants;
};
patternsToggle.onclick = () => {
  patternsToggle.classList.toggle('selected');
  withPatterns = !withPatterns;
};
chordsToggle.onclick = () => {
  chordsToggle.classList.toggle('selected');
  withChords = !withChords;
  changeOne = changeOne == changeChord ? changeRoll : changeChord;
};

const changeBPM = amt => {
  bpm += amt;
  beatInterval = 60000/bpm;
  bpmDisplay.innerHTML = bpm;
};
plusfivebutton.onclick = () => changeBPM(5);
minusfivebutton.onclick = () => changeBPM(-5);

//start();
