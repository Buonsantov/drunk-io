# drunk-io — Codebase Baseline

> Documento generato da analisi del codice sorgente esistente.  
> Fonti primarie: `src/app/`, `README.md`, `package.json`, `ngsw-config.json`, `Dockerfile`, `nginx.conf`.

---

## 1. Descrizione Applicazione e Scopo

**drunk-io** è una Progressive Web App (PWA) realizzata in Angular 15 con il solo scopo di **informare e sensibilizzare** gli utenti sui pericoli dell'alcool al volante e in generale.

> [README] "Drunk.IO è un'applicazione con il solo scopo di informare e sensibilizzare la gente sui pericoli dell'alcool. Tutti i dati forniti dalla seguente applicazione non devono essere considerati attendibili o sostituibili con i consueti strumenti per stabilire il grado alcolemico della persona fisica."

L'applicazione consente all'utente di:
- Creare e gestire uno o più profili personali (nome, sesso, peso)
- Selezionare le bevande alcoliche consumate e calcolare il tasso alcolemico stimato (BAC)
- Visualizzare le sanzioni legali corrispondenti alla fascia di BAC calcolata
- Monitorare lo storico delle bevute nel tempo attraverso un grafico lineare
- Consultare FAQ e informazioni di contatto

**Maintainers**: Buonsanto Vito, Favia Fabrizio [README]

---

## 2. Stack Tecnologico Completo

| Layer | Tecnologia | Versione |
|---|---|---|
| Framework | Angular | 15.x |
| Linguaggio | TypeScript | ~4.9.x |
| UI Library | Bootstrap Italia | 2.6.1 |
| UI Components | ngx-bootstrap, ng-bootstrap | — |
| Grafici | Chart.js | — |
| Cookie Storage | ngx-cookie-service | — |
| PWA | @angular/service-worker | 15.x |
| Build Tool | Angular CLI | 15.x |
| Container | Docker + nginx | — |
| Runtime Config | config.json (APP_INITIALIZER) | — |
| Routing | Hash-based (`useHash: true`) | — |

**Assenza di backend reale**: i dati JSON (`tabella_alcolemica.json`, `sanzioni.json`) sono file statici serviti da nginx. Non esiste chiamata a un'API REST con logica server-side.  
[CODICE: `src/app/_core/services/apimf-api-impl.service.ts`]

---

## 3. Struttura Moduli e Componenti

### 3.1 Struttura cartelle principale

```
src/app/
├── _core/
│   ├── model/           # Modelli dati TypeScript
│   ├── services/        # Servizi applicativi
│   └── guards/          # Navigation guards
├── _lib/                # Libreria UI interna (toast, modal, enum colori)
├── content/             # Layout principale con router-outlet
│   ├── home/            # Schermata calcolo BAC
│   │   ├── calcolo-alcolemico/   # Selezione bevande e calcolo
│   │   └── risultato-alcolemico/ # Visualizzazione risultato + sanzioni
│   ├── profilo/         # Creazione/modifica profilo
│   ├── profili/         # Lista profili
│   └── chart/           # Grafico storico BAC
├── cookie/              # Informativa cookie/privacy
├── faq/                 # FAQ statiche
├── contatti/            # Pagina contatti
└── drunkio-presentazione/ # Landing/presentazione app
```

### 3.2 Componenti principali

| Componente | Route | Responsabilità |
|---|---|---|
| `ContentComponent` | `/#/` (shell) | Layout principale con router-outlet, richiede InformativaGuard |
| `HomeComponent` | `/#/` | Coordinamento calcolo BAC (carica dati JSON, mostra CalcoloAlcolemico o RisultatoAlcolemico) |
| `CalcoloAlcolemicoComponent` | — (child di Home) | Selezione bevande, gestione lista, calcolo BAC, salvataggio andamento |
| `RisultatoAlcolemicoComponent` | — (child di Home) | Visualizzazione tasso calcolato + sanzione corrispondente |
| `ProfiloComponent` | `/#/profilo/:id` | Creazione (id=0) o modifica profilo esistente |
| `ProfiliComponent` | `/#/profili` | Lista profili con selezione/eliminazione |
| `ChartComponent` | `/#/chart` | Grafico lineare storico BAC (Chart.js), filtro 7gg/31gg |
| `CookieComponent` | `/#/informativa` | Informativa privacy e cookie, accettazione |
| `FaqComponent` | `/#/faq` | FAQ statiche |
| `ContattiComponent` | `/#/contatti` | Pagina contatti |
| `DrunkioPresentazioneComponent` | — | Presentazione/landing app |

