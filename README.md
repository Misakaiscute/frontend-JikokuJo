# JikokuJó, a public transport helper.

## JikokuJó is trusty companion for finding your way around the streets of Budapest, created by Máté Demény and Hunor Horchy as part of their highschool exit masterpiece.

## Using offcial data from the local public transport provider (BKK), the app is capable of:
- ### 🔎 Searching for either line numbers or specific stops around Budapest for a given timeframe.
- ### 🗺️ Displaying the route of any local vehicle on the map.
- ### 📌 Following the line on its way if the given vehicle is equipped with trackers.
- ### ⭐ Storing users favorite trips and notifying them about it them depending on how the user set it up.
- ### ✈️ Sharing routes as links with friend to aid with planning.

## Using what?

### This part of the project is a web based SPA, which was written in [Svelte](https://svelte.dev) and [TypeScript](https://www.typescriptlang.org), using [Tailwind](https://tailwindcss.com) for styling. Utilizing [Vite](https://vite.dev) as the modular bundler for it's help with live reloading during development.
### For calling the api's endpoints [Axios](https://axios-http.com), and to to connect to the websocket server [Laravel Echo](https://github.com/laravel/echo) was used.
### The package manager for this project is [npm](https://www.npmjs.com).

## How to install
### Requirements:
- #### Node.js version 20.19 or higher
- #### Internet access

### Installation process:
0. #### As the [api](https://github.com/Misakaiscute/backend-JikokuJo) is necessary to use this app, it's highly recommended to set that up first.
1. #### Clone the repository into your selected directory
2. #### Run **npm install** command from the directory, to install the apps dependencies.
3. #### Editing the **.env.example** file if required, and renaming it to **.env**. (If you didn't change any .env varibles on the api, all there is to do is the renaming.)
4. #### Run **npm run dev** command from the directory, to serve the application. 
5. #### Go to **http://localhost:5173** in your choosen browser.
6. #### 🏁You're done🏁

## ⚠️Warning⚠️
### This is just one repository of the three, which make up the complete project. This repository doesn't provide any functionality without the [api](https://github.com/Misakaiscute/backend-JikokuJo), and for the full experience please consider checking out the [mobile app](https://github.com/Misakaiscute/mobile-JikokuJo).