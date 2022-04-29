import createVuexStore from "../../../mock-data/mock-store"

describe('Auth-module', () => {
  test('should have a initial state', () => {
    const store = createVuexStore({
      status: 'authenticating',
      user: null,
      idToken: null,
      refreshToken: null,
    })

    const { status, user, idToken, refreshToken } = store.state.authModule

    expect(status).toBe('authenticating')
    expect(user).toBe(null)
    expect(idToken).toBe(null)
    expect(refreshToken).toBe(null)
  })

  //MUTATIONS
  test('Mutation: loginUser', () => {
    const store = createVuexStore({
      status: 'authenticating',
      user: null,
      idToken: null,
      refreshToken: null,
    })
    const payload = {
      user: { username: 'mockUser', email: 'mockEmail@domain.com' },
      idToken: 'mockToken-123',
      refreshToken: 'mockRefresh-123'
    }

    store.commit('authModule/loginUser', payload)

    const { status, user, idToken, refreshToken } = store.state.authModule

    expect(status).toBe('authenticated')
    expect(user).toStrictEqual(payload.user)
    expect(idToken).toBe(payload.idToken)
    expect(refreshToken).toBe(payload.refreshToken)
  })

  test('Mutation: logout', () => {
    const initialState = {
      status: 'authenticated',
      user: { username: 'mockUser', email: 'mockEmail@domain.com' },
      idToken: 'mockToken-123',
      refreshToken: 'mockRefresh-123'
    }
    const store = createVuexStore(initialState)

    localStorage.setItem('idToken', initialState.idToken)
    localStorage.setItem('refreshToken', initialState.refreshToken)

    expect(localStorage.getItem('idToken')).toBe(initialState.idToken)

    store.commit('authModule/logout')

    const { status, user, idToken, refreshToken } = store.state.authModule

    expect(status).toBe('not-authenticated')
    expect(user).toBe(null)
    expect(idToken).toBe(null)
    expect(refreshToken).toBe(null)
    expect(localStorage.getItem('idToken')).toBe(null)
    expect(localStorage.getItem('refreshToken')).toBe(null)
  })
})
