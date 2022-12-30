# WebSTAC to Calendar development branch

This branch contains all the code necessary to build the static HTML and CSS for **WebSTAC to Calendar**.

## Installation and running the dev server
1. Make sure you have the most recent version of Node.js (https://nodejs.org/en/).
2. On the command line, in the root directory of the repository, run `npm install`.
3. You will need a Google Calendar API key and an OAuth 2.0 client ID to make the app work.  See https://console.developers.google.com/ to get those.
    * When you create the API key, I recommend you add appropriate restrictions to prevent unauthorized use.  The most basic one is to add an HTTP referrer restriction of http://localhost:3000, which is the default run URL of the dev server.
4. Once you have those keys, create a new file called `.env.development.local` in the root of the repository.
5. Write the following two lines in the file, in the same style as `.env.production`.
```
REACT_APP_API_KEY=your_api_key
REACT_APP_OAUTH_CLIENT_ID=your_oauth_client_id
```
6. `npm start` on the command line.
7. Finally, if the app complains about your keys or environment variables, double-check them, and restart the server (Control-C and `npm start` again).


## Helpful links
* https://developers.google.com/calendar/api/guides/overview
* https://developers.google.com/calendar/api/quickstart/js
* https://developers.google.com/identity/protocols/googlescopes#calendarv3
* https://github.com/google/google-api-javascript-client


## Deploying your own version
Of course, you'll need your own webserver for this.

1. Change the `homepage` key in `package.json` to whereever you are hosting.
2. Change the keys in `.env.production` to whatever API keys you will be using.
3. Run `npm run build` on the command line.  This will output static HTML and Javascript that you can host.
