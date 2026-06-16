# Raport privind folosirea AI

## AI în produs

Aplicația folosește AI la runtime în două moduri:

- agent de triaj pentru pacient, care pune întrebări și generează răspuns final
- agent de sumarizare, care transformă o sesiune într-un raport clinic pentru medic

Acestea sunt integrate prin backend și folosesc un model local prin Ollama.

## Rolul AI în dezvoltare

În dezvoltarea proiectului, AI a fost util pentru:

- brainstorming de structură pentru documentație
- generare de draft-uri pentru diagrame și workflow-uri
- clarificarea rolului componentelor și a fluxurilor dintre ele
- redactarea unor șabloane pentru bug report și pull request

## Cum a fost folosit responsabil

- rezultatele AI au fost verificate manual în cod și în execuție
- logica principală a rămas în repo, nu în prompturi externe
- răspunsurile AI din aplicație sunt limitate de reguli explicite și de validări backend
- pentru date medicale, output-ul este tratat ca orientativ, nu ca diagnostic definitiv

## Ce trebuie menționat la prezentare

- AI-ul nu înlocuiește medicul
- există o separare clară între datele utilizatorului și generarea răspunsului
- sistemul folosește profilul medical doar ca context de triere
- sumarizarea sesiunii este destinată medicului, nu utilizatorului final

## Concluzie

Proiectul respectă cerința cu minim 2 agenți AI la nivel de implementare și are o integrare clară, documentată și testabilă.