import { shallowMount } from "@vue/test-utils"
import Fab from '@/modules/daybook/components/Fab'

describe('FAB component', () => {
  test('should show the default icon fa-plus', () => {
    const wrapper = shallowMount(Fab)
    const htmlIcon = wrapper.find('i')

    expect(htmlIcon.classes()).toContain('fa-plus')
  })

  test('should show the icon received as parameter: fa-circle, for example', () => {
    const wrapper = shallowMount(Fab, {
      props: {
        icon: 'fa-circle'
      }
    })
    const htmlIcon = wrapper.find('i')

    expect(htmlIcon.classes()).toContain('fa-circle')
  })

  test('should emit the on:click event when it is clicked', () => {
    const wrapper = shallowMount(Fab)

    wrapper.find('button').trigger('click')

    expect(wrapper.emitted('on:click')).toHaveLength(1);
  })
})