[CODICE: `src/app/app-routing.module.ts`]

### 3.3 Libreria UI interna (`src/app/_lib/`)

| Servizio/Enum | Funzione |
|---|---|
| `DrunkLibToastService` | Toast notifiche (ok / alert) |
| `ModalDrunkService` | Modale generica con bottoni configurabili |
| `THEME_COLORS_ENUM` | Enum colori tema (PRIMARY, PRIMARY_OUTLINE, ecc.) |

---

## 4. Modelli Dati e Relazioni

### 4.1 User
```typescript
// [CODICE: src/app/_core/model/user-model.ts]
class User {
  id: string;                  // uuid v4 generato alla creazione
  nome: string;
  sesso: 'M' | 'F';
  peso: number;                // range discreti, diversi per M/F
  profiloSelezionato: boolean; // default false
  bevute?: [{ data: Date, grado: number }]; // storico BAC
}
```

### 4.2 Drink
```typescript
// [CODICE: src/app/_core/model/drink-model.ts]
class Drink {
  name?: string;
  tipologia?: 'Alcolico' | 'Super alcolico';
  quantita?: number;
  gradazione?: number;
}
```

### 4.3 TabellaAlcolemica
```typescript
// [CODICE: src/app/_core/model/tabella-alcolemica.ts]
class TabellaAlcolemica {
  nome: string;
  dettaglioAlcolici: DettaglioAlcolici[];
  gradazione: number;
}
```

### 4.4 DettaglioAlcolici
```typescript
// [CODICE: src/app/_core/model/dettaglio-alcolici.ts]
class DettaglioAlcolici {
  stomacoPieno: boolean;
  kg: number;
  tasso: number;
  sesso: string;  // 'M' | 'F'
}
```

### 4.5 Pena (sanzione)
```typescript
// [CODICE: src/app/_core/model/pena.ts]
class Pena {
  min: number;    // BAC minimo fascia (g/L)
  max: number;    // BAC massimo fascia (g/L)
  sanzioni: string;
  effetti: string;
}
```

### 4.6 Config
```typescript
// [CODICE: src/app/_core/model/config.ts]
class Config {
  project: string = 'Drunk.io';
  isProd: boolean = false;
  backendAPI: any = {};  // contiene apiBase per i file JSON statici
}
```

### 4.7 Diagramma ER concettuale

```
User 1---* bevute (storico BAC inline)
TabellaAlcolemica 1---* DettaglioAlcolici
Drink ---lookup---> TabellaAlcolemica
Pena (fascia BAC) --valutata--> calcolatedBAC
Config --caricata da--> config.json (runtime)
```

---

## 5. Flussi Principali

### 5.1 Flusso primo accesso
1. Utente apre l'app → router attiva `ContentComponent`
2. **InformativaGuard** verifica `cookie.info === true && cookie.cookie === true`
3. Se negativo → redirect a `/#/informativa`
4. `CookieComponent` mostra informativa, utente accetta
5. `salvaInfo(true, true)` → cookie salvato
6. Redirect a `/#/`

[CODICE: `src/app/_core/guards/informativa.guard.ts`]

### 5.2 Flusso selezione profilo
1. `ContentComponent` attivo → **ProfiloGuard** verifica utenti in cookie
2. Nessun utente → redirect a `/#/profilo/0` (creazione)
3. Utenti presenti ma nessuno selezionato → redirect a `/#/profili`
4. Profilo selezionato → accesso a `/#/` (HomeComponent)

[CODICE: `src/app/_core/guards/profilo.guard.ts`]

