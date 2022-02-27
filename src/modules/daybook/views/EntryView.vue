<template>
    <template v-if="entry">
        <div class="entry-title d-flex justify-content-between p-2">
            <div>
                <span class="text-success fs-3 fw-bold">{{ day }}</span>
                <span class="mx-1 fs-3">{{ month }}</span>
                <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
            </div>

            <div>
                <button class="btn btn-danger mx-2">
                    Borrar
                    <i class="fa fa-trash-alt"></i>
                </button>

                <button class="btn btn-primary">
                    Subir foto
                    <i class="fa fa-upload"></i>
                </button>
            </div>
        </div>

        <hr>

        <div class="d-flex flex-column px-3 h-75">
            <textarea
                v-model="entry.text" 
                placeholder="Qué sucedió hoy?"
            ></textarea>
        </div>
        
        <img src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-32716486/original/d188c280-a41c-462d-b357-243df1d96178.jpeg" alt="entry-picture"
        class="img-thumbnail">
    </template>

    <Fab icon="fa-save" @on:click="saveEntry" />

</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import getDayMonthYear from '@/modules/daybook/helpers/getDayMonthYear'

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        Fab: defineAsyncComponent(() => import(/* webpackChunkName: "fab" */ '@/modules/daybook/components/Fab.vue'))
    },
    data() {
        return {
            entry: null
        }
    },
    computed: {
        ...mapGetters('journal', ['getEntryById']),
        day() {
            const { day } = getDayMonthYear(this.entry.date)
            return day
        },
        month() {
            const { month } = getDayMonthYear(this.entry.date)
            return month
        },
        yearDay() {
            const { yearDay } = getDayMonthYear(this.entry.date)
            return yearDay
        },
    },
    methods: {
        ...mapActions('journal', ['updateEntry', 'createEntry']),

        loadEntry() {
            let entry;

            if (this.id === 'new') {
                entry = {
                    text: '',
                    date: new Date().getTime()
                }
            } else {
                entry = this.getEntryById(this.id)
                
                if (!entry) {
                    return this.$router.push({ name: 'no-entry' })
                }
            }

            this.entry = entry
        },

        async saveEntry() {
            if (this.entry.id) {
                await this.updateEntry(this.entry)
            } else {
                const id = await this.createEntry(this.entry)
                this.$router.push({ name: 'entry', params: { id } })
            }
        }
    },
    created() {
        this.loadEntry()
    },
    watch: {
        id() {
            this.loadEntry()
        }
    }
}
</script>

<style lang="scss" scoped>

textarea {
    font-size: 20px;
    border: none;
    height: 100%;

    &:focus {
        outline: none;
    }
}

img {
    width: 200px;
    position: fixed;
    bottom: 150px;
    right: 20px;
    box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
}

</style>