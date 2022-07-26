import { shallowMount } from "@vue/test-utils"
import Navbar from '@/modules/daybook/components/Navbar'
import createVuexStore from '../../../mock-data/mock-store'

const mockRouter = {
  push: jest.fn()
}

jest.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

describe('Navbar component', () => {

  const store = createVuexStore({
    user: {
      username: 'mockName',
      email: 'mock@domain.com',
    },
    status: 'mockStatus',
    idToken: 'mockId',
    refreshToken: 'mockToken'
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })
    
  test('The component must be rendered', () => {
    const wrapper = shallowMount( Navbar, {
      global: {
        plugins: [ store ]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  test('by clicking on logout the session must be closed and the user must be redirected', async () => {
    const wrapper = shallowMount(Navbar, {
      global: {
        plugins: [ store ]
      }
    })

    await wrapper.find('button').trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login' })
    expect(store.state.auth).toEqual({
      user: null,
      status: 'not-authenticated',
      idToken: null,
      refreshToken: null
    })
  })
})
