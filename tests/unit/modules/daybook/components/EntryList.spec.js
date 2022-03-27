import { createStore } from "vuex";
import EntryList from '@/modules/daybook/components/EntryList'
import { journalState } from "../../../mock-data/journal-state"
import journalModule from "@/modules/daybook/store/journal"
import { shallowMount } from "@vue/test-utils";

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journalModule,
        state: { ...initialState }
      }
    }
  })
  
describe('EntryList component', () => {
  let wrapper
  
  beforeEach(() => {
    jest.clearAllMocks()

    wrapper = shallowMount(EntryList, {
      global: {
        mocks: {
          $router: mockRouter
        },
        plugins: [mockStore]
      }
    })
  })
  const mockStore = createVuexStore(journalState)
  const mockRouter = {
    push: jest.fn()
  }

  test('should list the existing entries', () => {
    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.findAll('entry-stub').length).toBe(journalState.entries.length)
  })

  test('should filter the entries by the user input', async () => {
    const mockInput = 'mucho'
    const inputElement = wrapper.find('input')
    await inputElement.setValue(mockInput)

    expect(wrapper.findAll('entry-stub').length).toBe(1)
  })

  test(`The 'new' button should redirect the user to '/new'`, () => {
    const spyOnMockRouter = jest.spyOn(mockRouter, 'push')
    const buttonElement = wrapper.find('button')
    
    buttonElement.trigger('click')

    
    expect(spyOnMockRouter).toHaveBeenCalledWith({ name: 'entry', params: { id: 'new' } })
  })
})