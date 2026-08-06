# POC chat YCYW
Cette poc montre un échange en temps réel entre utilisateurs avec deux stacks: Angular et Spring Boot. L'échange se réalise grâce à un canal Websocket et reste minimal.

Le périmètre reste limité:
- création de faux utilisateurs
- conversation avec messages en temps réel
- pas d'auth et pas de base de données

## Structure du projet:
- chatpoc: API Spring Boot avec Websocket Stomp
- frontchatpoc: interface Angular

## Prérequis:
- Java 21
- Maven 3.9.12
- Node 24.11.1
- npm 11.6.2
- angular 21.2

## Lancement du projet:
1) Backend
- Ouvrir une console dans le dossier "chatpoc"
- mvn spring-boot:run
- Backend disponible sur http://localhost:8080

2) Frontend
- Ouvrir une console dans le dossier "frontchatpoc"
- npm install
- npm start
- Frontend disponible sur http://localhost:4200

## Scénario de test
- Démarer les deux stacks 
- Ouvrir deux navigateurs sur http://localhost:4200
- Créer un utilisateur sur les deux navigateurs
- Envoyer des messages

## Compréhention code
Pour comprendre le projet, lisez et analysez les fichiers
1) frontchatpoc/src/app/app.html Pour visualiser l'interface graphique.
2) frontchatpoc/src/app/app.ts Pour voir comme la page s'initialise et envoie les données.
3) frontchatpoc/src/app/service/websocket-service.ts Pour comprendre la connexion WebSocket côté Angular.
4) chatpoc\src\main\java\com\ycym\chatpoc\controller\WsChatController.java Pour comprendre la connexion WebSocket et voir la réception des messages côté Spring.
5) chatpoc\src\main\java\com\ycym\chatpoc\controller\WebSocketConfig.java Pour comprendre la configuration WebSocket côté Spring.

## Rôle des fichiers principaux
- frontchatpoc/**/app.html Structure l'interface graphique.
- frontchatpoc/src/app/app.ts Logique écran, chargement initial, création d'utilisateur et envoie des messages.
- frontchatpoc/**/websocket-service.ts connexion WebSocket, abonnement à la conversation et publication des messages.
- chatpoc/**/WsChatController.java Recoit et diffuse les messages et abonne le sutilisateurs au canal.
- chatpoc/**/WebSocketConfig.java Déclare l'endpoint ("ws), le préfix d'entréé ("app") et le broker ("topic").

## Evolution de la poc
- modifier l'interface: commencer par frontchatpoc/src/app/app.html et app.css
- créer des canaux pour chaque discution, modifier frontchatpoc/src/app/service/websocket-service.ts à la ligne 50 pour enlever la connexion "public" et créer des canaux privés.