import { autorun as meteorAutorun } from 'vue-meteor-tracker'

let Bk
let Class
let I18n
let Role
let autorun = meteorAutorun
let isClient
let toast

const setBkUIContext = (deps = {}) => {
  if (deps.Bk) Bk = deps.Bk
  if (deps.Class) Class = deps.Class
  if (!Class && Bk?.Class) Class = Bk.Class

  if (deps.I18n) I18n = deps.I18n
  if (!I18n && Bk?.I18n) I18n = Bk.I18n

  if (deps.Role) Role = deps.Role
  if (!Role && Bk?.Role) Role = Bk.Role

  if (deps.autorun) autorun = deps.autorun
  if (deps.isClient !== undefined) isClient = deps.isClient
  if (deps.toast) toast = deps.toast
}

export {
  Bk,
  Class,
  I18n,
  Role,
  autorun,
  isClient,
  toast,
  setBkUIContext
}
