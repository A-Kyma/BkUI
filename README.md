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
import BkUI, { Class } from '@akyma/bk-ui'
import { autorun } from 'vue-meteor-tracker'
import { Role, I18n, Bk } from 'meteor/akyma:bk'
import { useQuasar } from 'quasar'

app.use(BkUI, {Bk, isClient: () => Meteor.isClient, I18n, Role, Class})
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
