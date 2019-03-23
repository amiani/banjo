const hit = document.getElementById('hit');
const roll = document.getElementById('roll');
const nextRoll = document.getElementById('nextroll');
const stopButton = document.getElementById('stop');
const startButton = document.getElementById('restart');
const rollsToggle = document.getElementById('rolls');
const variantsToggle = document.getElementById('variants');
const sequencesToggle = document.getElementById('sequences');
const chordsToggle = document.getElementById('chords');
const bpmDisplay = document.getElementById('bpm');
const plusfivebutton = document.getElementById('plusfive');
const minusfivebutton = document.getElementById('minusfive');

const rolls = ['forward', 'backward', 'forward-reverse', 'mixed'];
const chords = ['G', 'C', 'D7'];
const sequences = [
  [{ chord: 'A' }, { chord: 'C' }],
  [{ chord: 'B' }, { chord: 'E' }],
];
let rollName = 'forward';
let chord = 'G';
let beatCount = 0;
let bpm = 90;
hit.volume = .1;
let withRolls = false;
let withVariants = false;
let withChords = true;
let withSequences = false;
let variant = '';

const printMotif = motif => `${motif.chord} ${motif.roll} ${motif.isVariant ? 'variant' : ''}`;

const choose = motifFactories => {
  return motifFactories[Math.floor(Math.random()*motifFactories.length)];
};


class MotifFactory {
  constructor() {
    this.selected = false;
  }

  toggle() {
    this.selected = !this.selected;
  }

  make(motifs) {
  }
}

class RollFactory extends MotifFactory {
  make(motifs) {
    const motif = {...motifs[motifs.length-1]};
    motif.roll = rolls[Math.floor(Math.random() * rolls.length)];
    return [motif];
  }
}

class ChordFactory extends MotifFactory {
  make(motifs) {
    const motif = {...motifs[motifs.length-1]};
    motif.chord = chords[Math.floor(Math.random()*chords.length)];
    return [motif];
  }
}

class SequenceFactory extends MotifFactory {
  make(motifs) {
    let prev = {...motifs[motifs.length-1]};
    const sequence = sequences[Math.floor(Math.random()*sequences.length)];
    return sequence.map(s => {
      const motif = Object.assign(prev, s);
      prev = {...motif};
      return motif;
    });
  }
}

const rollFactory = new RollFactory();
const chordFactory = new ChordFactory();
const sequenceFactory = new SequenceFactory();

const motifFactories = [rollFactory, chordFactory, sequenceFactory];

const makeMotif = motifs => {
  const factory = choose(motifFactories.filter(f => f.selected === true));
  return factory.make(motifs);
}

const motifs = [{ chord: 'G', roll: 'forward' }, { chord: 'C', roll: 'backward' }];
let accumulator = 0;
let currTime;
let beatInterval = 60000/bpm;
let run = true;
const main = newTime => {
  const frameTime = newTime - currTime;
  currTime = newTime;
  accumulator += frameTime;
  if (accumulator >= beatInterval) {
    hit.currentTime = 0;
    beat.innerHTML = beatCount % 4 + 1;
    if (beatCount % 4 === 0) {
      roll.innerHTML = printMotif(motifs.shift());
      if (motifs.length <= 2) Array.prototype.push.apply(motifs, makeMotif(motifs));
      nextRoll.innerHTML = printMotif(motifs[0]);
    }
    beatCount++;
    accumulator = 0;
  }
  if (run)
    setTimeout(() => main(performance.now(), 1));
};

let loop;
const stop = () => {
  beatCount = 0;
  beat.innerHTML = 1;
  run = false;
  hit.pause();
  hit.currentTime = 0;
};

const start = () => {
  stop();
  if (!motifFactories.reduce((acc, curr) => acc || curr.selected, false)) {
    console.log('none selected');
  } else {
    hit.play();
    accumulator = 0;
    run = true;
    currTime = performance.now();
    main(performance.now());
  }
};

stopButton.onclick = stop;
startButton.onclick = start;

rollsToggle.onclick = () => {
  rollsToggle.classList.toggle('selected');
  rollFactory.toggle();
};
variantsToggle.onclick = () => {
  variantsToggle.classList.toggle('selected');
};
sequencesToggle.onclick = () => {
  sequencesToggle.classList.toggle('selected');
  sequenceFactory.selected = !sequenceFactory.selected;
};
chordsToggle.onclick = () => {
  chordsToggle.classList.toggle('selected');
  chordFactory.toggle();
};

const changeBPM = amt => {
  bpm += amt;
  beatInterval = 60000/bpm;
  bpmDisplay.innerHTML = bpm;
};
plusfivebutton.onclick = () => changeBPM(5);
minusfivebutton.onclick = () => changeBPM(-5);

//start();
