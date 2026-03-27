import { autorun } from 'vue-meteor-tracker'

let Bk
let Class
let I18n
let Role
let Meteor
let isClient
let Datatable
let Lifecycle
let ListField
let Enum

const setBkUIContext = (deps = {}) => {
  if (deps.Bk) Bk = deps.Bk
  if (deps.Class) Class = deps.Class
  if (!Class && Bk?.Class) Class = Bk.Class

  if (deps.I18n) I18n = deps.I18n
  if (!I18n && Bk?.I18n) I18n = Bk.I18n

  if (deps.Role) Role = deps.Role
  if (!Role && Bk?.Role) Role = Bk.Role

  if (deps.isClient !== undefined) isClient = deps.isClient

  if (deps.Meteor) Meteor = deps.Meteor
  if (isClient === undefined) {
    if (deps.Meteor?.isClient !== undefined) isClient = deps.Meteor.isClient
  }

  if (deps.Datatable) Datatable = deps.Datatable
  if (!Datatable && Bk?.Datatable) Datatable = Bk.Datatable

  if (deps.Lifecycle) Lifecycle = deps.Lifecycle
  if (!Lifecycle && Bk?.Lifecycle) Lifecycle = Bk.Lifecycle
  
  if (deps.Enum) Enum = deps.Enum
  if (!Enum && Bk?.Enum) Enum = Bk.Enum

  if (deps.ListField) ListField = deps.ListField
  if (!ListField && Bk?.ListField) ListField = Bk.ListField
}

export {
  Bk,
  Class,
  I18n,
  Role,
  autorun,
  Meteor,
  Datatable,
  Lifecycle,
  Enum,
  ListField,
  isClient,
  setBkUIContext
}
