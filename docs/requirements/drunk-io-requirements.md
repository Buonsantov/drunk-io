# drunk-io — Documento dei Requisiti

> **Versione**: 1.0  
> **Data**: 2025  
> **Fonte**: Analisi codebase + README  
> **Riferimento baseline**: `docs/requirements/drunk-io-codebase-baseline.md`

---

## 1. Overview Applicazione

### 1.1 Scopo
**drunk-io** è una Progressive Web App (PWA) Angular 15 concepita per **informare e sensibilizzare** gli utenti sui rischi dell'assunzione di alcool, con particolare riferimento alla guida sotto l'effetto di sostanze alcoliche. L'applicazione fornisce una stima del tasso alcolemico (BAC — Blood Alcohol Concentration) basata su una lookup table precompilata, in funzione del profilo fisico dell'utente e delle bevande consumate.

> **Disclaimer obbligatorio**: I dati forniti dall'applicazione NON devono essere considerati attendibili né sostitutivi degli strumenti ufficiali per la misurazione del tasso alcolemico. L'app ha esclusivamente finalità informative ed educative. [README]

### 1.2 Obiettivo Principale
Fornire uno strumento gratuito, accessibile, offline-capable e privacy-preserving che consenta a qualsiasi utente di stimare il proprio tasso alcolemico senza trasmettere alcun dato personale a server esterni.

### 1.3 Metriche di Successo
| Metrica | Target |
|---|---|
| Installabilità PWA | 100% — app installabile su mobile e desktop |
| Caricamento iniziale | < 3 secondi su 4G |
| Accessibilità | WCAG 2.1 AA compliance |
| Privacy | Zero dati trasmessi a server terzi |
| Offline capability | Funzionamento completo senza connessione dopo primo caricamento |
| Disclaimer visibilità | Presente in ogni schermata di calcolo |

---

## 2. Utenti Target

### 2.1 Utenti Primari
- **Consumatori di alcool** — persone che vogliono stimare il proprio BAC prima di mettersi alla guida
- **Guidatori** — chiunque voglia verificare se è in condizione legale per guidare
- **Giovani adulti** — target principale per la sensibilizzazione sui rischi

### 2.2 Utenti Secondari
- **Accompagnatori** — persone che vogliono stimare il BAC di un amico o familiare
- **Operatori del settore** (bar, ristoranti) — per informare i clienti in modo responsabile
- **Educatori** — per scopi didattici in contesti di sensibilizzazione

### 2.3 Assunzioni sull'Utente
- Utilizza principalmente uno smartphone (mobile-first)
- Non è necessariamente esperto di tecnologia
- Vuole una risposta rapida e chiara
- Si trova potenzialmente in condizioni di attenzione ridotta (ha bevuto)

---

## 3. Requisiti Funzionali

### RF-01 — Accettazione Informativa Privacy/Cookie
| Campo | Valore |
|---|---|
| **ID** | RF-01 |
| **Titolo** | Accettazione informativa privacy e cookie |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/_core/guards/informativa.guard.ts`], [README] |
| **Descrizione** | Al primo accesso, l'app deve mostrare l'informativa sulla privacy e sull'uso dei cookie. L'utente deve esplicitamente accettare prima di poter accedere alle funzionalità dell'app. |
| **Criteri di accettazione** | L'accettazione viene salvata su cookie (`info=true`, `cookie=true`). Il guard `InformativaGuard` blocca l'accesso se non accettato. |

### RF-02 — Creazione Profilo Utente
| Campo | Valore |
|---|---|
| **ID** | RF-02 |
| **Titolo** | Creazione profilo utente |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/profilo/profilo.component.ts`] |
| **Descrizione** | L'utente deve poter creare un profilo personale specificando: nome, sesso (M/F), peso (selezionabile da range discreti). Il profilo viene salvato su cookie locale. |
| **Criteri di accettazione** | Il profilo è persistito su cookie con scadenza 30gg. Un ID uuid v4 viene generato automaticamente. |

