// Mimik-Set (Standbilder, Ansicht vorne). mods(lib) liefert die Bausteine.
export const EXPRESSIONS = [
  { id: 'neutral', title: 'neutral', mods: () => [] },
  { id: 'froehlich', title: 'fröhlich', mods: L => [L.happy] },
  { id: 'zwinkern', title: 'zwinkern', mods: L => [L.wink] },
  { id: 'zeig-mal', title: '„Zeig mal.“', mods: L => [L.skep] },
  { id: 'ueberrascht', title: 'überrascht', mods: L => [L.ohMouth] },
  { id: 'konzentriert', title: 'konzentriert', mods: L => [L.effort] },
  { id: 'fast', title: '„Fast.“', mods: L => [L.almost] },
  { id: 'schlaefrig', title: 'schläfrig', mods: L => [L.sleepy, L.zSlot(0)] },
  { id: 'begeistert', title: 'begeistert', mods: L => [L.happy, L.spark(-2, 3, true), L.spark(22, 4, false)] },
  { id: 'sauer', title: 'sauer', mods: L => [L.angry], opt: L => ({ pal: L.RED[3] }) }
];
