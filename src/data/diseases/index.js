import cap from './cap.js';
import pyelo from './pyelo.js';
import gastro from './gastro.js';
import adhf from './adhf.js';
import dka from './dka.js';
import appendicitis from './appendicitis.js';

export const DISEASES = [cap, pyelo, gastro, adhf, dka, appendicitis];
export const DISEASE_BY_ID = Object.fromEntries(DISEASES.map((d) => [d.id, d]));
