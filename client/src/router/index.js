import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

Vue.use(VueRouter);
function isLoggedIn(to, from, next) {
  if (localStorage.getItem("token")) {
    next("/dashboard");
  } else {
    next();
  }
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    compoment: Dashboard,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("token")) {
        next();
      } else {
        next("/login");
      }
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
