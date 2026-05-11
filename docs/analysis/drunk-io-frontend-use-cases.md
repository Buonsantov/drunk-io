# drunk-io — Use Cases Frontend

> **Versione**: 1.0  
> **Data**: 2025  
> **Estende**: `docs/analysis/drunk-io-use-cases.md` con dettagli interazione UI  
> **Riferimento**: `docs/requirements/drunk-io-frontend-requirements.md`, `docs/analysis/drunk-io-frontend-analysis.md`

---

## UC-FE-01 — Primo Accesso: Accettazione Informativa Cookie

### Dettaglio Interazione UI

**Layout mobile (xs/sm)**:
- Schermata full-width con logo in cima
- Testo informativa in card Bootstrap Italia, scrollabile se necessario
- Bottone "Accetto" sticky in fondo o chiaramente visibile senza scroll

**Layout desktop (md+)**:
- Contenuto centrato con max-width 768px
- Testo su colonna singola
- Bottone "Accetto" sotto il testo

**Interazioni disponibili**:
- Click bottone "Accetto" → salvaInfo(true,true) → navigazione `/#/`
- Click link "FAQ" → navigazione `/#/faq` (nuova tab o stessa pagina)
- Click link "Contatti" → navigazione `/#/contatti`
- Click "Revoca consenso" (visibile solo se già accettato) → modale conferma

**Stato cookie/profilo richiesto**: Nessuno (schermata sempre accessibile)

### Comportamento Mobile vs Desktop
| Aspetto | Mobile | Desktop |
|---|---|---|
| Bottone "Accetto" | Full-width, padding 16px, tasto visibile senza scroll (sticky) | Larghezza auto, centrato sotto il testo |
| Testo informativa | Font 16px, line-height 1.6, margini laterali 16px | Font 16px, max-width 600px |
| Scroll | Verticale se testo lungo | Normalmente non necessario |

### Gestione Errori UI
- Nessun errore possibile (schermata statica con sola azione di accettazione)
- Se `salvaInfo()` fallisce (raro — es. cookie disabilitati nel browser): mostrare toast di errore con messaggio "Non è possibile salvare le preferenze. Verifica le impostazioni del browser."

### Comportamento Offline (PWA)
- Schermata completamente disponibile offline (asset cached da service worker)
- L'accettazione può avvenire offline (cookie salvato localmente)

### Accessibilità WCAG 2.1 AA
- `<main>` come landmark per il contenuto principale
- Titolo `<h1>` con testo "Informativa Cookie e Privacy"
- Bottone "Accetto" con `type="button"` e testo leggibile da screen reader
- Link "Revoca" con testo descrittivo (non solo icona)
- Nessun elemento solo con colore per indicare stati
- `aria-label` su icona decorativa logo

---

## UC-FE-02 — Creazione Nuovo Profilo

### Dettaglio Interazione UI

**Componente**: `ProfiloComponent` (route `/#/profilo/0`)

**Layout**:
- Form Bootstrap Italia con card container
- Titolo: "Crea il tuo profilo"
- Campo Nome: `<input type="text">` con label "Nome"
- Campo Sesso: radio button Bootstrap Italia (M / F) con label "Sesso"
- Campo Peso: `<select>` o lista radio con label "Peso" — aggiornata al cambio sesso
- Bottone "Salva profilo" — disabilitato finché form non valido

**Interazioni passo-passo**:
1. L'utente focus su campo "Nome" (autofocus al caricamento)
2. Digita il nome → validazione live (min 1 carattere)
3. Seleziona sesso → lista pesi aggiornata dinamicamente (FormControl sesso.valueChanges)
4. Seleziona peso dalla lista
5. Bottone "Salva" si abilita
6. L'utente clicca "Salva" → loading state sul bottone
7. Validazione Angular → setUser() → setProfiloSelezionato() → navigate '/'

**Mobile vs Desktop**:
| Aspetto | Mobile | Desktop |
|---|---|---|
| Form | Stack verticale, campi full-width | Max-width 480px, centrato |
| Radio sesso | Side-by-side orizzontale | Side-by-side orizzontale |
| Select peso | Dropdown nativa mobile | Dropdown custom Bootstrap Italia |
| Bottone "Salva" | Full-width | Larghezza auto, allineato a destra |

