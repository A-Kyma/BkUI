<template>
    <q-breadcrumbs>
        <q-breadcrumbs-el :to="'/'">
            <q-icon name="home" class="q-mr-xs" />
            <t>route.home.title</t>
        </q-breadcrumbs-el>
        <q-breadcrumbs-el v-for="item in routeArray" :key="item">
            <t>{{ item }}</t>
        </q-breadcrumbs-el>
    </q-breadcrumbs>
</template>
<script>
import { QBreadcrumbs, QBreadcrumbsEl, QIcon } from 'quasar'

export default {
    name: 'BkBreadCrumb',
    components: { QBreadcrumbs, QBreadcrumbsEl, QIcon },
    computed: {
        routeArray() {
            if (!this.$route?.matched?.length) return []

            const routeStr = this.$route.matched[0].path.substring(1)
            const param = this.$route.params || {}
            const title = this.$route.meta?.title || ''

            if (!routeStr) return []
            const routeArr = routeStr.split('/')

            for (let i = 0; i < routeArr.length; i++) {
                if (routeArr[i].indexOf(':') > -1) {
                    if (routeArr[i] === ':id') {
                        if (title.indexOf('.') > -1) {
                            routeArr[i] = title
                        } else {
                            routeArr[i] = 'route.' + title + '.title'
                        }
                    } else {
                        const paramValue = param[routeArr[i].replace(':', '')]
                        routeArr[i] = 'route.' + paramValue + '.title'
                    }
                } else {
                    routeArr[i] = 'route.' + routeArr[i] + '.title'
                }
            }

            return routeArr
    }
    }
}
</script>
<style scoped>
</style>