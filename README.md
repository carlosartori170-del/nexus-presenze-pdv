# Nexus — Portale presenze punti vendita

Interfaccia web per il pilota di inserimento presenze e produzione.

## Pubblicazione

GitHub Pages: branch `main`, cartella `/ (root)`. Il sito usa file statici, senza build. `.nojekyll` mantiene la pubblicazione dei file così come sono.

## Accesso

Il login applicativo usa Supabase Auth. Non occorrono account GitHub o ChatGPT agli utilizzatori del portale. Le autorizzazioni e le operazioni sono controllate nel database; il codice pubblico non contiene chiavi privilegiate.

## Pilota

Modalità TEST: le giornate non alimentano i risultati ufficiali. La firma dei dipendenti rimane cartacea. Le date effettive degli intervalli sono distinte dalla giornata lavorativa.

Il repository contiene soltanto i file pubblici del sito. Migrazioni, dati, credenziali privilegiate e documenti amministrativi non fanno parte della pubblicazione.

## Squadre abituali

Gli utenti abilitati alla gestione delle squadre possono modificare l’elenco abituale dei propri punti vendita, con periodi di validità, motivo e storico. Il foglio giornaliero consente di aggiungere una persona della rete per la sola giornata. Le anagrafiche esistenti sono riutilizzate e le giornate confermate rimangono invariate.