### Gestione Errori UI
- Nome vuoto: messaggio inline rosso sotto il campo: "Il nome è obbligatorio"
- Sesso non selezionato: messaggio inline: "Seleziona il sesso"
- Peso non selezionato: messaggio inline: "Seleziona il peso"
- Tutti gli errori mostrati on-submit (non on-blur per UX meno invasiva)

### Comportamento Offline
- Form completamente funzionale offline (nessuna dipendenza di rete)
- Salvataggio in cookie locale

### Accessibilità WCAG 2.1 AA
- `<fieldset>` + `<legend>` per il gruppo radio sesso: "Seleziona il tuo sesso"
- `<fieldset>` + `<legend>` per il gruppo radio peso: "Seleziona il tuo peso"
- `aria-required="true"` su tutti i campi obbligatori
- `aria-describedby` su ogni campo per puntare al messaggio di errore
- Bottone disabilitato con `aria-disabled="true"` e `disabled` attribute
- Focus visibile su tutti i campi (outline Bootstrap Italia)

---

## UC-FE-03 — Modifica Profilo Esistente

### Dettaglio Interazione UI

**Componente**: `ProfiloComponent` (route `/#/profilo/:id`)

**Differenze rispetto a UC-FE-02**:
- Titolo: "Modifica profilo — [Nome profilo]"
- Form pre-popolato con valori correnti
- Bottone "Annulla" che torna a `/#/profili` senza salvare
- Bottone "Salva modifiche" (non "Salva profilo")

**Interazioni**:
- Cambio sesso → lista pesi aggiornata + selezione peso resettata
- Click "Annulla" → navigate '/profili'
- Click "Salva modifiche" → setUser(profiloAggiornato) → navigate '/profili'

**Mobile vs Desktop**: identico a UC-FE-02 con aggiunta del bottone "Annulla" side-by-side a "Salva" su desktop, e stack verticale su mobile (prima "Salva", poi "Annulla").

### Gestione Errori UI
- Identico a UC-FE-02
- In caso di profilo non trovato (ID inesistente): toast errore + redirect `/profili`

### Accessibilità WCAG 2.1 AA
- Identico a UC-FE-02
- Bottone "Annulla" con `type="button"` e colore diverso da "Salva" (Bootstrap Italia `btn-secondary`)

---

## UC-FE-04 — Selezione Profilo Attivo

### Dettaglio Interazione UI

**Componente**: `ProfiliComponent` (route `/#/profili`)

**Layout**:
- Titolo: "I tuoi profili"
- Lista card: una per profilo (nome, sesso, peso)
- Profilo attivo: badge "Attivo" + border/colore Bootstrap Italia
- Per profilo non attivo: bottone "Seleziona"
- Per ogni profilo: bottoni "Modifica" e "Elimina"
- Bottone "+ Nuovo profilo" in fondo o in cima

**Interazioni**:
- Click "Seleziona" su profilo → setProfiloSelezionato() → BehaviorSubject update → navigate '/'
- Click "Modifica" → navigate '/profilo/:id'
- Click "Elimina" → modale conferma (UC-FE-05)
- Click "+ Nuovo profilo" → navigate '/profilo/0'

**Mobile vs Desktop**:
| Aspetto | Mobile | Desktop |
|---|---|---|
| Lista profili | 1 colonna, card stacked | 2-3 colonne grid Bootstrap |
| Bottoni azione | Stack verticale sotto info profilo | Side-by-side inline |
| Badge "Attivo" | Visibile top-right della card | Visibile top-right della card |

### Gestione Errori UI
- Lista vuota: messaggio "Nessun profilo trovato. Crea il primo profilo." + bottone CTA
- Errore setProfiloSelezionato: toast errore (improbabile)

### Comportamento Offline
- Lista profili da cookie locale → disponibile offline
- Selezione funzionale offline

### Accessibilità WCAG 2.1 AA
- Lista profili con `role="list"` e ogni item con `role="listitem"`
- Profilo attivo: `aria-pressed="true"` o `aria-selected="true"` sul bottone
- Badge "Attivo" non solo visivo: include `<span class="sr-only">profilo attualmente attivo</span>`
- Bottone "Elimina" con aria-label che include il nome del profilo: `aria-label="Elimina profilo Mario"`

---

## UC-FE-05 — Eliminazione Profilo

### Dettaglio Interazione UI

**Componente**: `ProfiliComponent` + `ModalDrunkService`