### RF-03 — Gestione Multi-Profilo
| Campo | Valore |
|---|---|
| **ID** | RF-03 |
| **Titolo** | Gestione di più profili utente |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/profili/profili.component.ts`] |
| **Descrizione** | L'app supporta la creazione e gestione di più profili utente sulla stessa installazione (es. coppie, gruppi di amici). |
| **Criteri di accettazione** | È possibile creare, visualizzare, selezionare ed eliminare più profili. Un solo profilo può essere attivo per volta. |

### RF-04 — Calcolo BAC da Lookup Table
| Campo | Valore |
|---|---|
| **ID** | RF-04 |
| **Titolo** | Calcolo tasso alcolemico |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/home/calcolo-alcolemico/calcolo-alcolemico.component.ts`] |
| **Descrizione** | Il sistema calcola il BAC sommando i tassi di ogni bevanda selezionata, recuperati dalla lookup table in base a: peso utente, sesso, stato stomaco. |
| **Criteri di accettazione** | Il calcolo è basato su `tabella_alcolemica.json`. Il risultato è in g/L. |

### RF-05 — Selezione Bevande e Quantità
| Campo | Valore |
|---|---|
| **ID** | RF-05 |
| **Titolo** | Selezione bevande e quantità |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/home/calcolo-alcolemico/calcolo-alcolemico.component.ts`] |
| **Descrizione** | L'utente può selezionare bevande dalla tabella alcolemica, specificare la quantità per ciascuna, aggiungere più bevande, rimuovere singole bevande o svuotare l'intera lista. |
| **Criteri di accettazione** | La lista bevande è modificabile dinamicamente. Il calcolo si aggiorna ad ogni modifica. |

### RF-06 — Indicazione Stomaco Pieno/Vuoto
| Campo | Valore |
|---|---|
| **ID** | RF-06 |
| **Titolo** | Indicazione stato stomaco |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/_core/model/dettaglio-alcolici.ts`] |
| **Descrizione** | L'utente deve poter indicare se ha lo stomaco pieno o vuoto al momento del consumo di alcool. Questo parametro influenza significativamente il calcolo BAC. |
| **Criteri di accettazione** | Il campo `stomacoPieno: boolean` viene usato nel filtro della lookup table. |

### RF-07 — Visualizzazione Risultato e Sanzioni
| Campo | Valore |
|---|---|
| **ID** | RF-07 |
| **Titolo** | Visualizzazione risultato BAC e sanzioni |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/home/risultato-alcolemico/risultato-alcolemico.component.ts`] |
| **Descrizione** | Dopo il calcolo, l'app mostra il BAC stimato e la corrispondente fascia di sanzione (effetti fisiologici e conseguenze legali) estratta da `sanzioni.json`. |
| **Criteri di accettazione** | La sanzione mostrata corrisponde alla fascia `min ≤ BAC < max`. Il disclaimer è sempre visibile. |

### RF-08 — Storico Andamento BAC
| Campo | Valore |
|---|---|
| **ID** | RF-08 |
| **Titolo** | Salvataggio storico bevute |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/home/calcolo-alcolemico/calcolo-alcolemico.component.ts`] — metodo `salvaAndamento()` |
| **Descrizione** | Dopo ogni calcolo, l'app salva automaticamente un record `{data, grado}` nel profilo utente attivo. |
| **Criteri di accettazione** | Il record è aggiunto all'array `bevute[]` del profilo e persistito su cookie. |

