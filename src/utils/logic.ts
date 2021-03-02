export function createValueFlipper<A, B>() {
  let flipped = false;

  return (a: A, b: B): A | B => {
    const flippedValue = flipped ? a : b;
    flipped = !flipped;
    return flippedValue;
  };
}

export function createUpdateAtFrameRate(fps: number) {
  const frameLengthMs = 1000 / fps;
  let lastDrawTime = 0;

  return (updateFunc) => {
    const timeElapsedSinceLastDrawMs = Date.now() - lastDrawTime;

    if (timeElapsedSinceLastDrawMs > frameLengthMs) {
      updateFunc(timeElapsedSinceLastDrawMs);
    }

    lastDrawTime = Date.now();
  };
}
