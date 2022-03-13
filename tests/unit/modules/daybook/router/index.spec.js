import daybookRouter from '@/modules/daybook/router'

describe('Daybook router', () => {
  test('it must have the right setup', async () => {
    const routerScheme = {
      name: 'daybook',
      component: expect.any(Function),
      children: [
        {
          path: '',
          name: 'no-entry',
          component: expect.any(Function)
        },
        {
          path: ':id',
          name: 'entry',
          component: expect.any(Function),
          props: expect.any(Function)
        }
      ]
    }
    const expectedRoutes = ['EntryView', 'NoEntrySelected']

    const promiseRoutes = []
    daybookRouter.children.forEach((child) => promiseRoutes.push(child.component()))
    const routes = (await Promise.all(promiseRoutes)).map((route) => route.default.name)

    expect(daybookRouter).toMatchObject(routerScheme)
    expectedRoutes.forEach((expectedRoute) => expect(routes).toContain(expectedRoute))
  })

  test('The "entry" route must get the entry ID from the route params', () => {
    const mockRoute = {
      params: {
        id: 'mockID'
      }
    }
    const targetChild = daybookRouter.children.find((route) => route.name === 'entry')

    expect(targetChild.props(mockRoute)).toEqual(mockRoute.params)
  })
})
