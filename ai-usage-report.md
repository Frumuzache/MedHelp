# Raport privind folosirea AI în dezvoltare

Acest document descrie modul în care instrumentele AI au fost folosite ca parte a procesului de dezvoltare al proiectului — scriere și revizuire de cod, rezolvare de conflicte, documentație tehnică. Agenții AI care rulează în aplicație (triaj medical, sumarizare clinică) sunt funcționalitate de produs și sunt descriși separat, în `README.md`.

## De ce am folosit agenți AI în dezvoltare

Proiectul are mai multe componente care evoluează în paralel (backend, frontend Angular, aplicație mobilă Flutter, documentație), dezvoltate de mai mulți membri ai echipei pe branch-uri separate. Agenții AI au fost integrați în fluxul de lucru ca un colaborator suplimentar, capabil să:

- scrie și să adapteze cod pe baza contextului existent în repo, nu izolat
- intervină rapid pe sarcini bine delimitate (fix de bug, hardening, documentație) fără să blocheze restul echipei
- ofere o a doua "pereche de ochi" la integrarea modificărilor venite din branch-uri diferite

## Cum au fost folosiți agenții AI pe parcursul dezvoltării

### Rezolvarea conflictelor și integrarea codului

Când branch-uri dezvoltate în paralel (de exemplu partea de aplicație mobilă) au divergat de `main`, am folosit un agent de cod (GitHub Copilot coding agent) pentru a integra modificările și a rezolva conflictele de merge. Agentul nu s-a limitat la o îmbinare mecanică a textului: a analizat ambele variante de cod, a produs o versiune combinată funcțională a widget-urilor afectate și, în plus, a întărit codul rezultat — a adăugat tratare de erori în jurul fluxului de logout și protecții suplimentare în componentele combinate, acolo unde îmbinarea automată ar fi putut lăsa cazuri nete neacoperite. Rezultatul a fost integrat prin pull request, ca orice altă contribuție, și revizuit înainte de a ajunge pe `main`.

### Asistență la scrierea și structurarea codului

Pe parcursul dezvoltării, agenți AI au fost folosiți punctual pentru a accelera scrierea de cod repetitiv sau bine specificat (validări, mapări de date, structuri de componente noi), pentru a propune soluții la erori specifice și pentru a sugera mici optimizări de prompt și performanță pe partea de integrare cu modelul AI din aplicație. În toate cazurile, codul generat a fost citit, testat și ajustat de echipă înainte de commit — agentul a fost tratat ca un instrument care propune o primă variantă, nu ca sursă finală de adevăr.

### Documentație tehnică

Documentația proiectului (arhitectură, diagrame, specificații, backlog, proces de testare și Git, design patterns) a fost generată și organizată cu ajutorul unui asistent AI (Claude Code), care a citit codul sursă real al backend-ului și al agenților AI din aplicație pentru a produce diagrame și descrieri corecte ale fluxurilor existente, nu generice. Asistentul a fost folosit și pentru a consolida documentația — inițial împrăștiată în mai multe fișiere separate — într-un singur loc, ușor de parcurs pentru evaluare și prezentare.

## Cum a fost folosit responsabil

- tot codul și toată documentația generate cu ajutorul AI au fost verificate manual de echipă înainte de a fi integrate
- contribuțiile agenților AI au trecut prin același flux de pull request și revizuire ca restul codului, vizibile în istoricul Git
- AI-ul a fost folosit ca accelerator pentru sarcini clar definite, nu pentru decizii de arhitectură sau de produs — acestea au rămas la latitudinea echipei

## Concluzie

Agenții AI au fost integrați natural în procesul de dezvoltare al proiectului: de la rezolvarea conflictelor de merge și întărirea codului pe partea de mobil, la accelerarea scrierii de cod și la generarea documentației tehnice. Folosirea lor a fost responsabilă și verificabilă — fiecare contribuție a trecut prin revizuire umană și prin fluxul standard de pull request înainte de a deveni parte din proiect.
