// Scene registry: the three original picture-hunt scenes of Lantern Lane.
// Each scene draws itself twice — once plain, once with its seven differences
// applied — and lists those differences with their hit-test circles.
import { marketScene } from './scene-market.js';
import { harborScene } from './scene-harbor.js';
import { gardenScene } from './scene-garden.js';

export const SCENES = [marketScene, harborScene, gardenScene];

export function sceneById(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}
