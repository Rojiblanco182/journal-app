<template>
  <span class="login100-form-title p-b-41">
		Ingresar
	</span>
	<form class="login100-form validate-form p-b-33 p-t-5" @submit.prevent="onSubmit">

		<div class="wrap-input100 validate-input" data-validate = "Enter username">
			<input v-model="userForm.email" class="input100" type="text" placeholder="Correo" required>
			<span class="focus-input100" data-placeholder="&#xe82a;"></span>
		</div>

		<div class="wrap-input100 validate-input" data-validate="Enter password">
			<input v-model="userForm.password" class="input100" type="password" placeholder="Contraseña" required>
			<span class="focus-input100" data-placeholder="&#xe80f;"></span>
		</div>

		<div class="container-login100-form-btn m-t-32">
			<button class="login100-form-btn">
				Login
			</button>
		</div>

    <div class="container-login100-form-btn m-t-32">
      <router-link :to="{name: 'signup'}">¿No tienes cuenta?</router-link>
    </div>
	</form>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import Swal from 'sweetalert2';
import useAuth from '@/modules/auth/composables/useAuth';

export default {
	setup() {
		const router = useRouter()
		const { loginUser } = useAuth()
		const userForm = ref({
			email: '',
			password: ''
		})

		return {
			userForm,
			onSubmit: async () => {
				const { ok, message } = await loginUser(userForm.value)
				if (!ok) return Swal.fire('Error', message, 'error')
				router.push({ name: 'no-entry' })
			}
		}
	}
}
</script>
