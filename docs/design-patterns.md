# Design patterns folosite

## 1. Controller-Service

Backend-ul separă rutele HTTP de logica de business:

- controller-ele validează și orchestrează cererea
- service-urile se ocupă de autentificare, DB și apeluri externe

Avantaj: codul este mai ușor de testat și de extins.

## 2. Facade pentru integrarea AI

`medicalAgent` și `summaryAgent` ascund detaliile de apelare Ollama și expun o interfață simplă.

Avantaj: restul aplicației nu trebuie să cunoască prompturi sau detalii de transport.

## 3. Factory / state builder pentru conversație

`createMedicalChatState()` creează starea inițială a conversației pentru un utilizator.

Avantaj: fiecare sesiune pornește de la o structură consistentă.

## 4. Strategy-like prompts

Agentul medical și agentul de sumarizare folosesc prompturi diferite pentru scopuri diferite.

Avantaj: poți schimba strategia fiecărui agent independent.

## 5. In-memory session map

Sesiunile de chat sunt ținute într-un `Map` indexat după email.

Avantaj: conversația rămâne rapidă și izolată pe utilizator.

Limitare: starea se pierde la restart-ul serverului.

## 6. Route guarding pentru parteneri

Rutele din zona de parteneri verifică JWT-ul și rolul înainte de acces.

Avantaj: separă clar accesul pacient / partener.

## 7. Dependency injection naturală în Angular

Frontend-ul folosește servicii separate pentru auth, chat și AI.

Avantaj: componentele rămân subțiri și ușor de reutilizat.