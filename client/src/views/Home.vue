<template>
  <!-- eslint-disable -->
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Authentication Demo</h1>
      <p class="lead">Demo</p>
      <hr class="my-4" />
      <p class="lead">
        <router-link class="btn btn-primary btn-lg" :to="{name: 'SignUp'}" role="button">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
