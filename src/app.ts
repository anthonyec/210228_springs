import { createValueFlipper } from "./utils/logic";

import { createSpring, SpringProperties } from "./spring";

let coolSpringProperites: SpringProperties = {
  stiffness: 381,
  mass: 1,
  damping: 20,
};

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const coolSpring = createSpring({ x: 50, v: 0 }, coolSpringProperites);

function drawGraph(props: SpringProperties) {
  const s = createSpring({ x: 0, v: 5000 }, props);
  const m = 150;
  const spacing = canvas.width / m;

  context.strokeStyle = "#E4B8EA";
  context.lineWidth = 3;
  context.beginPath();

  for (let i = 0; i < m; i++) {
    const { x, v } = s.update();

    if (i === 0) {
      context.moveTo(spacing * i, canvas.height / 2 + -x);
    } else {
      context.lineTo(spacing * i, canvas.height / 2 + -x);
    }
  }

  context.stroke();
}

function update() {
  const { x, v } = coolSpring.update();

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawGraph(coolSpringProperites);

  context.fillStyle = "#F85032";
  context.beginPath();
  context.arc(canvas.width / 2, x + 22, 22, 0, 2 * Math.PI);
  context.fill();

  window.requestAnimationFrame(update);
}

update();

const positionFlipper = createValueFlipper<number, number>();

canvas.addEventListener("click", () => {
  const canvasVerticalCenter = canvas.height / 2;
  const sizeCenter = 44 / 2;

  coolSpring.setLength(
    positionFlipper(
      canvasVerticalCenter - sizeCenter - 42,
      canvasVerticalCenter - sizeCenter + 42
    )
  );
});

function controls(dom: HTMLElement, props, settings, onUpdate) {
  Object.keys(props).forEach((key) => {
    const value = props[key];
    const label = document.createElement("label");
    const input = document.createElement("input");

    label.textContent = key;
    input.value = value;
    input.type = "number";

    if (settings[key]) {
      Object.keys(settings[key]).forEach((setting) => {
        const settingValue = settings[key][setting];
        input.setAttribute(setting, settingValue);
      });
    }

    label.appendChild(input);
    dom.appendChild(label);

    input.addEventListener("input", (evt) => {
      onUpdate({
        [key]: parseFloat((evt.currentTarget as HTMLInputElement).value),
      });
    });
  });
}

const controlsContainer = document.querySelector<HTMLElement>(".controls");

controls(
  controlsContainer,
  coolSpringProperites,
  { stiffness: { step: 10 } },
  (values) => {
    coolSpring.setProperties(values);
    coolSpringProperites = {
      ...coolSpringProperites,
      ...values,
    };
    coolSpring.reset();
  }
);
