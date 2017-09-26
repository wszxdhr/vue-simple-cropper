<template>
  <div ref="previewer" class="vue-simple-cropper-previewer"
       :style="{height: wrapperH + 'px'}">
    <img class="vue-simple-cropper-previewer-img" :src="val.src" alt=""
         :style="{top: val.y / val.h * 100 + '%',
                  left: val.x / val.w * 100 + '%',
                  width: computedW / val.w * 100 + '%',
                  height: computedH / val.h * 100 + '%', transform: 'rotate(' + val.rotate + ')'}"/>
  </div>
</template>

<script type="text/babel">
  export default {
    props: {
      val: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        wrapperH: 0
      }
    },
    watch: {
      val (val) {
        console.log(val.w / val.h)
        console.dir(this.$refs.previewer)
        this.wrapperH = val.h / val.w * this.$refs.previewer.offsetWidth
      }
    },
    computed: {
      computedW () {
        return this.val.image ? this.val.image.w : 0
      },
      computedH () {
        return this.val.image ? this.val.image.h : 0
      }
    }
  }
</script>

<style>
  .vue-simple-cropper-previewer {
    position: relative;
    overflow: hidden;
  }
  .vue-simple-cropper-previewer-img {
    position: absolute;
  }
</style>
