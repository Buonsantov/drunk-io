# drunk-io — Requisiti Frontend Angular

> **Versione**: 1.0  
> **Data**: 2025  
> **Stack**: Angular 15, Bootstrap Italia 2.6.1, PWA  
> **Riferimento**: `docs/requirements/drunk-io-requirements.md`, `docs/analysis/drunk-io-use-cases.md`

---

## 1. Requisiti UI/UX per Schermata

### 1.1 Schermata: Informativa Cookie (`/#/informativa`)
**RF associate**: RF-01, UC-01, UC-12

| Requisito | Descrizione |
|---|---|
| FE-UI-01 | Testo completo dell'informativa sulla privacy visualizzato in modo leggibile (font size min 16px) |
| FE-UI-02 | Bottone "Accetto" prominente, ben visibile, colore Bootstrap Italia `btn-primary` |
| FE-UI-03 | Bottone/link "Revoca consenso" disponibile per utenti che hanno già accettato |
| FE-UI-04 | Disclaimer legale visibile senza scroll sul dispositivo più piccolo target (320px) |
| FE-UI-05 | Layout centrato, max-width 768px, con padding orizzontale adeguato su mobile |
| FE-UI-06 | Logo/intestazione app visibile in cima |
| FE-UI-07 | Link a FAQ e Contatti disponibili senza richiedere accettazione |

### 1.2 Schermata: Home / Calcolo Alcolemico (`/#/`)
**RF associate**: RF-04, RF-05, RF-06, RF-08, UC-06

| Requisito | Descrizione |
|---|---|
| FE-UI-10 | Header con nome utente del profilo attivo visibile in cima |
| FE-UI-11 | Lista bevande selezionabili con nome e tipologia chiari |
| FE-UI-12 | Input quantità per ogni bevanda selezionata (numero, min=1) |
| FE-UI-13 | Bottone "Aggiungi bevanda" ben visibile |
| FE-UI-14 | Bottone "Rimuovi" per ogni bevanda nella lista corrente |
| FE-UI-15 | Toggle/checkbox "Stomaco pieno / Stomaco vuoto" con etichetta chiara |
| FE-UI-16 | Bottone "Calcola" principale, disabilitato se lista bevande vuota |
| FE-UI-17 | Indicatore loading durante il calcolo o caricamento dati |
| FE-UI-18 | Messaggio di errore se caricamento `tabella_alcolemica.json` fallisce |

### 1.3 Schermata: Risultato Alcolemico (embedded in Home)
**RF associate**: RF-07, UC-07

| Requisito | Descrizione |
|---|---|
| FE-UI-20 | BAC calcolato visualizzato in grande (font prominente), con unità di misura (g/L) |
| FE-UI-21 | Fascia di rischio con colore semantico (verde/giallo/arancio/rosso) |
| FE-UI-22 | Testo effetti fisiologici della fascia |
| FE-UI-23 | Testo sanzioni legali italiane della fascia |
| FE-UI-24 | Disclaimer legale **sempre visibile** in questa schermata |
| FE-UI-25 | Bottone "Nuovo calcolo" per tornare alla selezione bevande |

### 1.4 Schermata: Crea/Modifica Profilo (`/#/profilo/:id`)
**RF associate**: RF-02, RF-03, UC-02, UC-03

| Requisito | Descrizione |
|---|---|
| FE-UI-30 | Form con campi: Nome (text input), Sesso (radio M/F), Peso (select/radio discreta) |
| FE-UI-31 | Lista pesi aggiornata dinamicamente al cambio sesso |
| FE-UI-32 | Validazione inline: messaggio sotto ogni campo con errore |
| FE-UI-33 | Bottone "Salva" disabilitato finché il form non è valido |
| FE-UI-34 | In modalità modifica: form pre-popolato con i dati attuali |
| FE-UI-35 | Titolo distingue "Crea profilo" da "Modifica profilo" |

### 1.5 Schermata: Lista Profili (`/#/profili`)
**RF associate**: RF-03, RF-11, RF-12, UC-04, UC-05

