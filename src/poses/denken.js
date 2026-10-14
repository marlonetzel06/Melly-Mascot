// Pose: Denken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'denken',
  title: 'Denken',
  category: 'Arbeit',
  desc: 'Führt die Hand über eine Zwischenposition ans Kinn, Zeigefinger tippt, Blick wandert zur Seite (Braue hoch) und nach oben, Denkpunkte steigen nacheinander auf, Hand geht zurück.',
  still: 11,
  frames: ({ frame, n, look, blink, skep1, chin, dot }) => {
    const d1 = dot(19, 1, 1), d2 = dot(20, -2, 2), d3 = dot(22, -6, 3);
    return [
      frame(n, 400),
      frame([chin(1)], 80),                                    // Hand über Zwischenpositionen ans Kinn
      frame([chin(2)], 70),
      frame([chin(3)], 300),
      frame([chin(3), look(1), skep1], 450),                   // Blick zur Seite, Braue hoch
      frame([chin(3, true), look(1), skep1], 140),             // Finger tippt
      frame([chin(3), look(1), skep1], 140),
      frame([chin(3, true), look(1), skep1], 140),
      frame([chin(3), look(1), skep1], 300),
      frame([chin(3), look(0, -1), d1], 380),                  // Blick nach oben, Denkpunkte steigen auf
      frame([chin(3), look(0, -1), d1, d2], 380),
      frame([chin(3), look(-1, -1), d1, d2, d3], 1100),
      frame([chin(3), blink, d1, d2, d3], 110),
      frame([chin(3, true), look(-1, -1), d1, d2, d3], 160),
      frame([chin(3), look(-1, -1), d1, d2, d3], 500),
      frame([chin(2)], 70),                                    // Hand zurück
      frame([chin(1)], 80),
      frame(n, 300)
    ];
  }
};
