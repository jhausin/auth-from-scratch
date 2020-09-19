<template>
    <div class="home">
        <div class="jumbotron">
            <h1 class="display-3 text-center">
                Hello, {{ user.username }}! 👋
            </h1>
            <hr class="my-4" />
            <button @click="logout()" class="btn btn-primary">
                Logout
            </button>
            <br />
            <br />
            <button @click="showForm = !showForm" class="btn btn-info">
                Toggle Form
            </button>
            <form v-if="showForm" @submit.prevent="addNote()">
                <div class="form-group">
                    <label for="noteTitle">Title</label>
                    <input
                        v-model="newNote.title"
                        type="text"
                        class="form-control"
                        id="noteTitle"
                        placeholder="Title"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="noteContent">
                        Note
                    </label>
                    <textarea
                        v-model="newNote.note"
                        class="form-control"
                        id="noteContent"
                        rows="3"
                        placeholder="Enter your note"
                        required
                    >
                    </textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                    Add Note
                </button>
                <h1>{{ newNote.title }}</h1>
            </form>
        </div>
    </div>
</template>

<script>
const API_URL = "http://localhost:5000";
export default {
    data: () => ({
        showForm: false,
        newNote: {
            title: "",
            note: "",
        },
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
        addNote() {
            const body = {
                title: this.newNote.title,
                note: this.newNote.note,
            };
            fetch("http://localhost:5000/api/v1/notes/", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((note) => {
                    console.log(note);
                });
        },
        logout() {
            localStorage.removeItem("token");
            this.$router.push("/login");
        },
    },
};
</script>

<style></style>
