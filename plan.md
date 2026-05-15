## Plan de migration BkUI (Vue3 + Quasar)

Objectif: migrer les composants récupérés Vue2/BootstrapVue vers Vue3/Quasar avec parité fonctionnelle maximale, et sans import direct meteor/* dans les composants de BkUI.

### Statut actuel
- Fondation technique, wrappers communs et composants transverses migrés.
- Les derniers composants lourds, dont `BkTable` et `BkFile`, sont passés sur Quasar.
- Les balises BootstrapVue restantes dans `src/tags` ont été supprimées.
- Vérification fonctionnelle finale à faire dans l’application hôte si besoin, surtout pour les flux riches en slots et drag-and-drop.

### 1) Fondations techniques
- Etendre le contexte dans `src/bridge/context.js` pour exposer toutes les dépendances runtime nécessaires.
- Etendre le plugin dans `src/index.js` pour propager les dépendances via `app.use(BkUI, { ... })`.
- Réintroduire les utilitaires manquants dans `src/utils/` en reprise ciblée depuis Bk:
  - `applyDrag.js`
  - `errorPopupMixin.js` (adapté Quasar Notify)
  - `relationSubscriptionMixin.js` (version partielle utile)

### 2) Primitives UI
- Migrer d’abord les composants simples et transverses:
  - `BkLoading`, `BkBreadCrumb`, `BkFilters`, `BkPagination`, `BkDropdown`, `BkActionableBadges`, `BkDatalistInput`.
- Remplacer systématiquement les composants `b-*` par leurs équivalents Quasar.

### 3) Noyau formulaires / inputs
- Migrer:
  - `BkForm`, `BkSubmit`, `BkFieldList`, `BkInput`, `BkInnerInput`, `BkDatePicker`, `BkBelongsToInput`, `BkBelongsToMany`, `BkCardListClass`.
- Conserver les règles métier actuelles (permissions, validation, required/optional, debounce).

### 4) Composants métier lourds
- Migrer:
  - `BkTable`, `BkButtonIcon`, `BkModal`, `BkFile`, `BkExportToXlsxButton`, `BkPage`.
- Garantir la parité sur les flux critiques:
  - import/export,
  - filtres/tri/pagination,
  - drag and drop,
  - lifecycle transitions,
  - modales et notifications.

### 5) Vues finales
- Migrer:
  - `BkLanguage`, `BkLogin`, `BkSubscribe`, `BkChangePassword`, `BkResetPassword`, `BkParameterTables`, `BkParameterTableElements`, `BkTranslations`, `BkView`, `BkViewInner`.

### 6) Vérification
- Vérifier la suppression des patterns legacy:
  - `meteor: {}`
  - `$bvModal`, `$bvToast`
  - `$subscribe`, `$subReady`, `$autorun`
  - `$scopedSlots`
  - `destroyed`, `beforeDestroy`
- Vérifier le build BkUI puis smoke test dans le projet Meteor 3 + Quasar 2.
- Refaire un passage visuel sur les composants les plus sensibles aux slots: `BkTable`, `BkFile`, `BkButtonIcon`, `BkBelongsToMany`, `BkModal`.
