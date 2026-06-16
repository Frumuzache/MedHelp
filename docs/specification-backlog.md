# Specificații și backlog

## Scopul produsului

MedHelp ajută utilizatorul să își descrie simptomele într-un chat ghidat, iar backend-ul folosește profilul medical și un model AI local pentru a genera întrebări de clarificare și un răspuns final orientativ.

## Cerințe funcționale

### 1. Autentificare și profil

- utilizatorul se poate înregistra
- utilizatorul se poate autentifica
- aplicația salvează profilul medical în MongoDB
- backend-ul returnează un profil safe pentru UI

### 2. Triage medical

- utilizatorul poate trimite mesaje în chat
- backend-ul păstrează contextul conversației pe email
- agentul AI pune întrebări scurte, de tip clarificare
- conversația se poate încheia cu un rezultat final

### 3. Modul partener/medic

- partenerul se poate autentifica separat
- partenerul poate vedea sesiunile finalizate
- partenerul poate cere sumarizarea unei sesiuni

## Cerințe nefuncționale

- răspunsuri rapide pentru fluxul de chat
- separare clară între frontend, backend și AI
- validare de input pe backend
- arhitectură ușor de extins pentru alte tipuri de profiluri și rapoarte
- utilizare responsabilă a AI, cu mesaje orientative și disclaimer

## Backlog propus

| Prioritate | Item | Status |
|---|---|---|
| P1 | login/register utilizator | realizat |
| P1 | profil medical în MongoDB | realizat |
| P1 | chat de triaj cu AI | realizat |
| P1 | partener login și dashboard | realizat |
| P1 | sumarizare sesiune pentru medic | realizat |
| P2 | persistarea completă a istoricului chat | de făcut |
| P2 | salvarea structurată a rapoartelor clinice | de făcut |
| P2 | filtre și căutare pentru sesiunile partenerului | de făcut |
| P3 | notificări și alerte pentru cazuri urgente | de făcut |
| P3 | rapoarte statistice pe utilizatori/sesiuni | de făcut |

## User stories

- ca utilizator, vreau să completez profilul medical ca să primesc întrebări mai relevante
- ca utilizator, vreau să continui conversația fără să pierd contextul
- ca medic, vreau un sumar al sesiunii ca să înțeleg rapid cazul
- ca administrator, vreau teste automate ca să verific fluxurile critice

## Definiție de done

O funcționalitate este considerată gata dacă:

- are implementare în frontend și backend, după caz
- are validare și tratament de eroare
- este documentată în acest set de fișiere
- are cel puțin un test relevant sau un motiv clar pentru lipsa lui