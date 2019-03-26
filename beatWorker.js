onmessage = e => {
  main(e.data);
};

const main = bpm => {
  let beatCount = 0;
  let accumulator = 0;
  let currTime = performance.now();
  let beatInterval = 60000/bpm;
  while (true) {
    newTime = performance.now();
    const frameTime = newTime - currTime;
    currTime = newTime;
    accumulator += frameTime;
    if (accumulator >= beatInterval) {
      postMessage(beatCount);
      beatCount++;
      accumulator -= beatInterval;
    }
  }
};
