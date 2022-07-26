import { createStore } from "vuex";
import authModule from '@/modules/auth/store/auth'
import journalModule from '@/modules/daybook/store/journal'
import { journalState } from "./journal-state";

const createVuexStore = ( authInitState, journalInitState = journalState ) =>
  createStore({
    modules: {
      auth: {
        ...authModule,
        state: { ...authInitState }
      },
      journal: {
        ...journalModule,
        state: { ...journalInitState}
      }
    }
  })

export default createVuexStore