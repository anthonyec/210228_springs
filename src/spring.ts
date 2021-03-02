export interface SpringInitialValues {
  x: number;
  v: number;
}

export interface SpringProperties {
  stiffness: number;
  mass: number;
  damping: number;
}

export interface EnviromentProperties {
  frameRate: number;
}

interface SpringUpdate {
  /** Spring position */
  x: number;

  /** Spring velocity */
  v: number;
}

interface Spring {
  addVelocity: (velocity: number) => void;
  setLength: (length: number) => void;
  setProperties: (props: SpringProperties) => void;
  update: () => SpringUpdate;
  reset: () => void;
}

const DEFAULT_INITIAL_VALUES: SpringInitialValues = {
  x: 0,
  v: 0,
};

export function createSpring(
  // TODO: Extend default initial values
  initialValues: SpringInitialValues,
  springProperties: SpringProperties,
  enviroment: EnviromentProperties = {
    frameRate: 60,
  }
): Spring {
  let spring = springProperties;
  const frameTime = 1 / enviroment.frameRate;

  /* Spring Length, set to 1 for simplicity */
  let springLength = initialValues.x;

  /* Object position and velocity. */
  let x = initialValues.x;
  let v = initialValues.v;

  /* Spring stiffness, in kg / s^2 */
  let k = -spring.stiffness;
  let d = -spring.damping;

  return {
    addVelocity(velocity: number) {
      console.log("addVelocity");
      v += velocity;
    },
    setLength(length: number) {
      springLength = length;
    },
    setProperties(props: SpringProperties) {
      // TODO: Update these values in a better way
      spring = {
        ...spring,
        ...props,
      };

      k = -spring.stiffness;
      d = -spring.damping;
    },
    update(): SpringUpdate {
      let Fspring = k * (x - springLength);
      let Fdamping = d * v;
      let a = (Fspring + Fdamping) / spring.mass;

      v += a * frameTime;
      x += v * frameTime;

      return {
        v,
        x,
      };
    },
    reset() {
      v = 0;
      x = 0;
      springLength = 0;
    },
  };
}
