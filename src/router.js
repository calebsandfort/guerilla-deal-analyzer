import Vue from "vue";
import Router from "vue-router";
import LandingPage from "./components/LandingPage";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPage
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/lead-finder",
      name: "leadFinder",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./components/LeadFinder/LeadFinder.vue")
    },
    {
      path: "/deal-calculator",
      name: "dealCalculator",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./components/DealCalculator/DealCalculator.vue")
    },
    {
      path: "/deal-wizard/:propertyId?",
      name: "dealWizard",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./components/DealWizard/DealWizard.vue")
    },
    {
      path: "/sandbox",
      name: "sandbox",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./components/Sandbox/Sandbox.vue")
    },
    {
      path: "/research",
      name: "research",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./components/Research/Research.vue")
    },
    {
      path: "/active-projects",
      name: "activeProjects",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./components/ActiveProjects/ActiveProjects.vue")
    }
  ]
});
