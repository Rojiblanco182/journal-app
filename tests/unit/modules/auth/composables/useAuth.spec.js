import useAuth from '@/modules/auth/composables/useAuth'

const mockStore = {
  dispatch: jest.fn(),
  commit: jest.fn(),
  getters: {
    'auth/authStatus': 'mockStatus',
    'auth/username': 'mockUsername'
  }
}

jest.mock('vuex', () => ({
  useStore: () => mockStore
}))

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('createUser should call the store dispatch method with the right arguments', async () => {
    const { createUser } = useAuth()
    const mockNewUser = { name: 'John', email: 'mock@domain.com' }
    const spyOnStore = jest.spyOn(mockStore, 'dispatch')

    await createUser(mockNewUser)

    expect(spyOnStore).toHaveBeenCalledWith('auth/createUser', mockNewUser)
  })

  test('loginUser should call the store dispatch method with the right arguments', async () => {
    const { loginUser } = useAuth()
    const mockLoginInfo = { email: 'mock@domain.com', password: '0123456' }
    const spyOnStore = jest.spyOn(mockStore, 'dispatch')

    await loginUser(mockLoginInfo)

    expect(spyOnStore).toHaveBeenCalledWith('auth/signInUser', mockLoginInfo)
  })

  test('checkAuthStatus should call the store dispatch method with the right arguments', async () => {
    const { checkAuthStatus } = useAuth()
    const spyOnStore = jest.spyOn(mockStore, 'dispatch')

    await checkAuthStatus()

    expect(spyOnStore).toHaveBeenCalledWith('auth/checkAuthentication')
  })

  test('logout should call the store commit method twice with the right arguments', () => {
    const { logout } = useAuth()
    const spyOnStore = jest.spyOn(mockStore, 'commit')

    logout()

    expect(spyOnStore).toHaveBeenNthCalledWith(1, 'auth/logout')
    expect(spyOnStore).toHaveBeenNthCalledWith(2, 'journal/clearEntries')
  })

  test('Computed properties: authStatus & username', () => {
    const { authStatus, username } = useAuth()

    expect(authStatus.value).toBe(mockStore.getters['auth/authStatus'])
    expect(username.value).toBe(mockStore.getters['auth/username'])
  })
})
