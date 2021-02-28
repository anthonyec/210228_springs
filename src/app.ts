import { randomNumberBetween } from './utils/math';
import { createSpring, SpringProperties } from './spring';

const coolSpringProperites: SpringProperties = {
  stiffness: 500,
  mass: 2,
  damping: 10
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const coolSpring = createSpring(coolSpringProperites);

function update() {
  const { x, v } = coolSpring.update();

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(canvas.width / 2, (canvas.height / 2) + x, 10, 10);

  window.requestAnimationFrame(update);
}

canvas.addEventListener('click', () => {
  // coolSpring.addVelocity(1000);
  coolSpring.setLength(randomNumberBetween(-100, 100));
});

update();
