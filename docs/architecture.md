# Arhitectură

## Context general

MedHelp este o aplicație full-stack cu 3 straturi principale:

- frontend Angular pentru interfața utilizatorului
- backend Node.js + Express pentru logică și integrare
- MongoDB + Ollama pentru date și inferență AI

## Componente principale

```mermaid
flowchart LR
  User[Utilizator] --> FE[Frontend Angular]
  FE --> API[Backend Express]
  API --> USERS[User Controller]
  API --> AI[AI Controller]
  API --> PARTNER[Partner Controller]
  USERS --> AUTH[Auth Service]
  AUTH --> DB[(MongoDB)]
  AI --> PROFILE[User Profile Service]
  AI --> MED[Medical Agent]
  AI --> SUM[Summary Agent]
  MED --> OLLAMA[Ollama local]
  SUM --> OLLAMA
  PROFILE --> DB
  PARTNER --> DB
```

## Fluxul de autentificare

```mermaid
sequenceDiagram
  participant U as Utilizator
  participant F as Angular Frontend
  participant B as Express Backend
  participant D as MongoDB

  U->>F: completează formularul de login
  F->>B: POST /login
  B->>D: caută utilizatorul
  D-->>B: datele utilizatorului
  B-->>F: JWT + mesaj de succes
  F->>F: salvează token-ul în localStorage
```

## Fluxul de triaj AI

```mermaid
sequenceDiagram
  participant U as Utilizator
  participant F as Chat Angular
  participant B as AI Controller
  participant P as User Profile Service
  participant M as Medical Agent
  participant O as Ollama
  participant D as MongoDB

  U->>F: trimite simptomul
  F->>B: POST /ai/chat { email, message }
  B->>P: încarcă profilul utilizatorului
  P->>D: citește profilul din Users
  D-->>P: profilul medical
  P-->>B: contextul utilizatorului
  B->>M: rulează o tură de conversație
  M->>O: cere răspunsul modelului
  O-->>M: întrebare / diagnostic final
  M-->>B: reply + isFinal
  B-->>F: răspunsul pentru UI
```

## Observații tehnice

- frontend-ul nu vorbește direct cu MongoDB sau Ollama
- sesiunea AI este ținută în memorie pe backend și este indexată după email normalizat
- la final de conversație, sesiunea este salvată în colecția `Sessions`
- modulul de sumarizare produce un raport clinic pentru parteneri/medici