**Flusso UI**:
1. Click "Elimina" su un profilo
2. `ModalDrunkService` apre modale Bootstrap Italia
3. Modale con titolo "Elimina profilo", testo "Sei sicuro di voler eliminare il profilo **Mario**? Questa azione eliminerà anche tutto lo storico BAC associato."
4. Due bottoni: "Annulla" (secondary) e "Elimina" (danger)
5. Focus automatico sul bottone "Annulla" (prevenzione click accidentale)
6. Click "Elimina" → deleteUser(id) → lista aggiornata + toast conferma

**Mobile vs Desktop**:
| Aspetto | Mobile | Desktop |
|---|---|---|
| Modale | Full-width, slide da sotto | Centrata, max-width 500px |
| Bottoni | Stack verticale (prima "Annulla") | Side-by-side (Annulla | Elimina) |

### Gestione Errori UI
- Modale sempre presente (protezione eliminazione accidentale obbligatoria)
- Post-eliminazione: toast "Profilo eliminato correttamente"
- Se profilo eliminato era attivo: toast "Profilo eliminato. Seleziona un altro profilo."

### Comportamento Offline
- Eliminazione da cookie locale → funzionale offline

### Accessibilità WCAG 2.1 AA
- Modale con `role="dialog"`, `aria-modal="true"`, `aria-labelledby` = id del titolo
- Focus trap all'interno della modale (Tab cicla solo tra elementi interni)
- Chiusura modale con tasto Escape → focus torna al bottone "Elimina" del profilo
- Bottone "Elimina" nella modale con colore rosso + testo "Elimina" (non solo icona)

---

## UC-FE-06 — Calcolo Tasso Alcolemico

### Dettaglio Interazione UI

**Componente**: `CalcoloAlcolemicoComponent` (embedded in `HomeComponent`)

**Layout calcolo**:
```
[Nome profilo attivo]                    [Icona utente]
─────────────────────────────────────────────────────
STOMACO: [● Pieno  ○ Vuoto]

BEVANDE SELEZIONATE:
┌─────────────────────────────────────────────────────┐
│ Birra 33cl      [−] [1] [+]    [× Rimuovi]         │
│ Vino rosso      [−] [1] [+]    [× Rimuovi]         │
└─────────────────────────────────────────────────────┘

[+ Aggiungi bevanda ▼]    [🗑 Svuota lista]

────────────────────────────────────
[        CALCOLA IL TUO BAC        ]
────────────────────────────────────

⚠️ I risultati sono indicativi e non attendibili.
```

**Selezione bevanda** (click "+ Aggiungi bevanda"):
- Dropdown o modal con lista bevande dalla tabella alcolemica
- Ricerca/filtro per nome (COULD)
- Click su bevanda → aggiunta con quantità 1

**Interazioni**:
- Toggle stomaco pieno/vuoto → aggiorna stato locale
- + / − quantità su ogni bevanda → aggiorna quantità (min 1)
- Click "Rimuovi" su bevanda → rimuove dall'array
- Click "Svuota lista" → reset array bevande
- Click "Calcola" (abilitato solo se lista non vuota) → algoritmo BAC → tassoOut

**Mobile vs Desktop**:
| Aspetto | Mobile | Desktop |
|---|---|---|
| Lista bevande | Stack verticale, max-height 250px con scroll | Stack verticale, max-height 350px con scroll |
| Toggle stomaco | Bottoni full-width side-by-side | Bottoni auto-width |
| Bottone "Calcola" | Full-width sticky in fondo | Centrato, larghezza 50% |
| Dropdown bevande | Bottom sheet mobile | Dropdown o modal standard |

### Gestione Errori UI
- Lista bevande vuota + click "Calcola": toast warning "Aggiungi almeno una bevanda"
- Errore caricamento `tabella_alcolemica.json`: banner di errore + bottone "Riprova"
- Quantità 0 o negativa: validazione inline con messaggio "La quantità deve essere almeno 1"

### Comportamento Offline (PWA)
- Funzionamento completo offline (dati da cache service worker)
- Se il JSON non è ancora in cache (primo caricamento offline): messaggio "Connettiti a internet per il primo utilizzo"

### Accessibilità WCAG 2.1 AA
- `<fieldset>` + `<legend>` per il gruppo stomaco: "Stato stomaco"
- Input quantità con `<label>` associata (es. "Quantità birra 33cl")
- Bottoni +/− con `aria-label="Aumenta quantità"` / `aria-label="Diminuisci quantità"`
- Bottone "Calcola" disabilitato: `aria-disabled="true"` + messaggio motivo
- Lista bevande in `<ul>` con `role="list"`
- Annuncio risultato BAC via `aria-live="assertive"` quando appare

