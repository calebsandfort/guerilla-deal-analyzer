import { shallowMount, createLocalVue } from "@vue/test-utils";
import LandingPage from "@/components/LandingPage.vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";

describe("LandingPage.vue", () => {
  let wrapper;

  const routes = [{ path: "/", name: "home" }];

  const router = new VueRouter({ routes });

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    // localVue.use(Vuetify);

    wrapper = shallowMount(LandingPage, {
      localVue: localVue,
      router
    });
  });

  it("Renders module links properly", () => {
    const linkArray = wrapper.findAll(".nav-links-wrapper router-link-stub");

    expect(linkArray.length).toBe(4);
  });
});
