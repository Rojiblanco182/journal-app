import { createStore } from "vuex"
import journalModule from "@/modules/daybook/store/journal"
import authModule from "@/modules/auth/store/auth"

const store = createStore({
    modules: {
        journal: journalModule,
        auth: authModule
    }
})

export default store