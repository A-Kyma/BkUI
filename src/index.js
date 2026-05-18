import BkTranslate from './tags/translation/BkTranslate.vue'
import BkLabel from './tags/forms/BkLabel.vue'
import BkViewClean from './tags/views/BkViewClean.vue'
import BkActionableBadges from './tags/inputs/BkActionableBadges.vue'
import BkBelongsToInput from './tags/inputs/BkBelongsToInput.vue'
import BkBelongsToMany from './tags/inputs/BkBelongsToMany.vue'
import BkDatalistInput from './tags/inputs/BkDatalistInput.vue'
import BkDatePicker from './tags/inputs/BkDatePicker.vue'
import BkDropdown from './tags/inputs/BkDropdown.vue'
import BkInnerInput from './tags/inputs/BkInnerInput.vue'
import BkInput from './tags/inputs/BkInput.vue'
import BkTextEditor from './tags/inputs/BkTextEditor.vue'
import BkTable from './tags/datatable/BkTable.vue'
import BkPagination from './tags/datatable/BkPagination.vue'
import BkFilters from './tags/datatable/BkFilters.vue'
import BkBreadCrumb from './tags/routes/BkBreadCrumb.vue'
import BkParameterTableElements from './tags/views/BkParameterTableElements.vue'
import BkParameterTables from './tags/views/BkParameterTables.vue'
import BkPage from './tags/views/BkPage.vue'
import BkTranslations from './tags/views/BkTranslations.vue'
import BkView from './tags/views/BkView.vue'
import BkViewInner from './tags/views/BkViewInner.vue'
import BkFile from './tags/files/BkFile.vue'
import BkButtonIcon from './tags/links/BkButtonIcon.vue'
import BkExportToXlsxButton from './tags/links/BkExportToXlsxButton.vue'
import BkModal from './tags/modals/BkModal.vue'
import BkLanguage from './tags/translation/BkLanguage.vue'
import BkLoading from './tags/loading/BkLoading.vue'
import BkCardListClass from './tags/forms/BkCardListClass.vue'
import BkChangePassword from './tags/forms/BkChangePassword.vue'
import BkFieldList from './tags/forms/BkFieldList.vue'
import BkForm from './tags/forms/BkForm.vue'
import BkLogin from './tags/forms/BkLogin.vue'
import BkResetPassword from './tags/forms/BkResetPassword.vue'
import BkSubmit from './tags/forms/BkSubmit.vue'
import BkSubscribe from './tags/forms/BkSubscribe.vue'
import {
  setBkUIContext,
  Bk,
  Class,
  I18n,
  Role,
  autorun,
  subscribe,
  Meteor,
  isClient,
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
  Tracker,
  toast
} from './bridge/context'

const BKUI_SYMBOL = Symbol('bkui')

const components = {
  BkTranslate,
  BkLabel,
  BkViewClean,
  BkActionableBadges,
  BkBelongsToInput,
  BkBelongsToMany,
  BkDatalistInput,
  BkDatePicker,
  BkDropdown,
  BkInnerInput,
  BkInput,
  BkTextEditor,
  BkTable,
  BkPagination,
  BkFilters,
  BkBreadCrumb,
  BkParameterTableElements,
  BkParameterTables,
  BkPage,
  BkTranslations,
  BkView,
  BkViewInner,
  BkFile,
  BkButtonIcon,
  BkExportToXlsxButton,
  BkModal,
  BkLanguage,
  BkLoading,
  BkCardListClass,
  BkChangePassword,
  BkFieldList,
  BkForm,
  BkLogin,
  BkResetPassword,
  BkSubmit,
  BkSubscribe
}

const createBkUI = (options = {}) => {
  const defaults = {
    Bk: null,
    Class: null,
    I18n: null,
    Role: null,
    autorun: null,
    Datatable: null,
    Lifecycle: null,
    Enum: null,
    ListField: null,
    DateTime: null,
    Files: null,
    Filter: null,
    User: null,
    ValidationError: null,
    Accounts: null,
    EJSON: null,
    Tracker: null,
    isClient: null,
    toast: null
  }
  return { ...defaults, ...options }
}

const BkUI = {
  install(app, options = {}) {
    const deps = createBkUI(options)
    setBkUIContext(deps)
    app.provide(BKUI_SYMBOL, deps)

    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })

    // Backward-compatible alias
    app.component('t', BkTranslate)
  }
}

export {
  BkUI,
  BKUI_SYMBOL,
  BkTranslate,
  BkLabel,
  BkViewClean,
  BkActionableBadges,
  BkBelongsToInput,
  BkBelongsToMany,
  BkDatalistInput,
  BkDatePicker,
  BkDropdown,
  BkInnerInput,
  BkInput,
  BkTextEditor,
  BkTable,
  BkPagination,
  BkFilters,
  BkBreadCrumb,
  BkParameterTableElements,
  BkParameterTables,
  BkPage,
  BkTranslations,
  BkView,
  BkViewInner,
  BkFile,
  BkButtonIcon,
  BkExportToXlsxButton,
  BkModal,
  BkLanguage,
  BkLoading,
  BkCardListClass,
  BkChangePassword,
  BkFieldList,
  BkForm,
  BkLogin,
  BkResetPassword,
  BkSubmit,
  BkSubscribe
}
export {
  Bk,
  Class,
  I18n,
  Role,
  autorun,
  subscribe,
  isClient,
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
  Tracker,
  toast
}
export default BkUI
