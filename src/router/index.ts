import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import Series from "@/views/series/Series.vue";
import Serie from "@/views/series/Serie.vue";
import { useUser } from "@/composables/user";
import Discover from "@/views/discover/Discover.vue";
import Statistics from "@/views/stats/Statistics.vue";
import Profile from "@/views/profile/Profile.vue";
import Friends from "@/views/friends/Friends.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/series",
      name: "series",
      component: Series,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/series/:id",
      name: "serie",
      component: Serie,
      props: (route) => ({ id: Number(route.params.id) }),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/discover",
      name: "discover",
      component: Discover,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/stats",
      name: "stats",
      component: Statistics,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/friends",
      name: "friends",
      component: Friends,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
  ]
});

router.beforeEach(async (to, from) => {
  const { checkAuth } = useUser();
  const isLoggedIn = await checkAuth();
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath }
    }
  } else if (!to.meta.requiresAuth && isLoggedIn) {
    return {
      path: "/series"
    }
  }
});

export default router;
