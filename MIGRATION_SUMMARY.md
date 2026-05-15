# BkUI Migration Summary

This document summarizes the Vue 2 / BootstrapVue to Vue 3 / Quasar migration work completed in this workspace, with the main reason for each change and the main regression risks to watch.

## Global outcome

- Runtime dependencies were centralized through `src/bridge/context.js` and exposed by `src/index.js`.
- Missing shared utilities were restored locally in `src/utils/`.
- Most UI primitives, form wrappers, relation inputs, and the heavier file/table/modal components were migrated to Quasar.
- The `src/tags` tree no longer contains BootstrapVue template tags.

## File-by-file notes

| File | Why it changed | Main risk |
| --- | --- | --- |
| `src/bridge/context.js` | Centralized Meteor, Astronomy, i18n, accounts, tracker, toast, and shared Bk dependencies for Vue 3 components. | A missing export or fallback could break components that still rely on implicit runtime globals. |
| `src/index.js` | Extended plugin provisioning so the migrated components receive the full context surface through the app install path. | A provider mismatch can leave some components with `undefined` services at runtime. |
| `src/utils/applyDrag.js` | Reintroduced the shared drag reorder helper used by `vue-smooth-dnd` containers. | Incorrect reorder handling would affect card/file/table drag-and-drop behavior. |
| `src/utils/errorPopupMixin.js` | Adapted error and success notification handling to Quasar notifications while keeping the old API shape. | Error messages or toast behavior may differ slightly from the legacy BootstrapVue flow. |
| `src/utils/relationSubscriptionMixin.js` | Rebuilt the shared relation subscription/search/select logic for belongs-to inputs on Vue 3. | This is the most slot- and state-sensitive utility, so search, clear, and cache behavior need UI smoke testing. |
| `src/tags/datatable/BkFilters.vue` | Replaced the Bootstrap-style demo filter bar with Quasar form controls and grid layout. | If anything consumes it as a demo fixture, placeholder values and option behavior may differ. |
| `src/tags/datatable/BkPagination.vue` | Swapped `b-pagination` for `q-pagination` and kept the scroll-based “see more” path. | Page count calculation and scroll observer behavior should be checked on real data sets. |
| `src/tags/datatable/BkTable.vue` | Migrated the remaining heavy datatable shell: filter header, card mode, drag handle, and Quasar layout wrappers. | This file has many slots and mixed modes, so a missing slot or styling regression is the highest remaining risk. |
| `src/tags/files/BkFile.vue` | Converted image preview, upload, avatar, list, progress, and drag-drop UI to Quasar primitives. | Upload/preview flows, image modal behavior, and list management should be smoke-tested with real files. |
| `src/tags/forms/BkCardListClass.vue` | Replaced Bootstrap cards, rows, selects, and buttons with Quasar equivalents while keeping drag sorting. | The per-item slots and subclass insertion controls could regress if a consumer relies on Bootstrap markup. |
| `src/tags/forms/BkChangePassword.vue` | Updated imports to the bridge context and cleaned the form submission flow for Vue 3. | Minimal, but password validation and success navigation should still be exercised. |
| `src/tags/forms/BkFieldList.vue` | Switched direct Astronomy imports to the shared context. | Low risk, mostly dependency wiring. |
| `src/tags/forms/BkForm.vue` | Replaced Bootstrap form, overlay, and alert containers with native form + Quasar feedback components. | Slot forwarding and overlay visibility are critical and should be checked in nested forms. |
| `src/tags/forms/BkLogin.vue` | Removed Bootstrap links and aligned Meteor/account imports with the shared context. | Login and password reset flows should be checked for event handling and navigation. |
| `src/tags/forms/BkResetPassword.vue` | Updated context imports and cleaned Vue 3 syntax. | Password reset and route-token handling remain sensitive. |
| `src/tags/forms/BkSubmit.vue` | Replaced Bootstrap action buttons with Quasar buttons while preserving submit/reset/cancel semantics. | Button visibility rules and cancel emission need to stay aligned with existing forms. |
| `src/tags/forms/BkSubscribe.vue` | Migrated subscribe form overlay, alert, and fields to Quasar/native components. | Subscription form validation and error display remain at moderate risk. |
| `src/tags/inputs/BkActionableBadges.vue` | Replaced Bootstrap badges/plaintext wrappers with Quasar badges and a custom plaintext style. | Badge color mapping and click-to-select behavior could differ from the old look. |
| `src/tags/inputs/BkBelongsToInput.vue` | Rebuilt the single relation selector around `q-select` and the shared relation mixin. | This is slot-sensitive and search-sensitive; dropdown behavior and validation should be smoke-tested. |
| `src/tags/inputs/BkBelongsToMany.vue` | Migrated the multi-relation input from `vue-multiselect` to `q-select` while preserving option/tag slots. | Slot compatibility and tag creation are the main regression risks. |
| `src/tags/inputs/BkDatalistInput.vue` | Replaced Bootstrap datalist wiring with Quasar input plus native datalist markup. | Datalist option rendering and parent event expectations should be checked. |
| `src/tags/inputs/BkDatePicker.vue` | Migrated date/time selection to Quasar inputs and `q-date`. | Date/time formatting and disabled-state behavior may need manual verification. |
| `src/tags/inputs/BkDropdown.vue` | Replaced the Bootstrap dropdown with `q-btn-dropdown` and `q-list` items. | Menu click handling and selected label computation should be checked. |
| `src/tags/inputs/BkInnerInput.vue` | Converted the inner field renderer away from Bootstrap input groups and groups of controls to Quasar/native controls. | This is a core abstraction, so any slot or field-type mapping mistake could affect many forms. |
| `src/tags/inputs/BkInput.vue` | Replaced the Bootstrap card/collapse/form-group shell with Quasar expansion and card sections. | Accordion behavior, validation display, and label slots are important regression points. |
| `src/tags/inputs/BkTextEditor.vue` | Swapped the rich-text toolbar buttons/icons for Quasar button groups and icons. | Editor toolbar actions and active-state styling should be checked. |
| `src/tags/links/BkButtonIcon.vue` | Migrated the shared action/link button component to Quasar while preserving import modal and inline action behavior. | This component is heavily slot-driven, so a missing slot or action case could affect many places at once. |
| `src/tags/links/BkExportToXlsxButton.vue` | Replaced the Bootstrap overlay/button shell with a Quasar button and kept the fallback action path. | Export availability and disabled/busy handling should be verified with real exports. |
| `src/tags/loading/BkLoading.vue` | Mapped legacy spinners/icons to Quasar spinners. | Visual-only, but the loading states should still be checked in dialogs and async flows. |
| `src/tags/modals/BkModal.vue` | Replaced `b-modal` with `q-dialog`/`q-card` while preserving show/hide and ok/cancel behavior. | Modal lifecycle, subscription readiness, and confirm/cancel semantics remain sensitive. |
| `src/tags/routes/BkBreadCrumb.vue` | Migrated the breadcrumb UI to Quasar breadcrumbs and icons. | Route title generation and parameter substitution should be checked on nested routes. |
| `src/tags/translation/BkLanguage.vue` | Replaced Bootstrap nav/dropdown/row constructs with Quasar dropdown, list, and button variants. | Flag menu behavior and close-on-select logic need a quick UI check. |
| `src/tags/views/BkTranslations.vue` | Migrated the translation editor cell input and loading state to Quasar controls. | Inline editing, async save feedback, and translate action slots should be verified. |

## Notes on compatibility

- Existing slots were preserved wherever the component API depended on them, especially in `BkTable`, `BkButtonIcon`, `BkBelongsToMany`, `BkForm`, and `BkInput`.
- `vue-smooth-dnd` was intentionally kept for drag-and-drop; Quasar does not provide a drop-in replacement for that behavior.
- The most likely feature regressions are not compile errors but missing slot content, altered styling, or slightly different keyboard/focus behavior.

## Verification status

- `grep -R "<b-" -n src/tags | cut -d: -f1 | sort -u` returns no files, which means no BootstrapVue template tags remain under `src/tags`.
- `get_errors` was clean on the touched files after the main edits.
- A real smoke test in the host Meteor 3 + Quasar 2 app is still the best final check for tables, file uploads, relation selects, and modal workflows.