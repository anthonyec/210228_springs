import {
  boundingBox,
  center,
  createFrame,
  getCenter,
  inset,
  intersect,
  sliceX,
  stackY,
  translate,
  scale,
  parent
} from 'frames/src/index';
import { Frame } from 'frames/src/types';
import { createSpring, SpringProperties } from './spring';
import { createValueFlipper } from './utils/logic';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function layoutLogo({ scaleX, blockHeightPercentage }) {
  const stage = createFrame(0, 0, 950, 560); // hack the height because parent() does not work correctly with inset boxes
  const mainFrame = createFrame(0, 0, 680, 230);
  const letter = createFrame(0, 0, 60 * blockHeightPercentage, 60 * blockHeightPercentage);
  const splitFrames = sliceX(mainFrame, 1 / 3, 2 / 3);
  const insetFrames = splitFrames.map((frame) => inset(frame, 25));
  const blocks = insetFrames.map((frame) =>
    createFrame(
      frame.x,
      frame.y,
      frame.width,
      frame.height * blockHeightPercentage
    )
  );
  const scaledBlocks = scale(blocks, scaleX, 1);
  const scaledBlocksBoundingBox = boundingBox(scaledBlocks);
  const centeredBoundingBox = center(scaledBlocksBoundingBox, stage);
  const parentedBlocks = parent(scaledBlocks, centeredBoundingBox);
  const letters = parentedBlocks.map((frame) => center(letter, frame));

  return {
    blocks: parentedBlocks,
    letters: letters,
  };
}

function drawLogo({ blocks, letters }, { letterOpacity }) {

  blocks.forEach((block) => {
    context.fillStyle = 'black';
    context.fillRect(block.x, block.y, block.width, block.height);
  });

  letters.forEach((letter) => {
    context.fillStyle = `rgba(200, 200, 200, ${letterOpacity})`;
    context.fillRect(letter.x, letter.y, letter.width, letter.height);
  });
}

const defaultSpringProperties: SpringProperties = {
  stiffness: 381,
  mass: 1,
  damping: 50,
};

const bouncySpringProperties: SpringProperties = {
  stiffness: 200,
  mass: 1.2,
  damping: 20,
};

const springs = {
  scaleX: createSpring({ x: 1, v: 0 }, bouncySpringProperties),
  blockHeightPercentage: createSpring({ x: 1, v: 0 }, defaultSpringProperties),
};

function update() {
  const springValues = Object.keys(springs).reduce((mem, name) => {
    mem[name] = springs[name].update().x;
    return mem;
  }, {});

  const layout = layoutLogo({
    scaleX: springValues.scaleX,
    blockHeightPercentage: springValues.blockHeightPercentage,
  });

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawLogo(layout, {
    letterOpacity: springValues.blockHeightPercentage
  });

  // Object.values(layout).flat().forEach(frame => {
  //   context.strokeStyle = "blue";
  //   context.beginPath();
  //   context.rect(frame.x, frame.y, frame.width, frame.height);
  //   context.stroke();
  // });

  window.requestAnimationFrame(update);
}

const scaleXFlipper = createValueFlipper<number, number>();
const blockHeightFlipper = createValueFlipper<number, number>();

document.querySelector('.toggle-collapse').addEventListener('click', () => {
  springs.blockHeightPercentage.setLength(blockHeightFlipper(1, 0.1));
});

document.querySelector('.toggle-stretch').addEventListener('click', () => {
  springs.scaleX.setLength(scaleXFlipper(1, 1.5));
});

update();
