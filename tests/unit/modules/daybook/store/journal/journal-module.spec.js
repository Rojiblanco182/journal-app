import { createStore } from "vuex"
import journalModule from "@/modules/daybook/store/journal"
import { journalState } from "../../../../mock-data/journal-state"

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journalModule,
        state: { ...initialState }
      }
    }
  })

describe('Journal Module Store', () => {
  test('it should have the right initial state', () => {
    const mockStore = createVuexStore(journalState)
    const { isLoading, entries } = mockStore.state.journal
    
    expect(isLoading).toBeFalsy()
    expect(entries).toEqual(journalState.entries)
  })
})