### RF-09 — Grafico BAC nel Tempo
| Campo | Valore |
|---|---|
| **ID** | RF-09 |
| **Titolo** | Grafico storico BAC |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/chart/chart.component.ts`] |
| **Descrizione** | L'utente può visualizzare un grafico lineare del proprio storico BAC filtrato per gli ultimi 7 o 31 giorni. |
| **Criteri di accettazione** | Il grafico è renderizzato con Chart.js e mostra i dati `bevute[]` del profilo attivo. |

### RF-10 — Cancellazione Dati Storico
| Campo | Valore |
|---|---|
| **ID** | RF-10 |
| **Titolo** | Cancellazione storico BAC |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/chart/chart.component.ts`] |
| **Descrizione** | L'utente può cancellare manualmente l'intero storico delle bevute dal profilo attivo. |
| **Criteri di accettazione** | L'array `bevute[]` viene svuotato e il profilo aggiornato su cookie. |

### RF-11 — Selezione Profilo Attivo
| Campo | Valore |
|---|---|
| **ID** | RF-11 |
| **Titolo** | Selezione profilo attivo |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/profili/profili.component.ts`] |
| **Descrizione** | Dalla lista profili, l'utente può selezionare quale profilo usare per il calcolo BAC. Solo un profilo può essere attivo per volta. |
| **Criteri di accettazione** | `setProfiloSelezionato(id)` aggiorna il cookie. Il `BehaviorSubject` notifica tutti i subscriber. |

### RF-12 — Eliminazione Profilo
| Campo | Valore |
|---|---|
| **ID** | RF-12 |
| **Titolo** | Eliminazione profilo utente |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/profili/profili.component.ts`] |
| **Descrizione** | L'utente può eliminare un profilo esistente. Prima dell'eliminazione viene mostrata una modale di conferma. |
| **Criteri di accettazione** | `deleteUser(id)` rimuove il profilo dal cookie. Se era quello selezionato, viene deselezionato. |

### RF-13 — Pagina FAQ
| Campo | Valore |
|---|---|
| **ID** | RF-13 |
| **Titolo** | Pagina FAQ |
| **Priorità** | COULD |
| **Fonte** | [CODICE: `src/app/faq/faq.component.ts`] |
| **Descrizione** | L'app espone una pagina con domande frequenti sull'applicazione, sul funzionamento del calcolo e sui disclaimer. |
| **Criteri di accettazione** | Pagina statica, sempre accessibile. |

### RF-14 — Pagina Contatti
| Campo | Valore |
|---|---|
| **ID** | RF-14 |
| **Titolo** | Pagina Contatti |
| **Priorità** | COULD |
| **Fonte** | [CODICE: `src/app/contatti/contatti.component.ts`] |
| **Descrizione** | L'app espone una pagina con le informazioni di contatto dei maintainers. |
| **Criteri di accettazione** | Pagina statica, sempre accessibile. |

### RF-15 — Presentazione App
| Campo | Valore |
|---|---|
| **ID** | RF-15 |
| **Titolo** | Schermata di presentazione/landing |
| **Priorità** | COULD |
| **Fonte** | [CODICE: `src/app/drunkio-presentazione/`] |
| **Descrizione** | Una schermata di presentazione/landing che introduce l'app e le sue funzionalità principali. |
| **Criteri di accettazione** | Componente separato, accessibile dalla navigazione. |

---

## 4. Requisiti Non Funzionali

### RNF-01 — Performance
- Tempo di caricamento iniziale: < 3 secondi su connessione 4G
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- PWA offline-ready: le risorse critiche devono essere disponibili offline dopo il primo caricamento
- Bundle size: lazy loading per le rotte meno frequenti

### RNF-02 — Accessibilità
- **WCAG 2.1 AA compliance obbligatoria** per tutti i componenti e le schermate
- Navigazione completa via tastiera
- Compatibilità con screen reader (NVDA, JAWS, VoiceOver)
- Ratio di contrasto minimo: 4.5:1 per testo normale, 3:1 per testo grande
- Labels ARIA per tutti gli elementi interattivi
- Focus management esplicito nelle navigazioni programmatiche