| Requisito | Descrizione |
|---|---|
| FE-UI-40 | Lista di card/item per ogni profilo (nome, sesso, peso) |
| FE-UI-41 | Indicatore visivo del profilo attualmente selezionato |
| FE-UI-42 | Bottone "Seleziona" per ogni profilo non attivo |
| FE-UI-43 | Bottone "Modifica" per ogni profilo |
| FE-UI-44 | Bottone "Elimina" per ogni profilo (con modale di conferma) |
| FE-UI-45 | Bottone "Aggiungi nuovo profilo" |

### 1.6 Schermata: Grafico Storico (`/#/chart`)
**RF associate**: RF-09, RF-10, UC-08, UC-09

| Requisito | Descrizione |
|---|---|
| FE-UI-50 | Grafico lineare Chart.js responsivo (100% larghezza container) |
| FE-UI-51 | Toggle "7 giorni" / "31 giorni" visibile sopra il grafico |
| FE-UI-52 | Etichette assi leggibili (date sull'asse X, BAC g/L sull'asse Y) |
| FE-UI-53 | Messaggio "Nessun dato" se storico vuoto |
| FE-UI-54 | Bottone "Cancella storico" con modale di conferma |
| FE-UI-55 | Indicazione del nome del profilo visualizzato |

### 1.7 Schermata: FAQ (`/#/faq`)
**RF associate**: RF-13, UC-10

| Requisito | Descrizione |
|---|---|
| FE-UI-60 | Accordion Bootstrap Italia per ogni domanda/risposta |
| FE-UI-61 | Titolo sezione FAQ chiaro |
| FE-UI-62 | Accessibile senza profilo e senza accettazione informativa |

### 1.8 Schermata: Contatti (`/#/contatti`)
**RF associate**: RF-14, UC-11

| Requisito | Descrizione |
|---|---|
| FE-UI-70 | Informazioni di contatto maintainers (Buonsanto Vito, Favia Fabrizio) [README] |
| FE-UI-71 | Link email/social se disponibili (markup `<a href="mailto:">` accessibile) |
| FE-UI-72 | Accessibile senza profilo |

---

## 2. Requisiti Componenti Angular

### 2.1 Routing e Guards

| Requisito | Descrizione | Fonte |
|---|---|---|
| FE-NG-01 | Hash routing (`useHash: true`) mantenuto per compatibilità nginx | `app-routing.module.ts` |
| FE-NG-02 | `InformativaGuard` su tutte le rotte di `ContentComponent` | `informativa.guard.ts` |
| FE-NG-03 | `ProfiloGuard` su `HomeComponent` | `profilo.guard.ts` |
| FE-NG-04 | Lazy loading per moduli Feature (chart, profilo, profili) | Performance |
| FE-NG-05 | Redirect espliciti in guard (non alert/confirm JavaScript) | UX |

### 2.2 Smart Components

| Componente | Requisiti |
|---|---|
| `HomeComponent` | Gestisce loading state per i JSON. Usa `async pipe` per profilo da BehaviorSubject. |
| `CalcoloAlcolemicoComponent` | Form reattivo (ReactiveFormsModule) per lista bevande. Validazione quantità > 0. |
| `ProfiloComponent` | Form reattivo con validatori. Cambio sesso aggiorna dinamicamente opzioni peso. |
| `ProfiliComponent` | Lista dinamica con trackBy per performance. Usa ModalDrunkService per conferme. |
| `ChartComponent` | Destroy chart su ngOnDestroy per evitare memory leak. |

### 2.3 Comunicazione tra Componenti

| Pattern | Requisito |
|---|---|
| `@Input` / `@Output` | `CalcoloAlcolemicoComponent` e `RisultatoAlcolemicoComponent` comunicano con `HomeComponent` tramite @Input/@Output |
| `BehaviorSubject` | Sottoscrizione al profilo corrente tramite `async pipe` per evitare memory leak |
| `Router` | Navigazione programmatica tramite `Router.navigate()` nei guard e dopo salvataggi |

### 2.4 Servizi

| Servizio | Requisiti |
|---|---|
| `CookieDrunkService` | Deve esporre il profilo corrente come `Observable<User\|null>` (async pipe safe). Metodi sincronici per operazioni CRUD cookie. |
| `APIMFApiImplService` | Deve gestire errori HTTP con `catchError`. Tipo di ritorno: `Observable<T>`. |
| `ConfigService` | Caricato con `APP_INITIALIZER` prima del bootstrap. URL base per JSON statici. |

