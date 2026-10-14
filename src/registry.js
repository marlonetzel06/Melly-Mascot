// Alle Posen. Neue Pose: Datei in src/poses/ anlegen und hier eintragen.
import p0 from './poses/idle.js';
import p1 from './poses/umschauen.js';
import p2 from './poses/drehung.js';
import p3 from './poses/laufen.js';
import p4 from './poses/reinlaufen-hallo.js';
import p5 from './poses/tschuess.js';
import p6 from './poses/winken.js';
import p7 from './poses/jubeln.js';
import p8 from './poses/zeigen.js';
import p9 from './poses/schild.js';
import p10 from './poses/schild-platzhalter.js';
import p11 from './poses/checkliste.js';
import p12 from './poses/bug-gefunden.js';
import p13 from './poses/laptop.js';
import p14 from './poses/handy.js';
import p15 from './poses/idee.js';
import p16 from './poses/denken.js';
import p17 from './poses/sauer.js';
import p18 from './poses/daumen-hoch.js';
import p19 from './poses/schulterzucken.js';
import p20 from './poses/facepalm.js';
import p21 from './poses/zeig-mal.js';
import p22 from './poses/ungeduldig.js';
import p23 from './poses/zwinkern.js';
import p24 from './poses/kaffee.js';
import p25 from './poses/gaehnen.js';
import p26 from './poses/schlafen.js';
import p27 from './poses/gym.js';
import p28 from './poses/fussball.js';
import p29 from './poses/kochen.js';
import p30 from './poses/telefonieren.js';
import p31 from './poses/weihnachtsmann.js';
import p32 from './poses/sitzen.js';
import p33 from './poses/sitzen-schlafen.js';
import p34 from './poses/liegen-schlafen.js';
import p35 from './poses/schneidersitz.js';
import * as core from './core.js';
import * as props from './props.js';
import * as model from './model.js';
import { OUTFITS, getOutfit } from './outfits.js';

export const LIB = { ...model, ...core, ...props };
export const POSES = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35];
export const CATEGORIES = ['Bewegung', 'Arbeit', 'Reaktion', 'Alltag', 'Kante'];
export { OUTFITS, getOutfit };
export const getPose = id => POSES.find(p => p.id === id);

/** Frames einer Pose. outfit: Outfit-ID, null = ohne Outfit, undefined = Outfit der Pose (pose.outfit). */
export const buildFrames = (pose, outfit) => {
  const o = getOutfit(outfit === undefined ? pose.outfit : outfit);
  if (!o) return pose.frames(LIB);
  return pose.frames({ ...LIB, frame: (mods, ms, opt = {}) => core.frame(mods, ms, { ...opt, outfit: o }) });
};
/** Passt die Pose zum Outfit? (alle Ansichten der Pose haben Outfit-Layer) */
export const fitsOutfit = (pose, outfit) => { const o = getOutfit(outfit); return !!o && pose.frames(LIB).every(f => o.layers[f.view]); };
