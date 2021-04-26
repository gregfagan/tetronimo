import { keys, pause } from './util';
import { keypress } from '../lib/stream/dom';
import { playSound, currentBeat, initializeAudio, BPM } from './audio';
import {
  state,
  Left,
  Right,
  Up,
  Down,
  moveTetronimo,
  rotateTetronimo,
  generateNewState,
  stepState,
  isGameRunning,
  wallCollisions,
  initialMovement,
} from './state';
import { event, filter, log, stream } from '../lib/stream';
export { draw } from './render';
import './ui';

let destroyAudio: Function;
// This stream "debounces" the end of the game so that if the
// player is mashing the buttons, they don't immediately skip
// into a new game.
const canStartNewGame = stream.of(true);
stream.on(() => {
  destroyAudio();
  canStartNewGame(false);
  setTimeout(() => canStartNewGame(true), 750);
}, wallCollisions);

const startNewGame = (pressedKey: string) => {
  if (state().currentBeat > 0) {
    state(generateNewState());
    isGameRunning(true);
    destroyAudio = initializeAudio();
  } else if (pressedKey === initialMovement) {
    isGameRunning(true);
    destroyAudio = initializeAudio();
  }

  if (isGameRunning()) BPM(100);
};

// Respond to the main controls
[
  keypress('a'),
  keypress('s'),
  keypress('d'),
  keypress('q'),
  keypress('w'),
  keypress('e'),
]
  .reduce(stream.merge)
  .map(({ key }) => {
    if (!isGameRunning()) {
      if (canStartNewGame()) startNewGame(key);
    }

    if (isGameRunning()) {
      playSound();
      const key = keys();
      if (key.a) state(moveTetronimo(state(), Left));
      if (key.s) state(moveTetronimo(state(), Down));
      if (key.d) state(moveTetronimo(state(), Right));
      if (key.w) state(moveTetronimo(state(), Up));
      if (key.e) state(rotateTetronimo(state(), 1));
      if (key.q) state(rotateTetronimo(state(), -1));
    }
  });

// Update game, but only when it's running, on the current beat.
stream.on(
  () => state(stepState(state(), state().currentBeat + 1)),
  filter(() => isGameRunning(), currentBeat)
);
