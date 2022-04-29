import { createStore } from "vuex"
import journalModule from "@/modules/daybook/store/journal"
import { journalState } from "../../../../mock-data/journal-state"
import journalApi from "@/api/journalApi"
import authApi from "@/api/authApi"

jest.mock('@/api/journalApi')

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journalModule,
        state: { ...initialState }
      }
    }
  })

beforeEach(() => {
  jest.resetAllMocks()
})

describe('Journal Module Store', () => {

  beforeAll(async () => {
    const { data } = await authApi.post(':signInWithPassword', {
      email: 'test@test.com',
      password: '123456',
      returnSecureToken: true
    })

    localStorage.setItem('idToken', data.idToken)
  })

  test('it should have the right initial state', () => {
    const mockStore = createVuexStore(journalState)
    const { isLoading, entries } = mockStore.state.journal
    
    expect(isLoading).toBeFalsy()
    expect(entries).toEqual(journalState.entries)
  })

  describe('Mutations', () => {
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

  describe('Getters', () => {
    test('should be able to fetch an entry containing the user input or all of them if no input is provided', () => {
      const mockStore = createVuexStore(journalState)
      const mockInput = 'mucho'
      const targetEntry = mockStore.state.journal.entries.find((entry) => entry.text.includes(mockInput))

      expect(mockStore.getters['journal/getEntriesByTerm']('').length).toBe(3)
      expect(mockStore.getters['journal/getEntriesByTerm']('')).toEqual(journalState.entries)

      expect(mockStore.getters['journal/getEntriesByTerm'](mockInput).length).toBe(1)
      expect(mockStore.getters['journal/getEntriesByTerm'](mockInput)).toEqual([targetEntry])
    })

    test('should be able to fetch an entry by ID or undefined if no ID is provided', () => {
      const targetEntry = journalState.entries[0]
      const mockStore = createVuexStore(journalState)

      expect(mockStore.getters['journal/getEntryById']('')).toBeUndefined()

      expect(mockStore.getters['journal/getEntryById'](targetEntry.id)).toEqual(targetEntry)
    })
  })

  describe('Store Actions', () => {
    test('loadEntries should load the existing entries', async () => {
      const mockStore = createVuexStore({ isLoading: true, entries: [] })
      const mockApiData = {
        data: {
          'ABC': {
            date: 'Sat Jul 19 2021',
            text: 'mock text'
          }
        }
      }
      const spyOnJournalApi = jest.spyOn(journalApi, 'get').mockResolvedValue(mockApiData)
      const spyOnStoreCommit = jest.spyOn(mockStore, 'commit')

      await mockStore.dispatch('journal/loadEntries')

      expect(spyOnJournalApi).toHaveBeenCalledWith('/entries.json')
      expect(spyOnStoreCommit).toHaveBeenCalledWith("journal/setEntries", [{ "date": "Sat Jul 19 2021", "id": "ABC", "text": "mock text" }], undefined)
      expect(mockStore.state.journal.entries.length).toBe(1)
      expect(mockStore.state.journal.entries[0].text).toBe(mockApiData.data['ABC'].text)
    })

    test('updateEntry should call journalApi and the mutation updateEntry in order to update the selected entry', async () => {
      const mockStore = createVuexStore(journalState)
      const updatedEntry = { ...journalState.entries[0], text: 'mock update' }
      
      mockStore.commit = jest.fn()
      const spyOnJournalApi = jest.spyOn(journalApi, 'put').mockResolvedValue()
      const spyOnStoreCommit = jest.spyOn(mockStore, 'commit')

      await mockStore.dispatch('journal/updateEntry', updatedEntry)


      expect(spyOnJournalApi).toHaveBeenCalledWith(`/entries/${updatedEntry.id}.json`, updatedEntry)
      expect(spyOnStoreCommit).toHaveBeenCalledWith('journal/updateEntry', {...updatedEntry}, undefined)
    })

    test('createEntry and deleteEntry should call journalApi and their corresponding mutations to create and delete an entry', async () => {
      const mockStore = createVuexStore(journalState)
      const newEntry = { date: 1646585019497, text: 'new mock entry' }
      const newEntryId = 'newEntryId'

      const spyOnPostMethod = jest.spyOn(journalApi, 'post').mockResolvedValue({ data: { name: newEntryId } })
      const spyOnStoreCommit = jest.spyOn(mockStore, 'commit')

      const result = await mockStore.dispatch('journal/createEntry', newEntry)

      expect(spyOnPostMethod).toHaveBeenCalled()
      expect(spyOnStoreCommit).toHaveBeenCalled()
      expect(result).toBe(newEntryId)
      expect(mockStore.state.journal.entries.length).toBe(4)
      expect(mockStore.state.journal.entries.find((entry) => entry.id === newEntryId)).toBeTruthy()

      const spyOnDeleteMethod = jest.spyOn(journalApi, 'delete').mockResolvedValue()

      await mockStore.dispatch('journal/deleteEntry', newEntryId)

      expect(spyOnDeleteMethod).toHaveBeenCalledWith(`/entries/${newEntryId}.json`)
      expect(spyOnStoreCommit).toHaveBeenCalled()
      expect(mockStore.state.journal.entries.length).toBe(3)
      expect(mockStore.state.journal.entries.find((entry) => entry.id === newEntryId)).toBeFalsy()
    })
  })
})