---

## 3. Requisiti Accessibilità WCAG 2.1 AA

### 3.1 Requisiti Globali

| Codice | Criterio WCAG | Requisito |
|---|---|---|
| FE-A11Y-01 | 1.1.1 Non-text Content | Tutte le immagini decorative con `alt=""`, immagini informative con alt descrittivo |
| FE-A11Y-02 | 1.3.1 Info and Relationships | Struttura semantica HTML5 (header, main, nav, section, article) |
| FE-A11Y-03 | 1.4.3 Contrast (Minimum) | Rapporto contrasto testo/sfondo ≥ 4.5:1 (testo normale), ≥ 3:1 (testo grande) |
| FE-A11Y-04 | 2.1.1 Keyboard | Tutte le funzionalità accessibili via tastiera (Tab, Enter, Space, Escape, frecce) |
| FE-A11Y-05 | 2.4.3 Focus Order | Ordine focus logico e coerente con l'ordine visivo |
| FE-A11Y-06 | 2.4.7 Focus Visible | Focus visibile con outline chiaramente distinguibile |
| FE-A11Y-07 | 3.3.1 Error Identification | Errori di validazione identificati testualmente e associati al campo tramite `aria-describedby` |
| FE-A11Y-08 | 3.3.2 Labels or Instructions | Tutti i campi form con `<label>` associata o `aria-label` |
| FE-A11Y-09 | 4.1.2 Name, Role, Value | Componenti custom con role e state ARIA corretti |
| FE-A11Y-10 | 4.1.3 Status Messages | Toast e messaggi di stato con `aria-live` region per screen reader |

### 3.2 Requisiti per Schermata

| Schermata | Requisiti Specifici |
|---|---|
| Informativa Cookie | `<main>` come landmark. Bottone "Accetto" con testo significativo (non solo icona). |
| Calcolo Alcolemico | Form con fieldset/legend per lista bevande. Input quantità con label. Toggle stomaco con label. Bottone disabilitato con `aria-disabled`. |
| Risultato Alcolemico | Risultato BAC annunciato tramite `aria-live="assertive"`. Colore non unico indicatore stato (+ testo). |
| Lista Profili | Lista con `role="list"`. Profilo attivo con `aria-pressed="true"` o `aria-selected="true"`. Modale conforme WCAG (focus trap, close su Escape). |
| Grafico Storico | Chart.js con `aria-label` sul canvas e tabella dati alternativa accessibile. |
| FAQ | Accordion con `aria-expanded` e `aria-controls`. |

### 3.3 Touch Target
- Tutti gli elementi interattivi: dimensione minima 44×44px (WCAG 2.5.5 — livello AAA ma raccomandato)
- Spaziatura tra elementi interattivi adiacenti: minimo 8px

---

## 4. Requisiti PWA

| Codice | Requisito | Priorità |
|---|---|---|
| FE-PWA-01 | Manifest JSON valido con: name, short_name, icons (almeno 192x192 e 512x512), start_url, display=standalone, background_color, theme_color | MUST |
| FE-PWA-02 | Service Worker Angular (`ngsw-config.json`) con strategia caching per: SPA shell, assets statici, file JSON (tabella, sanzioni, config) | MUST |
| FE-PWA-03 | Funzionamento offline completo dopo primo caricamento (calcolo, profili, storico) | MUST |
| FE-PWA-04 | App installabile su Chrome Android e iOS Safari (add to home screen) | SHOULD |
| FE-PWA-05 | Icona app appropriata (non segnaposto Angular) | SHOULD |
| FE-PWA-06 | Gestione graceful dell'aggiornamento service worker (notifica all'utente) | COULD |

---

## 5. Requisiti Responsiveness

### 5.1 Breakpoint Bootstrap Italia

| Breakpoint | Range | Layout |
|---|---|---|
| xs | < 576px | Single column, stack verticale tutto |
| sm | 576–767px | Single column, padding aumentato |
| md | 768–991px | Possibile 2 colonne per lista profili |
| lg | 992–1199px | Layout desktop con sidebar navigation |
| xl | ≥ 1200px | Max-width container centrato |

### 5.2 Requisiti per Breakpoint