### 5.3 Flusso calcolo BAC
1. `HomeComponent` carica `tabella_alcolemica.json` e `sanzioni.json` via `APIMFApiImplService`
2. Mostra `CalcoloAlcolemicoComponent`
3. Utente seleziona bevande, quantità, stato stomaco
4. Calcolo: per ogni bevanda → filtra `dettaglioAlcolici` per (kg, sesso, stomacoPieno) → somma `tasso × quantità`
5. `salvaAndamento()` → aggiunge record `{data, grado}` al profilo via `CookieDrunkService`
6. Emette `tassoOut` → HomeComponent mostra `RisultatoAlcolemicoComponent`
7. `RisultatoAlcolemicoComponent` filtra `sanzioni[]` per `min ≤ tasso < max`

[CODICE: `src/app/content/home/calcolo-alcolemico/calcolo-alcolemico.component.ts`]

### 5.4 Flusso storico BAC
1. `ChartComponent` legge profilo attivo via `CookieDrunkService`
2. Estrae array `bevute[]` dal profilo
3. Filtra per 7gg o 31gg in base al toggle selezionato
4. Renderizza grafico lineare con Chart.js
5. Opzione cancellazione storico: svuota `bevute[]` e aggiorna cookie

[CODICE: `src/app/content/chart/chart.component.ts`]

---

## 6. Servizi

### 6.1 CookieDrunkService
[CODICE: `src/app/_core/services/cookie-drunk.service.ts`]

**Responsabilità**: unico punto di accesso a tutti i dati persistiti su cookie.

| Metodo | Descrizione |
|---|---|
| `salvaInfo(info, cookie)` | Salva flag accettazione informativa |
| `recuperaInfo()` | Legge flag accettazione informativa |
| `setUser(user)` | Crea/aggiorna utente nel cookie `users` |
| `getUser(id)` | Recupera un utente per ID |
| `getUsers()` | Recupera tutti gli utenti |
| `deleteUser(id)` | Elimina utente per ID |
| `setProfiloSelezionato(id)` | Imposta profilo attivo |
| `getProfiloSelezionato()` | Recupera profilo attivo |
| `deleteAllCookies()` | Cancella tutti i cookie applicativi |

**Stato reattivo**: `BehaviorSubject<User|null>` per propagare il profilo corrente ai componenti sottoscritti.  
**Scadenza cookie**: 30 giorni.

### 6.2 APIMFApiImplService
[CODICE: `src/app/_core/services/apimf-api-impl.service.ts`]

| Metodo | Endpoint |
|---|---|
| `recuperaTabAlcolemicaUsingGET()` | GET `{apiBase}/tabella_alcolemica.json` |
| `recuperaSanzioniUsingGET()` | GET `{apiBase}/sanzioni.json` |

`apiBase` è letto da `ConfigService` (caricato a runtime da `config.json`).

### 6.3 ConfigService
[CODICE: `src/app/_core/services/config.service.ts`]

Carica `config.json` durante il bootstrap Angular tramite `APP_INITIALIZER`. Permette configurazione runtime del container (URL base per i JSON statici) senza rebuild dell'immagine Docker.

---

## 7. Guards

### 7.1 InformativaGuard
[CODICE: `src/app/_core/guards/informativa.guard.ts`]
- **Condizione**: `cookie.info === true && cookie.cookie === true`
- **Fallback**: redirect a `/#/informativa`
- **Protegge**: `ContentComponent` e tutte le rotte figlie

### 7.2 ProfiloGuard
[CODICE: `src/app/_core/guards/profilo.guard.ts`]
- **Condizione 1**: nessun utente in cookie → redirect a `/#/profilo/0`
- **Condizione 2**: utenti presenti ma nessuno selezionato → redirect a `/#/profili`
- **Condizione 3**: profilo attivo presente → passa
- **Protegge**: `HomeComponent` (`/#/`)

---

## 8. Dipendenze Esterne

