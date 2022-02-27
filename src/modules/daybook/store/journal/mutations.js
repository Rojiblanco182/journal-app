export const setEntries = ( state, entries ) => {
    state.entries = [...state.entries, ...entries]
    state.isLoading = false
}

export const updateEntry = ( state, entry ) => {
    const entryIdx = state.entries.findIndex((savedEntry) => savedEntry.id === entry.id)
    state.entries[entryIdx] = entry
}

export const addEntry = ( state, entry ) => {
    state.entries = [entry, ...state.entries]
}

export const deleteEntry = ( state, id ) => {
    state.entries = state.entries.filter((entry) => entry.id !== id)
}