| Codice | Requisito |
|---|---|
| FE-RESP-01 | Navbar Bootstrap Italia responsive con hamburger menu su mobile |
| FE-RESP-02 | Lista bevande scrollabile su mobile (altezza fissa con overflow-y: auto) |
| FE-RESP-03 | Grafico Chart.js responsivo (`responsive: true`, `maintainAspectRatio: false`) |
| FE-RESP-04 | Form profilo stack verticale su xs/sm, possibile 2 colonne su md+ |
| FE-RESP-05 | Card profili: 1 colonna su xs/sm, 2 colonne su md, 3 su lg+ |
| FE-RESP-06 | Nessun overflow orizzontale a nessun breakpoint |

---

## 6. Requisiti Performance (Core Web Vitals)

| Metrica | Target | Note |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Ottimizzare immagini, preload font Bootstrap Italia |
| FID (First Input Delay) | < 100ms | Lazy loading moduli. Evitare heavy computation al bootstrap |
| CLS (Cumulative Layout Shift) | < 0.1 | Dimensioni esplicite su immagini e canvas Chart.js |
| Bundle size iniziale | < 200KB gzipped | Lazy loading Feature Modules |
| TTI (Time to Interactive) | < 3.5s su 4G | Code splitting per rotte meno frequenti |

### 6.1 Strategie Performance

| Codice | Strategia |
|---|---|
| FE-PERF-01 | Lazy loading per: ChartModule, ProfiloModule, ProfiliModule |
| FE-PERF-02 | `trackBy` nelle `*ngFor` per liste profili e bevande |
| FE-PERF-03 | `OnPush` change detection strategy su Dumb Components |
| FE-PERF-04 | `async pipe` per BehaviorSubject (auto-unsubscribe) |
| FE-PERF-05 | Precaricamento strategia PWA per JSON statici (cache-first) |

---

## 7. Requisiti i18n/l10n

| Codice | Requisito |
|---|---|
| FE-I18N-01 | Lingua: italiano esclusivamente (nessun requisito multi-lingua) |
| FE-I18N-02 | Attributo `lang="it"` su `<html>` per screen reader e motori di ricerca |
| FE-I18N-03 | Date visualizzate in formato italiano (DD/MM/YYYY) nel grafico |
| FE-I18N-04 | Decimali con virgola (0,82 g/L) per il BAC visualizzato |
| FE-I18N-05 | Messaggi di errore e validazione in italiano |

---

## 8. Requisiti Bootstrap Italia Compliance

| Codice | Requisito |
|---|---|
| FE-BI-01 | Usare esclusivamente componenti Bootstrap Italia 2.6.1 per: navbar, card, button, form, modal, accordion, badge |
| FE-BI-02 | Non modificare le variabili CSS Bootstrap Italia senza documentare le override |
| FE-BI-03 | Usare le classi utility Bootstrap Italia per spacing, typography, colors |
| FE-BI-04 | Icone: usare Bootstrap Icons (incluso in Bootstrap Italia) |
| FE-BI-05 | Tipografia: rispettare la gerarchia Bootstrap Italia (h1–h6, lead, small) |
| FE-BI-06 | Colori semantici: `text-success`, `text-warning`, `text-danger` per le fasce BAC |

---

## 9. Mapping Schermata → Componente → RF

| Schermata | Componente Angular | RF Associate |
|---|---|---|
| Informativa Cookie | `CookieComponent` | RF-01 |
| Home/Calcolo BAC | `HomeComponent` + `CalcoloAlcolemicoComponent` | RF-04, RF-05, RF-06, RF-08 |
| Risultato BAC | `RisultatoAlcolemicoComponent` | RF-07 |
| Crea Profilo | `ProfiloComponent` (id=0) | RF-02 |
| Modifica Profilo | `ProfiloComponent` (id≠0) | RF-02 |
| Lista Profili | `ProfiliComponent` | RF-03, RF-11, RF-12 |
| Grafico Storico | `ChartComponent` | RF-09, RF-10 |
| FAQ | `FaqComponent` | RF-13 |
| Contatti | `ContattiComponent` | RF-14 |
| Presentazione | `DrunkioPresentazioneComponent` | RF-15 |

---

*Documento prodotto da analisi codebase. Versione: 1.0 — Data: 2025*
