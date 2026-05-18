import { autorun, subscribe } from 'vue-meteor-tracker'

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
let DateTime
let Files
let Filter
let User
let ValidationError
let Accounts
let EJSON
let toast
let Languages
let XlsExportTreatment

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

  if (deps.DateTime) DateTime = deps.DateTime
  if (!DateTime && Bk?.DateTime) DateTime = Bk.DateTime

  if (deps.Files) Files = deps.Files
  if (!Files && Bk?.Files) Files = Bk.Files

  if (deps.Filter) Filter = deps.Filter
  if (!Filter && Bk?.Filter) Filter = Bk.Filter

  if (deps.User) User = deps.User
  if (!User && Bk?.User) User = Bk.User

  if (deps.Languages) Languages = deps.Languages
  if (!Languages && Bk?.Languages) Languages = Bk.Languages

  if (deps.XlsExportTreatment) XlsExportTreatment = deps.XlsExportTreatment
  if (!XlsExportTreatment && Bk?.XlsExportTreatment) XlsExportTreatment = Bk.XlsExportTreatment

  if (deps.ValidationError) ValidationError = deps.ValidationError
  if (!ValidationError && Bk?.ValidationError) ValidationError = Bk.ValidationError

  if (deps.Accounts) Accounts = deps.Accounts
  if (deps.EJSON) EJSON = deps.EJSON

  if (deps.toast) toast = deps.toast
}

export {
  Bk,
  Class,
  I18n,
  Role,
  autorun,
  subscribe,
  Meteor,
  Datatable,
  Lifecycle,
  Enum,
  ListField,
  DateTime,
  Files,
  Filter,
  User,
  ValidationError,
  Accounts,
  EJSON,
  toast,
  isClient,
  setBkUIContext,
  Languages,
  XlsExportTreatment
}
