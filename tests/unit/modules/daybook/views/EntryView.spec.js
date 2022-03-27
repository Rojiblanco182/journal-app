import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { journalState } from "../../../mock-data/journal-state"
import journalModule from "@/modules/daybook/store/journal"
import EntryView from "@/modules/daybook/views/EntryView"
import Swal from 'sweetalert2'

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  close: jest.fn(),
  showLoading: jest.fn()
}))

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journalModule,
        state: { ...initialState }
      }
    }
  })

describe('EntryView', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()

    wrapper = shallowMount(EntryView, {
      props: {
        id: journalState.entries[0].id
      },
      global: {
        mocks: {
          $router: mockRouter
        },
        plugins: [mockStore]
      }
    })
  })

  const mockStore = createVuexStore(journalState)
  mockStore.dispatch = jest.fn()
  const mockRouter = {
    push: jest.fn()
  }

  test(`should redirect the user to 'no-entry' if the entry-id does not exist`, () => {
    const mockId = 'mockId'
    const spyOnMockRouter = jest.spyOn(mockRouter, 'push')
    shallowMount(EntryView, {
      props: {
        id: mockId
      },
      global: {
        mocks: {
          $router: mockRouter
        },
        plugins: [mockStore]
      }
    })

    expect(spyOnMockRouter).toHaveBeenCalledWith({ name: 'no-entry' })
  })

  test('should display the selected entry correctly if the ID exists', () => {
    const spyOnMockRouter = jest.spyOn(mockRouter, 'push')

    expect(wrapper.html()).toMatchSnapshot()
    expect(spyOnMockRouter).not.toHaveBeenCalled()
  })

  test('the delete button should delete the selected entry', (done) => {
    Swal.fire.mockReturnValueOnce(Promise.resolve({ isConfirmed: true }))
    wrapper.find('.btn-danger').trigger('click')

    expect(Swal.fire).toHaveBeenCalledWith({
      title: '¿Está seguro?',
      text: 'Una vez borrado, no se puede recuperar',
      showDenyButton: true,
      confirmButtonText: 'Sí, estoy seguro'
    })

    setTimeout(() => {
      expect(mockStore.dispatch).toHaveBeenCalledWith('journal/deleteEntry', journalState.entries[0].id)
      expect(mockRouter.push).toHaveBeenCalled()
      done()
    }, 1)
  })
})
