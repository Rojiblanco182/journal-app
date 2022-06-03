import Login from '@/modules/auth/views/Login'
import { shallowMount } from '@vue/test-utils'
import Swal from 'sweetalert2'
import createVuexStore from '../../../mock-data/mock-store'

const mockRouter = {
  push: jest.fn()
}

jest.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}))

describe('Login view', () => {

  const mockStore = createVuexStore({
    status: 'not-authenticated',
    user: null,
    idToken: null,
    refreshToken: null,
  })

  mockStore.dispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('The view must be rendered', () => {
    const wrapper = shallowMount(Login, {
      global: {
        plugins: [ mockStore ]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should trigger an error if the credentials are wrong', async () => {
    const mockMessageError = 'Invalid credentials'
    mockStore.dispatch.mockReturnValueOnce({ ok: false, message: mockMessageError })
    const wrapper = shallowMount(Login, {
      global: {
        plugins: [mockStore]
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(mockStore.dispatch).toHaveBeenCalled()
    expect(Swal.fire).toHaveBeenCalledWith('Error', mockMessageError, 'error')
  })

  test('should redirect the user if the credentials are right', async () => {
    const mockUser = { email: 'mockEmail@domain.com', password: 'mockPassword' }
    mockStore.dispatch.mockReturnValueOnce({ ok: true })
    const wrapper = shallowMount(Login, {
      global: {
        plugins: [mockStore]
      }
    })
    const [email, password] = wrapper.findAll('input')
    
    await email.setValue(mockUser.email)
    await password.setValue(mockUser.password)
    await wrapper.find('form').trigger('submit')

    expect(mockStore.dispatch).toHaveBeenCalledWith('auth/signInUser', mockUser)
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'no-entry' })
  })
})
