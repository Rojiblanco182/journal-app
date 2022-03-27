import { shallowMount } from "@vue/test-utils";
import Entry from '@/modules/daybook/components/Entry'
import { journalState } from "../../../mock-data/journal-state"

describe('Entry component', () => {
  const mockRouter = {
    push: jest.fn()
  }
  const wrapper = shallowMount(Entry, {
    props: {
      entry: { ...journalState.entries[0] }
    },
    global: {
      mocks: {
        $router: mockRouter
      }
    }
  })

  test('It must match the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('it must redirect to the entry details when we click it', () => {
    const targetDiv = wrapper.find('.entry-container')
    targetDiv.trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'entry', params: { id: journalState.entries[0].id } })
  })

  test('its computed properties must contain the entry date values', () => {
    expect(wrapper.vm.day).toBe(6)
    expect(wrapper.vm.month).toBe('Marzo')
    expect(wrapper.vm.yearDay).toBe('2022, Domingo')
  })
})