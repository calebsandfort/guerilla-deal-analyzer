<template>
  <gallery
    ref="theGallery"
    :images="image_urls_list"
    :index="galleryIndex"
    @close="index = null"
    @onslideend="slideEnd"
    @onclosed="closed"
  ></gallery>
</template>

<script>
import VueGallery from "vue-gallery";

export default {
  name: "PropertyGallery",
  components: {
    gallery: VueGallery
  },
  data() {
    return {
      galleryIndex: null,
      lastIndex: 0,
      image_urls_list: []
    };
  },
  methods: {
    slideEnd: function({ index }) {
      this.lastIndex = index;
    },
    closed: function() {
      this.$emit("closed", this.lastIndex);
    },
    open: function(args) {
      this.lastIndex = args.lastIndex;
      this.image_urls_list = args.image_urls_list;

      const that = this;

      setTimeout(function() {
        that.$refs.theGallery.open(that.lastIndex);
      }, 500);
    }
  }
};
</script>

<style scoped></style>
