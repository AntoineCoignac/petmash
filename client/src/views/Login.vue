<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const router = useRouter();

const registerForm = ref({
  username: '',
  firstName: '',
  lastName: '',
  password: '',
});

const loginForm = ref({
  username: '',
  password: '',
});

const errorLogin = ref(null);
const errorRegister = ref(null);
const successRegister = ref(null);

async function login() {
  if (!loginForm.value.username || !loginForm.value.password) {
    errorLogin.value = "Something is missing.";
  } else {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: loginForm.value.username,
        password: loginForm.value.password
      }, { withCredentials: true });

      if (response.data && response.data._id) {
        console.log('Login successful:', response.data);
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('firstName', response.data.firstname);
        localStorage.setItem('lastName', response.data.lastname);
        window.location = "/";
      } else {
        console.error('Login failed: Invalid credentials');
        errorLogin.value = "Login failed: Invalid credentials";
      }
    } catch (error) {
      console.error('Error during login:', error);
      errorLogin.value = error.response?.data || error.message;
    }
  }

}

async function register() {
  if (!registerForm.value.username || !registerForm.value.firstName || !registerForm.value.lastName || !registerForm.value.password) {
    errorRegister.value = "Something is missing";
  } else {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username: registerForm.value.username,
        firstname: registerForm.value.firstName,
        lastname: registerForm.value.lastName,
        password: registerForm.value.password
      }, { withCredentials: true });

      if (response.data === 'User has been created.') {
        console.log('Register successful:', response.data);
        successRegister.value = "Register successful.";
        localStorage.setItem('username', registerForm.value.username);
        localStorage.setItem('firstName', registerForm.value.firstName);
        localStorage.setItem('lastName', registerForm.value.lastName);
      } else {
        console.error('Register failed:', response.data);
        errorRegister.value = "Register failed.";
      }
    } catch (error) {
      console.error('Error during register:', error);
      errorRegister.value = error.response?.data?.error || error.message;
    }
  }
}
</script>

<template>
  <div class="container p-ctn" id="login">
    <div class="forms">
      <form class="form register-form" @submit.prevent="register">
        <h2 class="title bold">Register</h2>
        <div class="fields-2">
          <div class="field">
            <label>First Name</label>
            <input type="text" v-model="registerForm.firstName" placeholder="John" />
          </div>
          <div class="field">
            <label>Last Name</label>
            <input type="text" v-model="registerForm.lastName" placeholder="Doe" />
          </div>
        </div>
        <div class="field">
          <label>Username</label>
          <input type="text" v-model="registerForm.username" placeholder="JohnDoe" />
        </div>
        <div class="field">
          <label>Password</label>
          <input type="password" v-model="registerForm.password" placeholder="***"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$"
            title="Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*), and be at least 8 characters long" />
        </div>
        <button type="submit" class="btn primary register-button full">
          <span>Register</span>
          <ArrowRightIcon class="icon" />
        </button>
        <p v-if="errorRegister" class="error">{{ errorRegister }}</p>
        <p v-if="successRegister" class="success">{{ successRegister }}</p>
      </form>
      <form class="form no-border login-form" @submit.prevent="login">
        <h2 class="title bold">Login</h2>
        <div class="field">
          <label>Username</label>
          <input type="text" v-model="loginForm.username" placeholder="JohnDoe" />
        </div>
        <div class="field">
          <label>Password</label>
          <input type="password" v-model="loginForm.password" placeholder="***" />
        </div>
        <button type="submit" class="btn secondary login-button full">
          <span>Login</span>
          <ArrowRightIcon class="icon" />
        </button>
        <p v-if="errorLogin" class="error">{{ errorLogin }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.forms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}
</style>
