# HabitUp 🏋️‍♂️✨
### *Track. Build. Rise.*

Benvenuto in **HabitUp**, la tua nuova applicazione preferita per organizzare allenamenti, schede di allenamento, monitorare i progressi fisici e raggiungere i tuoi obiettivi di fitness! 🚀

L'applicazione è interamente sviluppata con **React Native** ed **Expo**, ed è pensata per offrire un'esperienza fluida, motivante e visivamente straordinaria sia su iOS che su Android.

---

## 🎨 Design & Visual Identity

HabitUp ti accoglie con un'interfaccia moderna, progettata per farti sentire subito attivo e focalizzato:
*   **Palette di Colori**: Basata sulle sfumature ufficiali del brand (il **Blu `#0084FF`** di HabitUp e il **Verde Smeraldo `#00D084`**).
*   **Sfondo Acquamarina Delicato (`#E0F2F1`)**: Uno sfondo rilassante e professionale comune a tutte le schermate.

---

## 🔥 Funzionalità Principali

### 📅 Agenda & Pianificazione Sessioni 
Non perdere più un giorno di allenamento! Con la nuova sezione **Agenda** puoi:
*   Pianificare le tue sessioni per date specifiche.
*   Monitorare lo stato degli allenamenti divisi tra **Pianificati** e **Storico Agenda**.
*   **Duplicazione Rapida**: Duplica una sessione programmata per i giorni successivi con un solo tocco per creare rapidamente la tua settimana di allenamento.
*   Azioni rapide per segnare una sessione come completata, saltata o per modificarne i dettagli al volo.

### 📊 Grafici Statistici & Analisi Avanzate (Nuova Feature!)
Visualizza la tua crescita grazie alla dashboard statistica integrata con grafici interattivi:
*   **Andamento Durata (Bar Chart)**: Tieni traccia dei minuti spesi ad allenarti nelle ultime 6 sessioni.
*   **Trend Fatica RPE (Line Chart)**: Analizza la variazione dello sforzo percepito (scala RPE 1-10) nel tempo.
*   **Volume di Lavoro per Gruppo Muscolare (Distribuzione)**: Scopri quante serie totali hai svolto per ciascun distretto muscolare (es. Pettorali, Dorsali, Gambe) per bilanciare la tua scheda.

### ⏱️ Modalità Allenamento Guidato & Timer Integrato
Inizia la scheda direttamente dall'app! L'allenamento guidato ti accompagna serie dopo serie:
*   Visualizzazione del progresso globale e dell'esercizio corrente.
*   **Timer di Recupero Automatico**: Con countdown visivo ed avvisi acustici alla scadenza del tempo di riposo.
*   Inserimento dei carichi effettivamente sollevati e delle ripetizioni eseguite.
*   Rating di fatica (RPE) e note personali al termine della sessione.

### 📚 Libreria Esercizi & Filtri Intelligenti
Gestisci un database completo di esercizi:
*   **CRUD Completo**: Aggiungi i tuoi esercizi personalizzati, modificali o eliminali.
*   **Ricerca Avanzata**: Filtra la lista all'istante per gruppo muscolare, tipo di attrezzatura (es. Bilanciere, Manubri, Corpo Libero) e difficoltà.

### 📋 Schede di Allenamento (Plans)
Costruisci la tua scheda ideale:
*   Associa gli esercizi impostando ordine, numero di serie, ripetizioni, peso e tempo di recupero.
*   Filtra le schede per livello di difficoltà e per obiettivo (Forza, Ipertrofia, Dimagrimento, ecc.).

### 🎯 Obiettivi Personali (Goals)
Resta motivato impostando i tuoi traguardi:
*   Crea obiettivi personalizzati con data di scadenza e progresso in percentuale.
*   Filtra gli obiettivi per stato (Attivi, Completati, Abbandonati).

---

## 🛠️ Navigazione Standardizzata

Tutta la navigazione dell'app è stata allineata per essere pulita e naturale:
*   I pulsanti di ritorno in alto a sinistra sono stati standardizzati su tutte le piattaforme con la dicitura **`< back`** per evitare disallineamenti di testo o l'auto-hiding nativo di iOS sui titoli molto lunghi (come ad esempio *Shoulder Press*).

---

## 🚀 Come Iniziare

### Prerequisiti
Assicurati di avere installato sul tuo computer [Node.js](https://nodejs.org/).

### Configurazione
1.  Clona il repository ed entra nella cartella del progetto:
    ```bash
    cd Fitness_Workout_Tracker_App/HabitUp
    ```
2.  Installa le dipendenze:
    ```bash
    npm install
    ```
3.  Avvia il server di sviluppo Expo:
    ```bash
    npx expo start
    ```

Ora puoi scansionare il codice QR sul tuo smartphone tramite l'applicazione **Expo Go** (disponibile su App Store e Google Play) o avviare l'app su un emulatore iOS/Android!

---

## 💻 Tech Stack
*   **Core**: React Native (Expo SDK)
*   **Routing**: Expo Router (File-system based navigation)
*   **State Management**: Zustand
*   **Storage locale**: AsyncStorage
*   **Grafica**: React Native Gifted Charts, Expo Linear Gradient, Expo Vector Icons (Ionicons).
*   **Linguaggio**: TypeScript

---

### *Pronto a superare i tuoi limiti? Scarica la scheda, allacciati le scarpe e lascia che HabitUp pensi al resto! 🚀💪*
