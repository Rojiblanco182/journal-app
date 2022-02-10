<template>
    <Navbar />

    <div class="d-flex">
        <div class="col-4">
            <EntryList />
        </div>
        <div class="col">
            <router-view />
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapActions } from 'vuex'

export default {
    components: {
        Navbar: defineAsyncComponent(() => import(/* webpackChunkName: "navbar" */ '@/modules/daybook/components/Navbar.vue')),
        EntryList: defineAsyncComponent(() => import(/* webpackChunkName: "entryList" */ '@/modules/daybook/components/EntryList.vue'))
    },
    methods: {
        ...mapActions('journal', ['loadEntries'])
    },
    created() {
        this.loadEntries()
    }
}
</script>