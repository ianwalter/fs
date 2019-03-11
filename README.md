# @ianwalter/fs
> A Proxy over Node's fs module to make it Promise-based and add events

[![npm page][npmImage]][npmUrl]

## Features

1. Use Promises and/or async/await with async fs methods, e.g.:
   ```js
   const text = await fs.readFile('./top-secret.txt')
   ```
2. Subscribe to filesystem events from anywhere, e.g.:
   ```js
   fs.sub('./top-secret.txt', action => {
     console.log(action.name, action.args)
   })
   ```
3. Control async filesystem events through subscriptions, e.g.:
   ```js
   fs.sub('./top-secret.txt', async action => {
     if (action.name === 'writeFile') {
       throw new Error('How dare you!? You have no write!')
     }
   })
   ```

## Installation

```console
yarn add @ianwalter/fs
```

## License

Apache 2.0 with Commons Clause - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://iankwalter.com)

[npmImage]: https://img.shields.io/npm/v/@ianwalter/fs.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/fs
[licenseUrl]: https://github.com/ianwalter/fs/blob/master/LICENSE
