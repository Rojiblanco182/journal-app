export default {
  name: 'auth',
  component: () => import(/* webpackChunkName: "auth layout" */ '@/modules/auth/layouts/AuthLayout.vue'),
  children: [],
}
