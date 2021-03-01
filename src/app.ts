import { createValueFlipper } from './utils/logic';

import { createSpring, SpringProperties } from './spring';

let coolSpringProperites: SpringProperties = {
  stiffness: 381.47,
  mass: 1,
  damping: 20
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const coolSpring = createSpring({ x: 50, v: 0 }, coolSpringProperites);

function drawGraph(props: SpringProperties) {
  const s = createSpring({ x: 0, v: 5000 }, props);
  const m = 150;
  const spacing = canvas.width / m;

  context.strokeStyle = '#E4B8EA';
  context.lineWidth = 2;
  context.beginPath();

  for (let i = 0; i < m; i++) {
    const { x, v } = s.update();

    if (i === 0) {
      context.moveTo(spacing * i, (canvas.height / 2) + (-x));
    } else {
      context.lineTo(spacing * i, (canvas.height / 2) + (-x));
    }
  }

  context.stroke();
}

function update() {
  const { x, v } = coolSpring.update();

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawGraph(coolSpringProperites);

  context.fillStyle = '#F85032';
  context.fillRect((canvas.width / 2) - 88, x, 44, 44);


  window.requestAnimationFrame(update);
}

update();

const positionFlipper = createValueFlipper<number, number>();

canvas.addEventListener('click', () => {
  const canvasVerticalCenter = (canvas.height / 2);

  coolSpring.setLength(
    positionFlipper(
      canvasVerticalCenter - 42,
      canvasVerticalCenter + 42
    )
  );
});

function controls(dom: HTMLElement, props, onUpdate) {
  Object.keys(props).forEach((key) => {
    const value = props[key];
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.textContent = key;
    input.value = value;
    input.type = 'number';

    label.appendChild(input);
    dom.appendChild(label);

    input.addEventListener('input', (evt) => {
      onUpdate({
        [key]: parseFloat((evt.currentTarget as HTMLInputElement).value)
      });
    });
  });
}

const controlsContainer = document.querySelector<HTMLElement>('.controls');

controls(controlsContainer, coolSpringProperites, (values) => {
  console.log(values);
  coolSpring.setProperties(values);
  coolSpringProperites = {
    ...coolSpringProperites,
    ...values
  };
  coolSpring.reset();
})
