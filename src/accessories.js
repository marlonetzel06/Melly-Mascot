// Melly – Accessoires: kleine Extras, die man an- und ausschalten und auf jede Kombi und jedes Outfit legen kann.
// Aufbau wie ein Outfit (layers/after je Ansicht), aber ohne Anzug-/Akzentfarben; eigene Tokens (M) dürfen in keinem Outfit vorkommen,
// damit sie mit jedem Outfit kombinierbar bleiben. Bisher nur Ansicht vorne (F).

/** Brillengestell: zwei runde Gläser (das Auge liegt innen am Rahmen an), Steg oben in der Mitte, Bügel zu den Kopfseiten. */
const FRAME = [];
[[5, 9], [12, 16]].forEach(([l, r]) => {
  for (let x = l + 1; x <= r - 1; x++) FRAME.push([x, 3], [x, 8]);
  for (let y = 4; y <= 7; y++) FRAME.push([l, y], [r, y]);
});
FRAME.push([10, 4], [11, 4], [4, 4], [17, 4]);
/** Brille: Gestell in Farbe c, Bäckchen rücken nach außen. tape = Tape um den Steg. */
const glasses = (tape, c = 'k') => (p, S) => {
  FRAME.forEach(([x, y]) => S(x, y, c));
  S(4, 7, 'P'); S(17, 7, 'P');
  if (tape) { S(10, 4, 'W'); S(11, 4, 'w'); S(10, 5, 'W'); S(11, 5, 'w'); }
};
/** Mimik (Lachen, Zwinkern) räumt die Augenzone mit Creme frei und reißt dabei das Gestell auf:
 *  danach jedes Gestell-Pixel neu setzen, das jetzt Creme ist. Augen, Hände und Objekte darüber bleiben. */
const glassesRepair = (c = 'k') => (p, S, opt, get) => {
  const hd = opt.headDy || 0;
  FRAME.forEach(([x, y]) => { if (get(x, y + hd) === 'C') S(x, y, c); });
};

/** Over-Ear-Kopfhörer: Bügel liegt direkt auf dem Kopf (dunkel genug gegen Creme), Muscheln an den Kopfseiten auf Augenhöhe (Noten steigen in der Pose „musik“ auf). */
const headphones = (p, S) => {
  for (let x = 6; x <= 15; x++) S(x, 0, 'G');
  [[5, 1], [6, 1], [4, 2], [3, 3], [15, 1], [16, 1], [17, 2], [18, 3]].forEach(([x, y]) => S(x, y, 'G'));
  for (let y = 4; y <= 8; y++) { S(1, y, 'g'); S(2, y, 'g'); S(3, y, 'G'); S(18, y, 'G'); S(19, y, 'g'); S(20, y, 'g'); }
};

/** Konferenz-Badge: Band in eigener Event-Farbe (M, hebt sich von Krawatte und Anzug ab) vom Kragen, Karte unter dem Krawattenknoten (dunkle Kopfzeile, graue Namenszeilen). */
const badge = (p) => {
  for (let y = 9; y <= 12; y++) { p(8, y, 'M'); p(13, y, 'M'); }
  for (let x = 8; x <= 13; x++) { p(x, 13, 'G'); p(x, 14, 'W'); p(x, 15, 'W'); p(x, 16, 'W'); }
  p(9, 14, 'g'); p(10, 14, 'g'); p(11, 14, 'g'); p(9, 15, 'w'); p(10, 15, 'w'); p(13, 14, 'w'); p(13, 15, 'w'); p(13, 16, 'w');
};

export const ACCESSORIES = [
  { id: 'brille', title: 'Brille', desc: 'Klassische schwarze Brille mit runden Gläsern.', layers: { F: () => [glasses(false)] }, after: { F: () => [glassesRepair()] } },
  { id: 'nerdbrille', title: 'Nerd-Brille', desc: 'Schwarze Brille mit Tape am Steg.', layers: { F: () => [glasses(true)] }, after: { F: () => [glassesRepair()] } },
  { id: 'kopfhoerer', title: 'Kopfhörer', desc: 'Over-Ear-Kopfhörer, Fokus-Modus.', layers: { F: () => [headphones] } },
  { id: 'badge', title: 'Konferenz-Badge', desc: 'Namensschild am Band in Event-Farbe, für Konferenz- und Meetup-Posts.', pal: { M: '#2BB3C0' }, layers: { F: () => [badge] } }
];

export const getAccessory = id => ACCESSORIES.find(a => a.id === id);
