# Browser Azure Cosmos DB Changefeed Sample

Simple app that shows using the Cosmos DB changefeed to get notifications of new items

** Caution: There is a lot of bad practices in here. Ignore anything but the code in TodoService. **

## Prereqs

- Node.js & npm
- Chrome (recommended, but you can theoretically replicate this in other browsers that support turning off CORS)
  - CORS isn't currently supported by Cosmos DB
- Cosmos endpoint (probably local emulator)
  - Cosmos DB named "TodoApp"
  - Cosmos Container named "Todo"
  - CORS must be enabled

## Installing

```
npm i
```

## Building

(Optional if using emulator) Add your production endpoint and key as environment variables, it will be injected into your code (note this is a bad practice, you shouldn't include your key in your source you publish, but this makes for a simpler demo. In a real app, use resource tokens)

```powershell
# powershell
$env:TODOAPP_ENDPOINT = "https://<dbaccount name>.documents.azure.com:443/"
$env:TODOAPP_KEY = "<key>"
```

App uses TypeScript + Webpack for building

```
npm run build
```

## Run the sample

```
npm start
```

## Run the sample (without setting CORS)

1. Start chrome (or another browser) without CORS

```
. "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir="C:/Chrome dev session" --disable-web-security
```

(path to your chrome install may differ)

2. Start the local webserver

```
npm start
```

## LICENSE

[MIT](./LICENSE)
