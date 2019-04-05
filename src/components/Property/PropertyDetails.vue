<template>
  <div>
    <v-layout row>
      <v-flex
        xs2
        align-self-center
        v-if="typeof property.image_urls_list != 'undefined'"
      >
        <img :src="property.image_urls_list[0]" class="image" width="100%" />
      </v-flex>
      <v-flex xs10>
        <v-container grid-list-lg class="pa-0">
          <v-layout row>
            <v-flex xs3>
              <a :href="property.zillow_url" target="_blank">{{
                property.streetPlusZip
              }}</a>
              <!--<v-text-field-->
              <!--label="Address"-->
              <!--readonly-->
              <!--v-model="property.streetPlusZip"-->
              <!--&gt;</v-text-field>-->

              <v-text-field
                label="Beds"
                readonly
                v-model.number="property.beds"
              ></v-text-field>

              <v-text-field
                label="Baths"
                readonly
                v-model.number="property.baths"
              ></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field
                label="Sqft"
                readonly
                v-model.number="property.sqft"
              ></v-text-field>

              <v-text-field
                label="Built"
                readonly
                v-model.number="property.year_built"
              ></v-text-field>

              <v-text-field
                label="Price"
                readonly
                prefix="$"
                v-model.number="property.price"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Computed ARV"
                readonly
                prefix="$"
                v-model.number="computedArv"
              ></v-text-field>
              <v-textarea
                label="Description"
                readonly
                v-model="property.description"
                rows="4"
              ></v-textarea>
              <!--<v-textarea-->
              <!--label="Notes"-->
              <!--readonly-->
              <!--v-model="property.notes"-->
              <!--rows="2"-->
              <!--&gt;</v-textarea>-->
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "PropertyDetails",
  props: {
    property: Object,
    computedArv: Number
  }
};
</script>

<style scoped></style>
