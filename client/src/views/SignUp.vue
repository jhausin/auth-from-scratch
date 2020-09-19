<template>
    <section>
        <h1>Sign Up</h1>
        <div v-if="signingUp">
            <img src="../assets/loading-loop.svg" />
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>
        <form v-if="!signingUp" @submit.prevent="signup">
            <div class="form-group">
                <label for="username">Username</label>
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
                    Username must be longer than 2 characters and shorter than
                    30.
                    <br />Username can only contain alphanumeric characters and
                    underscores.
                </small>
            </div>
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="password">Password</label>
                    <input
                        v-model="user.password"
                        type="password"
                        class="form-control"
                        id="password"
                        placeholder="Password"
                        required
                    />
                    <small id="passwordHelp" class="form-text text-muted"
                        >Password must be at least 8 characters long.</small
                    >
                </div>
                <div class="form-group col-md-6">
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                        v-model="user.confirmPassword"
                        type="password"
                        class="form-control"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        required
                    />
                    <small id="confirmPasswordHelp" class="form-text text-muted"
                        >Please confirm password.</small
                    >
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </section>
</template>

<script>
import Joi from "joi";
import Loading from "../assets/loading-loop.svg";

const SIGNUP_URL = "http://localhost:5000/auth/signup";

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
    confirmPassword: Joi.string()
        .trim()
        .min(8)
        .required(),
});
export default {
    data: () => ({
        signingUp: false,
        errorMessage: "",
        user: {
            username: "",
            password: "",
            confirmPassword: "",
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
        signup() {
            if (this.validUser()) {
                console.log("User is valid. sending data to server...");
                const body = {
                    username: this.user.username,
                    password: this.user.password,
                };
                this.signingUp = true;
                //if valid => send to server
                fetch(SIGNUP_URL, {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "content-type": "application/json",
                    },
                })
                    .then((response) => {
                        //if response ok => user signed up
                        if (response.ok) {
                            return response.json();
                        }
                        //otherwise there was an error => throw new Error => handle it
                        return response.json().then((error) => {
                            throw new Error(error.message);
                        });
                    })
                    .then((result) => {
                        localStorage.setItem("token", result.token);
                        setTimeout(() => {
                            this.signingUp = false;
                            this.$router.push("/dashboard");
                        }, 1000);
                    })
                    .catch((error) => {
                        setTimeout(() => {
                            this.signingUp = false;
                            this.errorMessage = error.message;
                        }, 1000);
                    });
            }
        },
        validUser() {
            if (this.user.password !== this.user.confirmPassword) {
                this.errorMessage = "Password must match.";
            }
            const { value, error } = schema.validate(this.user);

            if (error === undefined) {
                return true;
            }
            if (error.message.includes("username")) {
                this.errorMessage = "Invalid Username.";
            } else {
                this.errorMessage = "Invalid Password.";
            }
            return false;
        },
    },
};
</script>
<style></style>
