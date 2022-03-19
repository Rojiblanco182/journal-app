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

  test('should fill the store entries with the ones we send to the store', () => {
    const mockStore = createVuexStore({ isLoading: true, entries: [] })

    expect(mockStore.state.journal.isLoading).toBeTruthy()
    expect(mockStore.state.journal.entries.length).toBe(0)

    mockStore.commit('journal/setEntries', journalState.entries)

    expect(mockStore.state.journal.isLoading).toBeFalsy()
    expect(mockStore.state.journal.entries.length).toBe(3)
  })

  test('should update the store entries if we modify them', () => {
    const updatedEntry = { ...journalState.entries[0], text: 'mock text' }
    const mockStore = createVuexStore(journalState)
    let entries = mockStore.state.journal.entries
    
    expect(entries.length).toBe(3)
    
    mockStore.commit('journal/updateEntry', updatedEntry)
    entries = mockStore.state.journal.entries
    const targetEntry = entries.find((entry) => entry.id === updatedEntry.id)

    expect(entries.length).toBe(3)
    expect(targetEntry).toEqual(updatedEntry)
  })

  test('should be able to add and delete an specific entry', () => {
    const newEntry = {
      id: 'mockId',
      text: 'mock text'
    }
    const mockStore = createVuexStore(journalState)
    let entries = mockStore.state.journal.entries

    expect(entries.length).toBe(3)

    mockStore.commit('journal/addEntry', newEntry)
    entries = mockStore.state.journal.entries

    expect(entries.length).toBe(4)
    expect(entries.find((entry) => entry.id === newEntry.id)).toEqual(newEntry)

    mockStore.commit('journal/deleteEntry', newEntry.id)
    entries = mockStore.state.journal.entries

    expect(entries.length).toBe(3)
    expect(entries.find((entry) => entry.id === newEntry.id)).toBeUndefined()
  })
})
