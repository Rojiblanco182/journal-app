<template>
    <div class="entry-list-container">
        <div class="px-2 pt-2">
            <input 
                type="text"
                class="form-control"
                placeholder="Buscar entrada"
            />
        </div>

        <div class="entry-scrollarea">
            <h2
                v-for="item in getEntriesByTerm"
                :key="item"
            >
                <Entry />
            </h2>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapGetters } from 'vuex'
export default {
    components: {
        Entry: defineAsyncComponent(() => import(/* webpackChunkName: "Entry" */ '@/modules/daybook/components/Entry.vue'))
    },
    computed: {
        ...mapGetters('journal', ['getEntriesByTerm'])
    }
}
</script>

<style lang="scss" scoped>
.entry-list-container {
    border-right: 1px solid #2c3e50;
    height: calc(100vh - 56px);
}
.entry-scrollarea{
    height: calc(100vh - 115px);
    overflow: scroll;
}
</style>
