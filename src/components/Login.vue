<template>
  <div>
    <h2>Login</h2>
    <!-- <form v-on:submit="login">
      <input type="text" name="email" />
      <br />
      <input type="password" name="password" />
      <br />
      <input type="submit" value="Login" />
    </form> -->
    <a v-on:click="ylogin">Login with Yahoo!</a>
  </div>
</template>

<script>
import router from '../router'
import axios from 'axios'
export default {
  name: 'Login',
  methods: {
    login: (e) => {
      e.preventDefault()
      // let email = e.target.elements.email.value
      // let password = e.target.elements.password.value
      let login = () => {
        // let data = {
        //   email: email,
        //   password: password
        // }
        axios
          .post('/auth/yahoo')
          .then((response) => {
            console.log(response)
            console.log('Logged in')
            router.push('/dashboard')
          })
          .catch((errors) => {
            console.log('Cannot log in')
          })
      }
      login()
    },
    logout: function (e) {
      axios
        .get('/api/logout')
        .then(() => {
          router.push('/')
        })
    },
    ylogin: function (e) {
      console.log(e)
      axios
        .get('/auth/yahoo')
        .then((response) => {
          console.log(response)
          console.log('Logged in')
          router.push('/dashboard')
        })
        .catch((errors) => {
          console.log('Cannot log in')
        })
    }
  }
}
</script>