### RNF-03 — Responsiveness
- Mobile-first design con breakpoint Bootstrap Italia (xs, sm, md, lg, xl)
- Layout funzionale su: smartphone (320px), tablet (768px), desktop (1024px+)
- PWA installabile su Android e iOS
- Touch targets minimi: 44×44px (WCAG 2.5.5)

### RNF-04 — Privacy
- **Zero dati utente trasmessi a server**: tutti i dati (profili, storico) sono salvati esclusivamente su cookie locale
- Scadenza cookie: 30 giorni
- Nessun cookie di terze parti, nessun tracker, nessuna analytics
- Opzione di cancellazione completa di tutti i dati locali
- Conforme al GDPR per le finalità descritte

### RNF-05 — Sicurezza
- Nessun endpoint API con dati sensibili
- I file JSON statici non contengono dati personali
- Nessun XSS possibile da dati statici (non c'è rendering di input utente non sanitizzato)
- CSP header configurabile via nginx

### RNF-06 — Browser Support
- Chrome (ultime 2 versioni major)
- Firefox (ultime 2 versioni major)
- Safari (ultime 2 versioni major)
- Edge (ultime 2 versioni major)
- iOS Safari 14+
- Android Chrome 88+

### RNF-07 — Deployability
- Containerizzabile con Docker
- Configurazione runtime via `config.json` (montabile come ConfigMap K8s)
- Nessuna variabile d'ambiente build-time per configurazioni che possono cambiare tra ambienti
- nginx come web server per la SPA

### RNF-08 — Manutenibilità
- Struttura Feature Module per separazione delle responsabilità
- Separazione servizi/componenti/modelli rispettata
- Uso di TypeScript tipizzato per modelli dati

---

## 5. Vincoli Tecnici

| Vincolo | Descrizione |
|---|---|
| Framework | Angular 15 — non sono previsti upgrade di major version |
| UI Library | Bootstrap Italia 2.6.1 — compliance design system PA italiano |
| Storage | Cookie browser (ngx-cookie-service) — no localStorage, no IndexedDB |
| Backend | Nessun backend — solo file JSON statici serviti da nginx |
| Deploy | Docker + nginx — obbligatorio per containerizzazione |
| Config | `config.json` caricato a runtime — no build-time env vars per configurazione |
| Lingue | Italiano only — nessun requisito i18n multi-lingua |
| Dati BAC | Lookup table `tabella_alcolemica.json` — non modificabile senza redeploy |

---

## 6. Criteri di Accettazione Globali

1. L'app è installabile come PWA su Chrome Android e iOS Safari
2. Tutto il flusso (informativa → profilo → calcolo → risultato) funziona completamente offline dopo il primo caricamento
3. Nessuna chiamata di rete a domini terzi oltre al dominio dell'app stessa
4. L'app è navigabile completamente via tastiera
5. Il calcolo BAC produce un risultato coerente con la lookup table per le combinazioni peso/sesso/stomaco documentate
6. L'eliminazione di tutti i cookie tramite `deleteAllCookies()` rimuove completamente ogni traccia di dati utente
7. Il disclaimer legale è visibile in ogni schermata che mostra un risultato BAC

---

## 7. Disclaimer Legale (Obbligatorio in App)

> "Drunk.IO è un'applicazione con il solo scopo di informare e sensibilizzare la gente sui pericoli dell'alcool. Tutti i dati forniti dalla seguente applicazione **non devono essere considerati attendibili** o sostituibili con i consueti strumenti per stabilire il grado alcolemico della persona fisica. I dati collezionati dall'applicazione saranno salvati nei cookie della sessione utente e non sono salvati nei nostri datacenter. **Nessun dato dell'utente è usato a fini pubblicitari o di profilazione.**"
>
> — [README]

Il disclaimer deve essere:
- Visibile nella schermata Informativa (RF-01)
- Richiamato nella schermata Risultato (RF-07)
- Accessibile tramite FAQ (RF-13)

---

*Documento prodotto da analisi codebase. Versione: 1.0 — Data: 2025*
