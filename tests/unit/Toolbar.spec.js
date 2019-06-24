import { mount, createLocalVue } from "@vue/test-utils";
import Toolbar from "@/components/Toolbar.vue";
import VueRouter from "vue-router";

describe("Toolbar.vue", () => {
  let wrapper;

  const routes = [{ path: "/", name: "home" }, { path: "/test", name: "test" }];

  const router = new VueRouter({ routes });

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    // localVue.use(Vuetify);

    wrapper = mount(Toolbar, {
      localVue: localVue,
      router
    });
  });

  it("Back button display is appropriate", () => {
    const backPath = "test";

    wrapper.setProps({ backPath: "test" });

    expect(wrapper.vm.showBackButton).toBeTruthy();

    wrapper.setProps({ backPath: "" });

    expect(wrapper.vm.showBackButton).toBeFalsy();

    //wrapper.vm.$route.path
  });

  it("Back button routes to proper route", () => {
    wrapper.setProps({ backPath: "/test" });
    const btn_Back = wrapper.find(".btn_Back");
    btn_Back.trigger("click");

    expect(wrapper.vm.$route.name).toBe("test");
  });

  it("Home button routes to home", () => {
    wrapper.setProps({ backPath: "/test" });
    const toolbarTitle = wrapper.find(".toolbarTitle");
    toolbarTitle.trigger("click");

    expect(wrapper.vm.$route.name).toBe("home");
  });
});
