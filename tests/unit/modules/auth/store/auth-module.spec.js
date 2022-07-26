import createVuexStore from "../../../mock-data/mock-store"
import authApi from '@/api/authApi'

describe('Auth-module', () => {
  test('should have a initial state', () => {
    const store = createVuexStore({
      status: 'authenticating',
      user: null,
      idToken: null,
      refreshToken: null,
    })

    const { status, user, idToken, refreshToken } = store.state.auth

    expect(status).toBe('authenticating')
    expect(user).toBe(null)
    expect(idToken).toBe(null)
    expect(refreshToken).toBe(null)
  })

  describe('Mutations', () => {
    test('loginUser', () => {
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
  
      store.commit('auth/loginUser', payload)
  
      const { status, user, idToken, refreshToken } = store.state.auth
  
      expect(status).toBe('authenticated')
      expect(user).toStrictEqual(payload.user)
      expect(idToken).toBe(payload.idToken)
      expect(refreshToken).toBe(payload.refreshToken)
    })
  
    test('logout', () => {
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
  
      store.commit('auth/logout')
  
      const { status, user, idToken, refreshToken } = store.state.auth
  
      expect(status).toBe('not-authenticated')
      expect(user).toBe(null)
      expect(idToken).toBe(null)
      expect(refreshToken).toBe(null)
      expect(localStorage.getItem('idToken')).toBe(null)
      expect(localStorage.getItem('refreshToken')).toBe(null)
    })
  })

  describe('Getters', () => {
    test('authStatus', () => {
      const initialState = {
        status: 'authenticated',
        user: { username: 'mockUser', email: 'mockEmail@domain.com' },
        idToken: 'mockToken-123',
        refreshToken: 'mockRefresh-123'
      }
      const store = createVuexStore(initialState)
      const result = store.getters['auth/authStatus']

      expect(result).toBe(initialState.status)
    })

    test('username', () => {
      const initialState = {
        status: 'authenticated',
        user: { username: 'mockUser', email: 'mockEmail@domain.com' },
        idToken: 'mockToken-123',
        refreshToken: 'mockRefresh-123'
      }
      const store = createVuexStore(initialState)
      const result = store.getters['auth/username']

      expect(result).toBe(initialState.user.username)
    })
  })

  describe('Actions', () => {
    describe('Create user', () => {
      test('User already exists', async () => {
        const initialState = {
          status: 'not-authenticated',
          user: null,
          idToken: null,
          refreshToken: null
        }
        const newUser = { username: 'mockUser', email: 'test@test.com', password: '123456' }
        const store = createVuexStore(initialState)
        const response = await store.dispatch('auth/createUser', newUser)
        const expectedResult = { ok: false, message: 'EMAIL_EXISTS' }
        const { status, user, idToken, refreshToken } = store.state.auth

        expect(status).toBe('not-authenticated')
        expect(user).toBe(null)
        expect(idToken).toBe(null)
        expect(refreshToken).toBe(null)
        expect(localStorage.getItem('idToken')).toBe(null)
        expect(localStorage.getItem('refreshToken')).toBe(null)
        expect(response).toEqual(expectedResult)
      })

      test('User created', async () => {
        const initialState = {
          status: 'not-authenticated',
          user: null,
          idToken: null,
          refreshToken: null
        }
        const newUser = { username: 'mockUser', email: 'test2@test.com', password: '123456' }
        const store = createVuexStore(initialState)
        //Sign in already existing user in order to get their idToken
        await store.dispatch('auth/signInUser', newUser)

        const { idToken } = store.state.auth
        //Delete the test user so that we can create it again
        await authApi.post(':delete', { idToken })

        //Create a new user
        const result = await store.dispatch('auth/createUser', newUser)
        const expectedResult = { ok: true }

        const { status, user, idToken: token, refreshToken } = store.state.auth

        expect(status).toBe('authenticated')
        expect(user).toMatchObject({ username: newUser.username, email: newUser.email })
        expect(typeof token).toBe('string')
        expect(typeof refreshToken).toBe('string')
        expect(result).toEqual(expectedResult)
      })
    })

    describe('checkAuthentication', () => {
      test('Authenticated', async () => {
        const store = createVuexStore({
          status: 'not-authenticated',
          user: null,
          idToken: null,
          refreshToken: null,
        })
        const mockUser = { username: 'Test User', email: 'test@test.com', password: '123456' }

        await store.dispatch('auth/signInUser', mockUser)
        const { idToken } = store.state.auth

        store.commit('auth/logout')
        localStorage.setItem('idToken', idToken)
        
        const checkResp = await store.dispatch('auth/checkAuthentication')
        const { status, user, idToken: token } = store.state.auth

        expect(checkResp).toEqual({ ok: true })

        expect(status).toBe('authenticated')
        expect(user).toMatchObject({ username: mockUser.username, email: mockUser.email })
        expect(typeof token).toBe('string')
      })

      test('Not authenticated', async () => {
        const store = createVuexStore({
          status: 'authenticating',
          user: null,
          idToken: null,
          refreshToken: null,
        })

        const noTokenExpectedResult = { ok: false, message: 'User token is missing' }

        localStorage.removeItem('idToken')
        const noTokenAuthResp = await store.dispatch('auth/checkAuthentication')

        expect(noTokenAuthResp).toEqual(noTokenExpectedResult)
        expect(store.state.auth.status).toBe('not-authenticated')

        const wrongTokenExpectedResult = { ok: false, message: 'INVALID_ID_TOKEN' }

        localStorage.setItem('idToken', 'mockToken')
        const wrongTokenAuthResp = await store.dispatch('auth/checkAuthentication')

        expect(wrongTokenAuthResp).toEqual(wrongTokenExpectedResult)
        expect(store.state.auth.status).toBe('not-authenticated')
      })
    })
  })
})
