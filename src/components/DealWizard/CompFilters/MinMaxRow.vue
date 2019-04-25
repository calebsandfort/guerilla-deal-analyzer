<template>
  <v-layout row>
    <v-flex xs6>
      <v-select
        :items="items"
        item-text="text"
        item-value="value"
        :value="min"
        @input="$emit('update:min', $event)"
        :label="minLabel"
      ></v-select>
    </v-flex>
    <v-flex xs6>
      <v-select
        :items="items"
        item-text="text"
        item-value="value"
        :value="max"
        @input="$emit('update:max', $event)"
        :label="maxLabel"
      ></v-select>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "MinMaxRow",
  props: {
    label: {
      type: String
    },
    min: {
      type: Number,
      default: -1
    },
    max: {
      type: Number,
      default: -1
    },
    items: {
      type: Array,
      default: function() {
        return [
          {
            text: "No Filter",
            value: -1
          }
        ];
      }
    }
  },
  computed: {
    minLabel: function() {
      return `Min ${this.label}`;
    },
    maxLabel: function() {
      return `Max ${this.label}`;
    }
  },
  methods: {
    log: console.log
  }
};
</script>

<style scoped></style>