---

## UC-FE-07 — Visualizzazione Risultato e Sanzioni

### Dettaglio Interazione UI

**Componente**: `RisultatoAlcolemicoComponent` (embedded in `HomeComponent`)

**Layout**:
```
────────────────────────────────────
  IL TUO TASSO ALCOLEMICO STIMATO
         0,82 g/L
────────────────────────────────────
  FASCIA: ⚠️ ATTENZIONE
  [Indicatore visivo colorato]
────────────────────────────────────
  EFFETTI FISIOLOGICI:
  Stato di euforia, riduzione
  dei tempi di reazione...

  SANZIONI LEGALI:
  Sanzione da €800 a €3.200,
  sospensione patente...
────────────────────────────────────
  ⚠️ DISCLAIMER: Questi dati sono
  indicativi e non attendibili.
  Non usare come riferimento legale.
────────────────────────────────────
  [← Nuovo calcolo]
────────────────────────────────────
```

**Colori fasce BAC**:
| Fascia | Colore Bootstrap Italia | Icona | Testo etichetta |
|---|---|---|---|
| 0.00 g/L | `text-success` / verde | ✅ | NESSUN RISCHIO |
| 0.01–0.49 | `text-warning` / giallo | ⚠️ | BASSA CONCENTRAZIONE |
| 0.50–0.79 | `text-warning` / arancio | ⚠️ | ATTENZIONE |
| 0.80+ | `text-danger` / rosso | 🚫 | VIETATA LA GUIDA |

**Mobile vs Desktop**:
| Aspetto | Mobile | Desktop |
|---|---|---|
| BAC principale | Font 3rem centrato | Font 4rem centrato |
| Disclaimer | In fondo, sempre visibile | In fondo, sempre visibile |
| Bottone "Nuovo calcolo" | Full-width in fondo | Larghezza auto, centrato |

### Gestione Errori UI
- BAC = NaN (caso anomalo): mostrare "Calcolo non disponibile — Riprova" invece del risultato

### Comportamento Offline
- Completamente funzionale offline (dati da cache)

### Accessibilità WCAG 2.1 AA
- BAC annunciato via `aria-live="assertive"` al mount del componente
- Colori fasce: SEMPRE accompagnati da icona + testo descrittivo (non solo colore)
- Disclaimer in `<section aria-label="Avviso importante">`
- Bottone "Nuovo calcolo" con `type="button"` e testo chiaro

---

## UC-FE-08 — Visualizzazione Storico BAC (Grafico)

### Dettaglio Interazione UI

**Componente**: `ChartComponent` (route `/#/chart`)

**Layout**:
```
STORICO BAC — Mario
[7 giorni]  [31 giorni]           [🗑 Cancella storico]

┌─────────────────────────────────────────────────────┐
│                    [Grafico]                        │
│   1.0  │    *                                       │
│   0.8  │       *                                    │
│   0.6  │           *  *                             │
│   0.4  │                   *                        │
│   0.2  │                                            │
│   0.0  └──────────────────────────────              │
│         Lun   Mar   Mer   Gio   Ven                 │
└─────────────────────────────────────────────────────┘
     g/L nel tempo (ultimi 7 giorni)
```

**Interazioni**:
- Toggle 7gg/31gg → filtro applicato → grafico aggiornato (no reload)
- Click "Cancella storico" → UC-FE-09
- Hover/tap su punto grafico → tooltip con data e BAC esatto (Chart.js tooltip)

**Mobile vs Desktop**:
| Aspetto | Mobile | Desktop |
|---|---|---|
| Grafico | Full-width, aspect ratio 1:1 | 75% larghezza, aspect ratio 2:1 |
| Toggle filtro | Side-by-side full-width | Side-by-side auto-width |
| Bottone "Cancella" | Sotto il grafico | Top-right rispetto al grafico |
| Etichette asse X | Solo giorno abbreviato | Giorno + data |

### Gestione Errori UI
- Storico vuoto: `<div>` con messaggio "Nessun dato disponibile. Esegui un calcolo BAC per vedere lo storico." + link CTA "Vai al calcolo"
- Profilo senza `bevute[]` nel periodo: "Nessun dato negli ultimi N giorni."

### Comportamento Offline (PWA)
- Completamente funzionale offline (dati da cookie locale, nessuna richiesta di rete)

