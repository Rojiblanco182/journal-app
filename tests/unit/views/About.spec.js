import { shallowMount } from "@vue/test-utils"
import About from '@/views/About'

describe('About view', () => {
  test('should render the About view correctly', () => {
    const wrapper = shallowMount(About)

    expect(wrapper.html()).toMatchSnapshot()
  })
})
