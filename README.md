# @akyma/bk-ui

BkUI (Vue 3 + Quasar) extracted as an NPM package.

## Local dev (no publish)

In your Meteor app:

1. Add local dependency in `package.json`:

```json
{
  "dependencies": {
    "@akyma/bk-ui": "file:../BkUI"
  }
}
```

2. Install:

```bash
meteor npm install
```

3. Use in the app:

```js
import BkUI from '@akyma/bk-ui'
import { Meteor } from 'meteor/meteor'
import * as Bk from 'meteor/akyma:bk'
import { EJSON } from 'meteor/ejson'
import { Accounts } from 'meteor/accounts-base'

app.use(BkUI, {
  Bk,
  Meteor: {
    ...Meteor,
    isClient: () => Meteor.isClient
  }
})

```

`BkUI` recovers `Class`, `I18n`, `Role`, `Datatable`, `ValidationError`, `Languages`, and `XlsExportTreatment` from `Bk` when available, so passing `Bk` is usually enough.

If you need to override or inject specific dependencies explicitly, you can still do:

```js
app.use(BkUI, {
  Bk,
  Meteor,
  Class,
  Accounts,
  EJSON
})
```

## Build

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Notes

- `BkTranslate` and `BkLabel` do **not** import Meteor packages directly.
- Provide Meteor dependencies via `app.use(BkUI, { ... })`.
- Pass a `Meteor` object exposing `isClient()` to stay compatible with current component usage.