### Accessibilità WCAG 2.1 AA
- `<canvas>` con `aria-label="Grafico storico BAC degli ultimi [N] giorni di [nome profilo]"`
- Tabella nascosta con `class="sr-only"` contenente gli stessi dati del grafico per screen reader:
  ```html
  <table class="sr-only" aria-label="Dati storico BAC">
    <thead><tr><th>Data</th><th>BAC (g/L)</th></tr></thead>
    <tbody>...</tbody>
  </table>
  ```
- Toggle filtro: `role="radiogroup"` con `role="radio"` e `aria-checked`
- Bottone "Cancella storico" con `aria-label="Cancella tutto lo storico BAC"`

---

## UC-FE-09 — Cancellazione Storico BAC

### Dettaglio Interazione UI

**Flusso UI**:
1. Click "Cancella storico" in `ChartComponent`
2. `ModalDrunkService` apre modale di conferma
3. Titolo: "Cancella storico BAC"
4. Testo: "Sei sicuro di voler cancellare tutto lo storico BAC di Mario? Questa azione è irreversibile."
5. Bottoni: "Annulla" (secondary) e "Cancella" (danger)
6. Focus su "Annulla" (prevenzione click accidentale)
7. Click "Cancella" → svuota bevute[] → toast "Storico cancellato" → grafico vuoto

**Mobile vs Desktop**: identico a UC-FE-05 (modale)

### Accessibilità
- Identico a UC-FE-05 per la modale
- Dopo cancellazione: `aria-live="polite"` annuncia "Storico BAC cancellato"

---

## UC-FE-10 — Consultazione FAQ

### Dettaglio Interazione UI

**Componente**: `FaqComponent` (route `/#/faq`)

**Layout**:
- Titolo "Domande Frequenti (FAQ)"
- Accordion Bootstrap Italia per ogni domanda
- Prima FAQ espansa di default (COULD)

**Interazioni**:
- Click su domanda → espande/collassa risposta (accordion)
- Navigazione tastiera: Tab per spostarsi tra domande, Enter/Space per espandere

**Mobile vs Desktop**: identico (accordion già responsive)

### Accessibilità WCAG 2.1 AA
- Accordion Bootstrap Italia già conforme con `aria-expanded`, `aria-controls`, `id` su pannelli
- `<h2>` per ogni domanda nell'accordion o `role="heading" aria-level="3"`
- Navigazione tastiera con frecce (ARIA pattern accordion W3C)

---

## UC-FE-11 — Pagina Contatti

### Dettaglio Interazione UI

**Componente**: `ContattiComponent` (route `/#/contatti`)

**Layout**:
- Card con informazioni maintainers
- Link email accessibili con `href="mailto:"`
- Link social/GitHub se disponibili

### Accessibilità WCAG 2.1 AA
- Link email con testo descrittivo: "Contatta Buonsanto Vito via email" (non solo l'indirizzo)
- `aria-label` su icone social senza testo visibile

---

## UC-FE-12 — Revoca Consenso Cookie

### Dettaglio Interazione UI

**Componente**: `CookieComponent` (route `/#/informativa`)

**Sezione revoca** (visibile solo se consenso già dato):
```
──────────────────────────────────────────────
  GESTISCI I TUOI DATI
  [Revoca consenso e cancella tutti i dati]
──────────────────────────────────────────────
```

**Modale conferma**:
- Titolo: "Cancella tutti i dati"
- Testo: "Questa azione eliminerà TUTTI i tuoi profili, lo storico BAC e le impostazioni. L'app tornerà allo stato iniziale. Questa operazione è IRREVERSIBILE."
- Bottone "Annulla" (secondary) — con focus automatico
- Bottone "Cancella tutto" (danger)

**Mobile vs Desktop**: identico a UC-FE-05 (modale)

### Gestione Errori UI
- Dopo deleteAllCookies(): toast "Tutti i dati sono stati cancellati" (anche se i cookie sono già scaduti)
- Redirect automatico su `/#/informativa` in stato "primo accesso"

### Comportamento Offline
- Funzionante offline (deleteAllCookies() è operazione locale)

### Accessibilità WCAG 2.1 AA
- Modale identica ad UC-FE-05
- Testo "IRREVERSIBILE" enfatizzato: `<strong>` + colore rosso + icona pericolo
- Bottone "Cancella tutto" con `aria-label="Cancella definitivamente tutti i dati e revoca il consenso"`

---

*Documento prodotto da analisi codebase. Versione: 1.0 — Data: 2025*
