# Migrazione nell'account team (Regia HYPER FALSE)

Aggiornato il 20/11/2026. Il progetto entra nella Regia come gruppo **`HF_APP_HYPER BILLIARDS`**.

## Dove vive cosa

| Cosa | Dove | Chi lo aggiorna |
|---|---|---|
| Codice, build, test, documenti tecnici (`docs/`), `STATO.md` | **GitHub** `<organizzazione>/hyper-billiards` · fonte di verità | Claude Code, con pull request |
| Decisioni, discussioni per filone, conoscenza | **Progetto Claude** `HF_APP_HYPER BILLIARDS` | soci + Claude; i documenti cambiati si ricaricano a fine ciclo |
| Copie per il team (STATO, HF_CORE, build giocabile, riferimenti PDF) | **Google Drive** `02.AI/000. HYPER FALSE/6. HF_APP/1 HYPER BILLIARDS` | a fine ciclo |
| HF_CORE (originale) | Progetto centro **HYPER FALSE** | Custode del brand |
| Pagina di prova del team | Artefatto «HYPER BILLIARDS · test» (sempre lo stesso link) | si ripubblica da `dist/artifact.html` |

> **Non sviluppare dentro Google Drive.** La sincronizzazione di Drive e la cartella `.git` non vanno d'accordo (file bloccati, repository corrotti). In Drive c'è una copia di riferimento del codice; si lavora su un clone locale, per esempio `C:\dev\hyper-billiards`.

## 1. Repository GitHub (lo fai tu, con l'account proprietario)
1. Verifica di poter creare repository nell'organizzazione (ruolo *owner* o permesso di creazione).
2. `zetaeerrebii-hash/maestria-goriziana` → **Settings → General → Danger Zone → Transfer ownership** → organizzazione.
3. Nell'organizzazione: **Settings → General → Repository name** → `hyper-billiards` (GitHub reindirizza i vecchi indirizzi).
4. Clona fuori da Drive e applica le modifiche della migrazione:
   ```bash
   cd C:\dev
   git clone https://github.com/<organizzazione>/hyper-billiards.git
   cd hyper-billiards
   git switch -c migrazione-team
   git am "K:\Il mio Drive\02.AI\000. HYPER FALSE\6. HF_APP\1 HYPER BILLIARDS\01_CODICE\0001-migrazione-team.patch"
   git push -u origin migrazione-team
   ```
   Se `git am` non si applica (il repository era diverso dallo zip), copia sopra al clone il contenuto di `01_CODICE/hyper-billiards/` e fai commit.
5. Apri la pull request `migrazione-team` → `main` e verifica che la CI sia verde; poi unisci.
6. **Settings → Pages**: *Deploy from a branch*, `main`, `/ (root)`. Indirizzo: `https://<organizzazione>.github.io/hyper-billiards/`. Con repository privato serve un piano a pagamento (oppure Netlify, Vercel, Cloudflare Pages).
7. **Settings → Branches**: proteggi `main` (pull request obbligatoria, controllo «CI / verifica» richiesto).

## 2. Artefatto su claude.ai
Non si trasferisce: si ripubblica dall'account team da `dist/artifact.html` (documento HTML completo). Pubblicato il 20/11/2026 come «HYPER BILLIARDS · test» (https://claude.ai/artifact/Mtr6DrYCnCt1meiQhp4MqF), privato finché un socio non decide di condividerlo. Il vecchio link personale resta valido finché non lo elimini: avvisa chi lo usa.

## 3. Progetto Claude
- Nome attuale: `HF_APP_HYPER BILLIARDS` (convenzione Regia: `HF_APP_NOME`).
- Istruzioni da incollare: `02_PROGETTO_CLAUDE/ISTRUZIONI_PROGETTO.txt` nella cartella Drive (testo anche in [PROGETTO-CLAUDE.md](PROGETTO-CLAUDE.md)).
- Conoscenza già caricata: HF_CORE (segnaposto), STATO, CONTESTO-PROGETTO, REGOLE, ARCHITETTURA, ROADMAP, COMMERCIALE, MIGRAZIONE. Da aggiungere a mano: PDF del regolamento FIBIS e foto di riferimento del tavolo.
- La memoria dell'account personale non passa: tutto ciò che serve è nei documenti.

## 4. Dati che non si trasferiscono
Giocatori da selfie, vista e zoom preferiti stanno nel `localStorage` del browser per quel dominio: con il nuovo artefatto o il nuovo dominio ripartono da zero. Avvisa chi li aveva creati.

## 5. Controllo finale
- [x] `python3 tools/build.py`, `node tests/scoring.test.js` (19/19) e `npm run smoke` funzionano (20/11/2026, in cloud)
- [x] artefatto team pubblicato e provato (pianta, 3D, telefono)
- [ ] repository trasferito, rinominato, CI verde sulla pull request di migrazione
- [ ] GitHub Pages attivo, partita contro il computer fino al punteggio finale dal sito pubblico
- [ ] HF_CORE ufficiale al posto del segnaposto
- [ ] gruppo registrato nel centro (REGISTRO_GRUPPI) e scheda test in HF_APP
- [ ] responsabile per i punti di [COMMERCIALE.md](COMMERCIALE.md)

## 6. Scheda test retroattiva da registrare in HF_APP
La Regia apre un gruppo `HF_APP_NOME` solo dopo il test in HF_APP. HYPER BILLIARDS arriva già sviluppato: proposta da copiare in HF_APP.

```
Idea: HYPER BILLIARDS (ex Maestria Goriziana)
Problema: imparare traiettorie, sponde e punteggi del biliardo all'italiana senza un istruttore sempre presente
Pubblico (da validare): giocatori di circolo, principianti, scuole di biliardo
Modello di ricavo (da validare): Scuola premium · licenza ai circoli (white label) · partnership con federazioni o riviste
Prototipo: pagina web giocabile, goriziana e 5 birilli FIBIS, 3D, computer a 5 livelli
Criteri di test: build e test verdi; partita completa su telefono; consigli di tiro coerenti con la fisica; nessun contenuto bloccante per la vendita non tracciato
Esito: PROMOSSA il 20/11/2026 → gruppo HF_APP_HYPER BILLIARDS
Riserve: diritti su ritratti, contenuti dei manuali e marchio (COMMERCIALE.md, bloccanti 1–4)
```