| Dipendenza | Scopo | Note |
|---|---|---|
| `@angular/service-worker` | PWA support | `ngsw-config.json` presente |
| `bootstrap-italia` 2.6.1 | Design System italiano | UI components |
| `ngx-bootstrap` | Componenti Bootstrap aggiuntivi | Modal, dropdown |
| `ng-bootstrap` | Componenti Bootstrap nativi Angular | — |
| `chart.js` | Grafici | Grafico lineare storico BAC |
| `ngx-cookie-service` | Gestione cookie browser | Storage persistenza |
| `nginx` | Web server container | Serve SPA + JSON statici |
| `Docker` | Containerizzazione | Runtime deployment |

---

## 9. Pattern Architetturali Rilevati

| Pattern | Descrizione | Dove |
|---|---|---|
| **Smart/Dumb Components** | `HomeComponent` (smart) orchestra `CalcoloAlcolemico` e `RisultatoAlcolemico` (dumb con @Input/@Output) | `content/home/` |
| **Guard Navigation** | Flusso di onboarding obbligatorio controllato da guard | `InformativaGuard`, `ProfiloGuard` |
| **BehaviorSubject State** | Stato profilo corrente propagato reattivamente in-app | `CookieDrunkService` |
| **Cookie Persistence** | Persistenza dati utente su cookie browser (no backend) | `CookieDrunkService` |
| **Lookup Table BAC** | Calcolo BAC da tabella precompilata anziché formula diretta | `CalcoloAlcolemicoComponent` + `tabella_alcolemica.json` |
| **APP_INITIALIZER Config** | Config runtime caricata prima del bootstrap | `ConfigService` |
| **Hash Routing** | `useHash: true` per compatibilità deploy su nginx senza configurazioni speciali | `app-routing.module.ts` |
| **Feature Module** | Separazione per funzionalità (content, cookie, faq, contatti) | struttura `src/app/` |

---

## 10. Configurazione PWA

Il file `ngsw-config.json` definisce la strategia di caching del service worker Angular.  
L'app è installabile come PWA su mobile e desktop, con capacità offline per le risorse già cachate.

---

## 11. Deployment

```
Docker Container
└── nginx
    ├── /usr/share/nginx/html/   (SPA Angular compilata)
    ├── config.json              (configurazione runtime, montabile come ConfigMap K8s)
    ├── tabella_alcolemica.json  (dati statici BAC)
    └── sanzioni.json            (dati statici sanzioni)
```

La configurazione `config.json` viene caricata a runtime dal `ConfigService` tramite `APP_INITIALIZER`, consentendo l'iniezione di variabili d'ambiente senza rebuild.

---

## 12. Gap e Domande Aperte

| ID | Gap / Domanda | Impatto |
|---|---|---|
| GAP-01 | Dimensione cookie: il cookie `users` accumula lo storico `bevute[]` senza limite. Il limite browser per singolo cookie è 4KB. | Alto — rischio corruzione dati per utilizzo prolungato |
| GAP-02 | Mancanza di validazione dell'input quantità bevande (valori negativi o non numerici) | Medio — possibile calcolo BAC errato |
| GAP-03 | Nessun meccanismo di purge automatico dello storico storico (solo manuale) | Medio — crescita illimitata cookie |
| GAP-04 | La lookup table `tabella_alcolemica.json` ha qualità non verificabile dal codice (nessuno schema di validazione) | Medio — risultati BAC dipendono dalla correttezza dei dati statici |
| GAP-05 | Nessuna gestione esplicita della scadenza token di sessione (cookie scade dopo 30gg ma non c'è refresh) | Basso |
| GAP-06 | `config.ts` espone `isProd: boolean` ma non è chiaro come venga utilizzato nel codice di produzione | Basso |
| GAP-07 | Assenza di test unitari rilevati nella struttura analizzata | Alto — nessuna copertura test |
| GAP-08 | Nessuna gestione degli errori HTTP esplicita per il fallimento del caricamento dei JSON statici | Medio |
| GAP-09 | `ContattiComponent` e `DrunkioPresentazioneComponent`: contenuto non rilevato dalla struttura — potrebbe essere statico/hardcoded | Basso |
| GAP-10 | Accessibilità WCAG 2.1 AA: non è documentata la compliance attuale dei componenti custom | Alto — necessita audit |

---

*Documento generato da analisi statica del codice. Versione: 1.0 — Data: 2025*
