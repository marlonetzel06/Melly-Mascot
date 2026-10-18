// Alle Posen. Neue Pose: Datei in src/poses/ anlegen und hier eintragen.
import p0 from './poses/idle.js';
import p1 from './poses/umschauen.js';
import p2 from './poses/drehung.js';
import p3 from './poses/laufen.js';
import p4 from './poses/reinlaufen-hallo.js';
import p5 from './poses/tschuess.js';
import p6 from './poses/winken.js';
import p7 from './poses/jubeln.js';
import zeigen from './poses/zeigen-varianten.js'; // 24 Varianten (Winkel × Ansicht × Seite)
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
import p36 from './poses/laptop-raus.js';
import p37 from './poses/laptop-weg.js';
import p38 from './poses/hinlegen.js';
import p39 from './poses/aufstehen.js';
import p40 from './poses/liegen-boden.js';
import p41 from './poses/muede.js';
import p42 from './poses/blick-links.js';
import p43 from './poses/blick-rechts.js';
import p44 from './poses/hinsetzen.js';
import p45 from './poses/aufstehen-sitz.js';
import * as core from './core.js';
import * as props from './props.js';
import * as model from './model.js';
import { OUTFITS, getOutfit } from './outfits.js';

export const LIB = { ...model, ...core, ...props };
export const POSES = [p0, p1, p2, p3, p4, p5, p6, p7, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, ...zeigen];
export const CATEGORIES = ['Bewegung', 'Arbeit', 'Reaktion', 'Alltag', 'Kante', 'Zeigen'];
export { OUTFITS, getOutfit };
export const getPose = id => POSES.find(p => p.id === id);

/** Frames einer Pose. outfit: Outfit-ID, null = ohne Outfit, undefined = Outfit der Pose (pose.outfit). */
export const buildFrames = (pose, outfit) => {
  const o = getOutfit(outfit === undefined ? pose.outfit : outfit);
  if (!o) return pose.frames(LIB);
  const frame = (mods, ms, opt = {}) => core.frame(mods, ms, { ...opt, outfit: o });
  return pose.frames({ ...LIB, frame, walkFrames: (count, cfg) => core.walkFrames(count, cfg, frame) });
};
/** Passt die Pose zum Outfit? (pose.hat === false schließt Outfits mit Kopfbedeckung aus; alle Ansichten der Pose haben Outfit-Layer; Frames mit eigener Figur, z. B. Liegen, brauchen outfit.figures) */
export const fitsOutfit = (pose, outfit) => { const o = getOutfit(outfit); return !!o && !(o.hat && pose.hat === false) && pose.frames(LIB).every(f => f.figures.length ? f.figures.every(id => o.figures?.[id]) : o.layers[f.view]); };
