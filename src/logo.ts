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

function layoutLogo({ scaleX, blocks }) {
  const stage = createFrame(0, 0, 950, 560); // hack the height because parent() does not work correctly with inset boxes
  const mainFrame = createFrame(0, 0, 680, 230);
  const letter = createFrame(0, 0, 60, 60);
  const splitFrames = sliceX(mainFrame, 1 / 3, 2 / 3);
  const insetFrames = splitFrames.map((frame) => inset(frame, 25));
  const blockFrames = insetFrames.map((frame, index) =>
    createFrame(
      frame.x,
      frame.y,
      frame.width,
      frame.height * blocks[index].scaleY
    )
  );
  const scaledBlocks = scale(blockFrames, scaleX, 1);
  const scaledBlocksBoundingBox = boundingBox(scaledBlocks);
  const centeredBoundingBox = center(scaledBlocksBoundingBox, stage);
  const parentedBlocks = parent(scaledBlocks, centeredBoundingBox);
  const letters = parentedBlocks.map((frame, index) => {
    const scaledLetter = createFrame(letter.x, letter.y, letter.width * blocks[index].scaleY, letter.height * blocks[index].scaleY);
    return center(scaledLetter, frame);
  });

  return {
    blocks: parentedBlocks,
    letters: letters,
  };
}

function drawLogo(layout, style) {

  layout.blocks.forEach((block) => {
    context.fillStyle = 'black';
    context.fillRect(block.x, block.y, block.width, block.height);
  });

  layout.letters.forEach((letter, index) => {
    context.fillStyle = `rgba(200, 200, 200, ${style.letters[index].opacity})`;
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
  block1Height: createSpring({ x: 1, v: 0 }, defaultSpringProperties),
  block2Height: createSpring({ x: 1, v: 0 }, defaultSpringProperties),
  block3Height: createSpring({ x: 1, v: 0 }, defaultSpringProperties)
};

function update() {
  const springValues = Object.keys(springs).reduce((mem, name) => {
    mem[name] = springs[name].update().x;
    return mem;
  }, {});

  const layout = layoutLogo({
    scaleX: springValues.scaleX,
    blocks: [
      { scaleY: springValues.block1Height },
      { scaleY: springValues.block2Height },
      { scaleY: springValues.block3Height }
    ]
  });

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawLogo(layout, {
    letters: [
      { opacity: springValues.block1Height },
      { opacity: springValues.block2Height },
      { opacity: springValues.block3Height },
    ]
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
const blockHeightFlippers = [
  createValueFlipper<number, number>(),
  createValueFlipper<number, number>(),
  createValueFlipper<number, number>()
];

document.querySelector('.toggle-collapse').addEventListener('click', () => {
  springs.block1Height.setLength(blockHeightFlippers[0](1, 0.25));
  springs.block2Height.setLength(blockHeightFlippers[1](1, 0.25));
  springs.block3Height.setLength(blockHeightFlippers[2](1, 0.25));
});

document.querySelector('.toggle-stretch').addEventListener('click', () => {
  springs.scaleX.setLength(scaleXFlipper(1, 1.5));
});

update();
