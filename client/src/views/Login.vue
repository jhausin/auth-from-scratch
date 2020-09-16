<template>
  <section>
    <h1>Login</h1>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <form @submit.prevent="login()">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          placeholder="Enter Username"
          aria-describedby="usernameHelp"
          required
        />
        <small id="usernameHelp" class="form-text text-muted">
          Enter Username to login.
        </small>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Enter Password"
          aria-describedby="passwordHelp"
          required
        />
        <small id="passwordHelp" class="form-text text-muted">
          Enter Password.
        </small>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </section>
</template>

<script>
import Joi from "joi";

const LOGIN_URL = "http://localhost:5000/auth/login";

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .required(),
});
export default {
  data: () => ({
    errorMessage: "",
    user: {
      username: "",
      password: "",
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = "";
      },
      deep: true,
    },
  },
  methods: {
    login() {
      if (this.validUser()) {
        console.log("logging in...");
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "content-type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return response.json().then((error) => {
              throw new Error(error.message);
            });
          })
          .then((result) => {
            localStorage.setItem("token", result.token);
            this.$router.push("/dashboard");
          })
          .catch((error) => {
            this.errorMessage = error;
          });
      }
    },
    validUser() {
      const { value, error } = schema.validate(this.user);
      if (error === undefined) {
        return true;
      }
      this.errorMessage = "Invalid Username or Password.";
      return false;
    },
  },
};
</script>

<style></style>
