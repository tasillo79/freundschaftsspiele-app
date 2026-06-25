# WM 2026 Tippspiel (Deutschland-Spiele)

Internes Tippspiel für die Fussball-WM 2026. Mehrere Personen können sich mit ihrem Namen
anmelden, Tipps für die Deutschland-Spiele abgeben und sich nach Abschluss der WM in der
Tabelle vergleichen.

## Funktionen

- Jede Person meldet sich nur mit ihrem Namen an (kein Passwort nötig).
- Tipps werden zentral auf dem Server gespeichert (`server/data/store.json`), damit alle
  Teilnehmer den gleichen Stand sehen.
- Ein Admin-Bereich (geschützt durch `ADMIN_PASSWORD`) erlaubt das Anlegen der
  Deutschland-Spiele und das Eintragen der Endergebnisse.
- Punktevergabe: 5 Punkte für das exakte Ergebnis, 2 Punkte für die richtige Tendenz
  (Sieg/Niederlage/Unentschieden), 0 Punkte sonst.
- Sobald ein Ergebnis eingetragen ist, kann der Tipp für dieses Spiel nicht mehr geändert werden.

## Starten

`ADMIN_PASSWORD` muss gesetzt sein, sonst startet der Server nicht (es gibt keinen
Standardwert).

```bash
npm install
ADMIN_PASSWORD=meinpasswort npm run dev   # startet Backend (Port 4000) und Frontend (Port 3000) gleichzeitig
```

Nur das Backend starten:

```bash
ADMIN_PASSWORD=meinpasswort npm run server
```

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
