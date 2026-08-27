import { createRouter, createWebHistory, useRoute } from "vue-router";
import { useAuth } from "@/composables/auth";
import { useScrollStore } from "@/stores/scroll";
import { trackNavigation } from "@/utils/navigation";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/auth/RegisterView.vue")
    },
    {
      path: "/series",
      name: "series",
      component: () => import("@/views/series/Series.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/series/:id",
      name: "serie",
      component: () => import("@/views/series/Serie.vue"),
      props: (route) => ({ id: Number(route.params.id) }),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/series-status",
      name: "series-status",
      component: () => import("@/views/series/SeriesStatus.vue"),
      props: (route) => ({ status: route.query.status }),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/platforms",
      name: "platforms",
      component: () => import("@/views/navigation/Platforms.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/history",
      name: "history",
      component: () => import("@/views/navigation/History.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("@/views/navigation/Calendar.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/navigation/Settings.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/discover",
      name: "discover",
      component: () => import("@/views/discover/Discover.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/discover/:id",
      name: "details",
      component: () => import("@/views/discover/Details.vue"),
      props: (route) => ({ id: Number(route.params.id) }),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/stats/Dashboard.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/wrapped",
      name: "wrapped",
      component: () => import("@/views/stats/Wrapped.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/profile/Profile.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/friends",
      name: "friends",
      component: () => import("@/views/friends/Friends.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/friend",
      name: "friend",
      component: () => import("@/views/friends/FriendView.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/actor/:id",
      name: "actor",
      component: () => import("@/views/actors/ActorView.vue"),
      props: (route) => ({ id: Number(route.params.id) }),
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
  const scrollStore = useScrollStore();
  const { checkAuth } = useAuth();
  const isLoggedIn = await checkAuth();

  scrollStore.saveScrollPosition(from.fullPath, window.scrollY);

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
  if (!to.meta.requiresAuth && isLoggedIn) {
    return { path: "/series" };
  }
});

router.afterEach((to) => {
  trackNavigation(to.fullPath);
});

export default router;
