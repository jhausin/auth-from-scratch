<template>
    <div class="home text-center">
        <div class="jumbotron">
            <h1 class="display-3">Hello, {{ user.username }}! 👋</h1>
            <hr class="my-4" />
            <button @click="logout()" class="btn btn-primary">Logout</button>
        </div>
    </div>
</template>

<script>
const API_URL = "http://localhost:5000";
export default {
    data: () => ({
        user: {},
    }),
    mounted() {
        fetch(API_URL, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.user) {
                    this.user = result.user;
                } else {
                    localStorage.removeItem("token");
                    this.$router.push("/login");
                }
            });
    },
    methods: {
        logout() {
            localStorage.removeItem("token");
            this.$router.push("/login");
        },
    },
};
</script>

<style></style>
