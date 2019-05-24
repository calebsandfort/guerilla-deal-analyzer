<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },

  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>

<style>
.hide-text-field-details .v-text-field__details {
  display: none;
}

.small-text-field {
  font-size: 14px;
  padding: 0 4px;
}

.condensed-table table.v-table tbody td:first-child,
.condensed-table table.v-table tbody td:not(:first-child),
.condensed-table table.v-table tbody th:first-child,
.condensed-table table.v-table tbody th:not(:first-child),
.condensed-table table.v-table thead td:first-child,
.condensed-table table.v-table thead td:not(:first-child),
.condensed-table table.v-table thead th:first-child,
.condensed-table table.v-table thead th:not(:first-child),
.condensed-table table.v-table tfoot td:first-child,
.condensed-table table.v-table tfoot td:not(:first-child),
.condensed-table table.v-table tfoot th:first-child,
.condensed-table table.v-table tfoot th:not(:first-child) {
  padding: 0 12px;
}

.super-condensed-table table.v-table tbody td:first-child,
.super-condensed-table table.v-table tbody td:not(:first-child),
.super-condensed-table table.v-table tbody th:first-child,
.super-condensed-table table.v-table tbody th:not(:first-child),
.super-condensed-table table.v-table thead td:first-child,
.super-condensed-table table.v-table thead td:not(:first-child),
.super-condensed-table table.v-table thead th:first-child,
.super-condensed-table table.v-table thead th:not(:first-child),
.super-condensed-table table.v-table tfoot td:first-child,
.super-condensed-table table.v-table tfoot td:not(:first-child),
.super-condensed-table table.v-table tfoot th:first-child,
.super-condensed-table table.v-table tfoot th:not(:first-child) {
  padding: 0 6px;
  font-size: 12px;
  height: 36px;
}

.super-condensed-table table.v-table tbody td:first-child {
  padding-left: 12px;
}

.super-condensed-table table.v-table thead th:first-child {
  padding-left: 36px;
}

.super-condensed-table table.v-table thead tr,
.super-condensed-table table.v-table tfoot tr {
  height: 36px;
}
</style>
