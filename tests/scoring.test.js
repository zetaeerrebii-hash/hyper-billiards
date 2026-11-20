// Test dei punteggi: estrae le funzioni di regolamento da src/js/core.js e le verifica su tiri campione.
// Uso: node tests/scoring.test.js   (nessuna dipendenza)
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'core.js'), 'utf8');
const grab = n => { const i = src.indexOf('function ' + n + '('); let d = 0; const j = src.indexOf('{', i);
  for (let k = j; k < src.length; k++) { if (src[k] === '{') d++; if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } } };
const plural = (n, a, b) => n + ' ' + (n > 1 ? b : a);
eval(grab('pinCount') + grab('pinNames') + grab('negResult') + grab('evaluate'));

const E = o => Object.assign({ shooter: 'w', opp: 'y', first: 'y', railsBefore: [], pins: [], pinsBeforeFirst: false,
  palFirstLegit: null, palTouched: false }, o);
const P = (t, by, cls) => ({ t, by, cls: cls || 'ok' });

const cases = [
  // [gioco, descrizione, evento, a chi, punti]
  ['gor', '2 interni diretti', E({ pins: [P('int', 'y'), P('int', 'y')] }), 'me', 16],
  ['gor', 'rosso da solo', E({ pins: [P('red', 'y')] }), 'me', 30],
  ['gor', 'rosso da solo di sponda (indiretto)', E({ railsBefore: ['short'], pins: [P('red', 'y')] }), 'me', 60],
  ['gor', 'pallino', E({ palFirstLegit: 'y', palTouched: true }), 'me', 6],
  ['gor', 'pallino di sponda', E({ railsBefore: ['long'], palFirstLegit: 'w', palTouched: true }), 'me', 12],
  ['gor', 'bilia avversaria mancata', E({ first: null, railsBefore: ['long', 'short'] }), 'opp', 2],
  ['gor', 'pallino colpito per primo', E({ first: 'r', palTouched: true }), 'opp', 4],
  ['gor', 'birilli con la propria prima dell\'avversaria, poi sponde', E({ first: null, pinsBeforeFirst: true, railsBefore: ['long'], pins: [P('int', 'w', 'own'), P('red', 'w', 'own')] }), 'opp', 20],
  ['gor', 'propria sui birilli dopo l\'avversaria', E({ pins: [P('ext', 'w', 'own')] }), 'opp', 2],
  ['gor', 'positivi e negativi insieme', E({ pins: [P('ext', 'w', 'own'), P('ext', 'y')] }), 'opp', 4],
  ['ita', '2 bianchi', E({ pins: [P('ext', 'y'), P('ext', 'y')] }), 'me', 4],
  ['ita', 'rosso con un bianco', E({ pins: [P('ext', 'y'), P('red', 'y')] }), 'me', 6],
  ['ita', 'rosso da solo', E({ pins: [P('red', 'y')] }), 'me', 10],
  ['ita', 'pallino dalla propria', E({ palFirstLegit: 'w', palTouched: true }), 'me', 4],
  ['ita', 'pallino dall\'avversaria', E({ palFirstLegit: 'y', palTouched: true }), 'me', 3],
  ['ita', 'nessun raddoppio di sponda', E({ railsBefore: ['short'], pins: [P('red', 'y')] }), 'me', 10],
  ['ita', 'mancata', E({ first: null }), 'opp', 2],
  ['ita', 'pallino per primo', E({ first: 'r', palTouched: true }), 'opp', 6],
  ['ita', 'birilli prima dell\'avversaria', E({ pinsBeforeFirst: true, pins: [P('ext', 'w', 'own')] }), 'opp', 4],
];
let fail = 0;
for (const [g, name, ev, to, pts] of cases) {
  const r = evaluate(ev, g), ok = r.to === to && r.pts === pts;
  if (!ok) fail++;
  console.log((ok ? 'ok  ' : 'FAIL') + ' ' + g + ' · ' + name + ' → ' + r.to + ' ' + r.pts + (ok ? '' : ' (atteso ' + to + ' ' + pts + ')'));
}
console.log(fail ? fail + ' test falliti' : 'Tutti i ' + cases.length + ' test superati');
process.exit(fail ? 1 : 0);
