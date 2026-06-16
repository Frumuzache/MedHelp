# Teste, Git și proces de dezvoltare

## Teste automate existente

### Backend

- teste Jest + Supertest pentru rutele partenerilor
- teste pentru agentul medical
- teste pentru agentul de sumarizare

### Frontend

- teste Angular pentru componentele principale

## Cum este organizată testarea

- testele backend validează răspunsurile HTTP și tratamentul erorilor
- testele AI verifică logica de construcție a răspunsului și a rezumatului
- testele frontend verifică inițializarea componentelor și interacțiunile de bază

## Proces Git recomandat

- lucrează pe branch-uri dedicate
- păstrează commit-uri mici și descriptive
- folosește merge request / pull request pentru revizuire
- rezolvă conflictele local înainte de integrare
- evită commit-uri care amestecă bug fix cu refactor mare

## Ce se poate raporta la rubrică

- branch-uri pentru funcționalități separate
- merge-uri și rebase-uri pe parcursul implementării
- minim 5 commit-uri relevante per student
- pull request-uri pentru bug fix și îmbunătățiri

## Șablon bug report

### Titlu

Descriere scurtă a problemei.

### Pași de reproducere

1. Deschide aplicația
2. Mergi la ecranul afectat
3. Execută acțiunea care produce eroarea

### Comportament așteptat

Ce ar trebui să se întâmple.

### Comportament actual

Ce se întâmplă în realitate.

### Mediu

- sistem de operare
- browser sau dispozitiv
- branch / commit

### Atașamente

- capturi de ecran
- log-uri relevante
- payload-uri API dacă este cazul

## Șablon pull request

### Rezumat

Ce modifică PR-ul și de ce.

### Detalii tehnice

- fișiere modificate
- schimbări de API
- impact asupra UI sau DB

### Verificare

- teste rulate
- scenarii verificate manual

### Checklist

- [ ] codul este formatat
- [ ] testele relevante trec
- [ ] documentația este actualizată
- [ ] nu există regressions cunoscute