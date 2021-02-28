export interface SpringProperties {
  stiffness: number;
  mass: number;
  damping: number;
}

export interface EnviromentProperties {
  frameRate: number;
}

interface Spring {}

interface SpringUpdate {
  /** Spring position */
  x: number;

  /** Spring velocity */
  v: number;
}

export function createSpring(
  spring: SpringProperties,
  enviroment: EnviromentProperties = {
    frameRate: 1 / 60
  }
): Spring {
  /* Spring Length, set to 1 for simplicity */
  let springLength = 10;

  /* Object position and velocity. */
  let x = 0;
  let v = 0;

  /* Spring stiffness, in kg / s^2 */
  let k = -spring.stiffness;

  let d = -spring.damping;

  return {
    addVelocity(velocity: number) {
      console.log('addVelocity');
      v += velocity;
    },
    setLength(length: number) {
      springLength = length;
    },
    update(): SpringUpdate {
      let Fspring = k * (x - springLength);
      let Fdamping = d * v;
      let a = (Fspring + Fdamping) / spring.mass;

      v += a * enviroment.frameRate;
      x += v * enviroment.frameRate;

      return {
        v, x
      }
    }
  }
}
