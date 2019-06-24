<template>
  <v-layout row>
    <v-flex xs6>
      <VuetifyNumeric @input="$emit('update:min', $event.value)" :label="minLabel" :value="min"> </VuetifyNumeric>
    </v-flex>
    <v-flex xs6>
      <VuetifyNumeric @input="$emit('update:max', $event.value)" :label="minLabel" :value="max"> </VuetifyNumeric>
    </v-flex>
  </v-layout>
</template>

<script>
import VuetifyNumeric from "../../../Shared/VuetifyNumeric";

export default {
  name: "MinMaxRowNumeric",
  components: {
    VuetifyNumeric
  },
  props: {
    label: {
      type: String
    },
    min: {
      required: true,
      default: -1
    },
    max: {
      required: true,
      default: -1
    }
  },
  computed: {
    minLabel: function() {
      return `Min ${this.label}`;
    },
    maxLabel: function() {
      return `Max ${this.label}`;
    }
  }
};
</script>

<style scoped></style>
