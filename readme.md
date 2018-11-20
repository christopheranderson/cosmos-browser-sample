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

## Installing

```
npm i
```

## Building

App uses TypeScript + Webpack for building

```
npm run build
```

## Run the sample

1. Start chrome (or another browser) without CORS

```
. "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir="C:/Chrome dev session" --disable-web-security
```

(path to your chrome install may differ)

2. Start the local webserver

```
npm run start
```

## LICENSE

[MIT](./LICENSE)
