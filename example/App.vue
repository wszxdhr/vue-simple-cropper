<template>
  <div id="app">
    <div class="example">
      <span>请输入图片Url</span>
      <input class="example-input" type="text" v-model="picUrlTemp"/>
      <button class="example-submit" @click="picUrl = picUrlTemp">确定</button>
    </div>
    <vue-simple-cropper
      ref="cropper"
      :image="picUrl" :rotate="rotateList[rotateIndex]" :ratio="2" @changed="onValueChanged">
    </vue-simple-cropper>
    <p>
      X: {{info.x}}, Y: {{info.y}}, Width: {{info.w}}, Height: {{info.h}}
    </p>
    <div>
      <button @click="rotateIndex = ++rotateIndex % 4">rotate</button>
      <button @click="getImage">getImage</button>
    </div>
    <h2>Preview: </h2>
    <div style="max-width: 300px">
      <Previewer :val="info"></Previewer>
      <img :src="canvasSrc" alt=""/>
    </div>
  </div>
</template>

<script>
import VueSimpleCropper from './src/index.vue'
import Previewer from './Previewer.vue'

export default {
  name: 'app',
  data () {
    return {
      picUrl: 'https://sfault-image.b0.upaiyun.com/138/754/1387544687-59b78502d71e9',
      picUrlTemp: '',
      rotateIndex: 0,
      canvasSrc: '',
      rotateList: [0, 90, 180, 270],
      info: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        rotate: '0deg'
      }
    }
  },
  methods: {
    onValueChanged (val) {
      this.info = val
    },
    getImage () {
      console.log('get image')
      this.$refs.cropper.getImage((src) => {
        this.canvasSrc = src
      })
    }
  },
  components: {
    VueSimpleCropper, Previewer
  }
}
</script>

<style>
  .example-input {
    width: 500px;
  }
  body {
    padding-bottom: 100px;
  }
  .example {
    margin: 20px auto 30px;
    text-align: center;
  }
</style>
