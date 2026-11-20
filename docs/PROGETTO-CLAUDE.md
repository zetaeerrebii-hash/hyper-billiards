# Come strutturare il Progetto Claude del team

Due strumenti, due compiti:
- **Progetto su claude.ai**: dove si decide (regole, contenuti della Scuola, grafica, business).
- **Claude Code collegato al repository**: dove si scrive il codice; legge `CLAUDE.md`, lavora su rami, esegue build e test.

La fonte di verità sono i documenti in `docs/`: il Progetto li consulta, Claude Code li aggiorna.

## 1. Impostazione
**Nome:** HYPER BILLIARDS
**Descrizione:** Gioco e scuola di biliardo all'italiana (goriziana e 5 birilli, regolamento FIBIS). Sviluppo commerciale.

**Istruzioni del progetto** (da incollare):

```
Lavoriamo su HYPER BILLIARDS, gioco e strumento di apprendimento per il biliardo all'italiana con la stecca (goriziana 9 birilli e italiana 5 birilli, regolamento FIBIS). Rispondi in italiano.

Fonti di verità, in quest'ordine: i documenti del progetto (CONTESTO-PROGETTO, REGOLE, ARCHITETTURA, ROADMAP, COMMERCIALE), poi i regolamenti FIBIS, poi i manuali. Se una richiesta contraddice una decisione registrata in CONTESTO-PROGETTO, segnalalo prima di procedere.

Precisione: misure reali del tavolo (2840 x 1420 mm, diamanti ogni 355 mm, 9 sulle lunghe e 5 sulle corte), punteggi verificabili. Quando proponi una regola, cita l'articolo del regolamento; se è un'interpretazione, dillo.

In queste conversazioni si decide e si progetta; il codice si scrive nel repository con Claude Code. Quando una decisione è presa, chiudi con un riepilogo pronto da aggiungere a CONTESTO-PROGETTO.md, nella forma "Decisione · motivo · data".

Per diritti, marchi, privacy dei ritratti e contenuti dei manuali, fai riferimento a COMMERCIALE.md e ricorda che non sostituisci un legale.
```

**Conoscenza:** `docs/CONTESTO-PROGETTO.md` (il più importante), `docs/REGOLE.md`, `docs/ARCHITETTURA.md`, `docs/ROADMAP.md`, `docs/COMMERCIALE.md`, il regolamento FIBIS in PDF, la foto di riferimento del tavolo. I manuali (Margutti, Bibbia del biliardo) solo se avete il diritto di usarli internamente. Non caricare il codice: il riferimento è il repository.

## 2. Conversazioni
Una per filone, con prefisso nel titolo: **[Regole]**, **[Gioco]** (fisica, computer), **[Grafica]**, **[Scuola]**, **[Business]**. Meglio conversazioni brevi e documenti aggiornati che un'unica conversazione infinita.

## 3. Ciclo di lavoro
1. Decidi nel Progetto; Claude chiude con il riepilogo della decisione.
2. Implementa con Claude Code su un ramo, incollando il riepilogo e chiedendo di aggiornare `CONTESTO-PROGETTO.md`; build, test e prova nel browser.
3. Revisione della pull request e unione.
4. Prova di squadra su un solo artefatto "HYPER BILLIARDS · test", ripubblicato sempre allo stesso link.
5. Sostituisci nel Progetto i documenti cambiati.

## 4. Persone
- Chi ha l'ultima parola sulle regole (giocatore esperto o arbitro).
- Accesso in modifica al Progetto solo a chi decide, in lettura agli altri.
- Un responsabile della checklist COMMERCIALE.

## 5. Memoria
La memoria dell'account personale non passa all'account team: ciò che Claude deve sapere sta nei documenti. Per questo ogni ciclo si chiude aggiornando `CONTESTO-PROGETTO.md`.
