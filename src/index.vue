<template>
  <div class="vue-simple-cropper" ref="cropper">
    <img ref="cropper-image"
        :src="image"
        alt=""
        :class="['vue-simple-cropper-image']"
        :style="{width: imageInfo.w + 'px',
                 height: imageInfo.h + 'px',
                 top: imageInfo.y + 'px',
                 left: imageInfo.x + 'px',
                 transform: 'rotate(' + rotate + 'deg)'}"/>
    <!--<div class="mask"></div>-->
    <div class="vue-simple-cropper-marquee"
         :style="{right: marquee.right + 'px',
                  bottom: marquee.bottom + 'px',
                  top: marquee.top + 'px',
                  left: marquee.left + 'px'}">
      <div class="vue-simple-cropper-marque-wrap">
        <div class="vue-simple-cropper-marque-mask"
             @mousedown="onMarqueeMouseDown($event)"></div>
        <div @mousedown="onMarqueeDotMouseDown($event, dot)"
            v-for="dot in 8"
            :class="['vue-simple-cropper-marque-dot', 'dot' + dot]"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import marquee from './marquee'
  import rotateCompute from './rotateCompute'
  import makeImage from './makeImage'
  export default {
    props: {
      image: {
        type: String,
        default: ''
      },
      infoBase: {   // marquee or image or both
        type: String,
        default: 'marquee'
      },
      ratio: {    // w/h of marquee
        type: Number,
        default: 0
      },
      rotate: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.marquee.parent = this.$refs.cropper
    },
    mounted () {
      console.dir(this.$refs.cropper)
      this.imageChanged()
    },
    data () {
      return {
        marquee,
        imageInfo: {
          x: 0,
          y: 0,
          w: 100,
          h: 100,
          naturalWidth: 0,
          naturalHeight: 0
        },
        touchInfo: {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 0,
          dotIndex: 0,
          marqueeOld: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          },
          isMoving: false
        }
      }
    },
    methods: {
      onMarqueeMouseDown (evt) {
        console.log('down')
        console.dir(evt)
        this.touchInfo.x1 = evt.clientX
        this.touchInfo.y1 = evt.clientY
        this.touchInfo.marqueeOld.left = this.marquee.left
        this.touchInfo.marqueeOld.bottom = this.marquee.bottom
        this.touchInfo.marqueeOld.right = this.marquee.right
        this.touchInfo.marqueeOld.top = this.marquee.top
        this.touchInfo.isMoving = true
        document.body.addEventListener('mousemove', this.onMarqueeMouseMove)
        document.body.addEventListener('mouseup', this.onMarqueeMouseUp)
      },
      onMarqueeMouseMove (evt) {
        this.touchInfo.x2 = evt.clientX
        this.touchInfo.y2 = evt.clientY
        let cropperRect = this.$refs.cropper.getBoundingClientRect()
        let protoWidth = cropperRect.width - this.touchInfo.marqueeOld.left - this.touchInfo.marqueeOld.right
        let protoHeight = cropperRect.height - this.touchInfo.marqueeOld.top - this.touchInfo.marqueeOld.bottom
        let left = this.touchInfo.marqueeOld.left + this.touchInfo.x2 - this.touchInfo.x1
        let right = this.touchInfo.marqueeOld.right - (this.touchInfo.x2 - this.touchInfo.x1)
        let top = this.touchInfo.marqueeOld.top + this.touchInfo.y2 - this.touchInfo.y1
        let bottom = this.touchInfo.marqueeOld.bottom - (this.touchInfo.y2 - this.touchInfo.y1)
        if (left <= 0) {
          left = 0
          right = cropperRect.width - protoWidth
        } else if (right <= 0) {
          right = 0
          left = cropperRect.width - protoWidth
        }
        if (top <= 0) {
          top = 0
          bottom = cropperRect.height - protoHeight
        } else if (bottom <= 0) {
          bottom = 0
          top = cropperRect.height - protoHeight
        }
//        console.log(left, right, top, bottom)
//        this.marquee.changeBottom(bottom)
//        this.marquee.changeTop(top)
        this.marquee.setRect({left, right, top, bottom})
        this.computeInfo()
      },
      onMarqueeMouseUp (evt) {
        this.touchInfo.isMoving = false
        document.body.removeEventListener('mousemove', this.onMarqueeMouseMove)
        document.body.removeEventListener('mouseup', this.onMarqueeMouseUp)
      },
      onMarqueeDotMouseDown (evt, idx) {
        this.touchInfo.x1 = evt.clientX
        this.touchInfo.y1 = evt.clientY
        this.touchInfo.marqueeOld.left = this.marquee.left
        this.touchInfo.marqueeOld.bottom = this.marquee.bottom
        this.touchInfo.marqueeOld.right = this.marquee.right
        this.touchInfo.marqueeOld.top = this.marquee.top
        this.touchInfo.isMoving = true
        this.touchInfo.dotIndex = idx
        document.body.addEventListener('mousemove', this.onMarqueeDotMouseMove)
        document.body.addEventListener('mouseup', this.onMarqueeDotMouseUp)
      },
      onMarqueeDotMouseMove (evt) {
        this.touchInfo.x2 = evt.clientX
        this.touchInfo.y2 = evt.clientY
        let cropperRect = this.$refs.cropper.getBoundingClientRect()
        let x = this.touchInfo.x2 - this.touchInfo.x1
        let y = this.touchInfo.y2 - this.touchInfo.y1
        let top = this.touchInfo.marqueeOld.top
        let bottom = this.touchInfo.marqueeOld.bottom
        let left = this.touchInfo.marqueeOld.left
        let right = this.touchInfo.marqueeOld.right
//        console.log(x, y)
        let ratioX = (spec) => {
          if (this.ratio) {  // w / h
            x = y * this.ratio
          } else if (spec) {
            x = 0
          }
        }
        let ratioY = (spec) => {
          if (this.ratio) {
            y = x / this.ratio
          } else if (spec) {
            y = 0
          }
        }
        let changeTop = (arg = y) => {
          top = this.touchInfo.marqueeOld.top + arg
        }
        let changeLeft = (arg = x) => {
          left = this.touchInfo.marqueeOld.left + arg
        }
        let changeBottom = (arg = y) => {
          bottom = this.touchInfo.marqueeOld.bottom + arg
        }
        let changeRight = (arg = x) => {
          right = this.touchInfo.marqueeOld.right + arg
        }
//        let cropperRect = this.$refs.cropper.getBoundingClientRect()
        switch (this.touchInfo.dotIndex) {
          case 1: ratioX(); changeTop(); changeLeft(); break
          case 2: ratioX(true); changeTop(); changeRight(); break
          case 3: ratioX(); changeTop(); changeRight(); break
          case 4: ratioY(true); changeLeft(); changeBottom(); break
          case 5: ratioY(true); changeRight(-x); changeBottom(-y); break
          case 6: ratioX(); changeBottom(-y); changeLeft(-x); break
          case 7: ratioX(true); changeBottom(-y); changeRight(-x); break
          case 8: ratioX(); changeRight(-x); changeBottom(-y); break
        }
        if (top <= 0) {
          top = 0
          if (this.ratio) {
            console.log((cropperRect.height - bottom) * this.ratio)
            if (left === this.marquee.left) {
              right = cropperRect.width - (cropperRect.height - bottom) * this.ratio - left
            } else {
              left = cropperRect.width - (cropperRect.height - bottom) * this.ratio - right
            }
          }
        }
        if (bottom <= 0) {
          bottom = 0
          if (this.ratio) {
            if (left === this.marquee.left) {
              right = cropperRect.width - (cropperRect.height - top) * this.ratio - left
            } else {
              left = cropperRect.width - (cropperRect.height - top) * this.ratio - right
            }
          }
        }
        if (left <= 0) {
          left = 0
          if (this.ratio) {
            if (top === this.marquee.top) {
              bottom = cropperRect.height - (cropperRect.width - right) / this.ratio - top
            } else {
              top = cropperRect.height - (cropperRect.width - right) / this.ratio - bottom
            }
          }
        }
        if (right <= 0) {
          right = 0
          if (this.ratio) {
            if (top === this.marquee.top) {
              bottom = cropperRect.height - (cropperRect.width - left) / this.ratio - top
            } else {
              top = cropperRect.height - (cropperRect.width - left) / this.ratio - bottom
            }
          }
        }
        this.marquee.setRect({left, right, top, bottom})
        this.computeInfo()
      },
      onMarqueeDotMouseUp (evt) {
        this.touchInfo.isMoving = false
        document.body.removeEventListener('mousemove', this.onMarqueeDotMouseMove)
        document.body.removeEventListener('mouseup', this.onMarqueeDotMouseUp)
      },
      setImage () {
        // get natural width and height
        this.imageInfo.naturalWidth = this.$refs['cropper-image'].naturalWidth
        this.imageInfo.naturalHeight = this.$refs['cropper-image'].naturalHeight
        // set image infos
        // set width and height
        let outerWidth = this.$refs.cropper.clientWidth
        let outerHeight = this.$refs.cropper.clientHeight
        let {left, top, width, height} = rotateCompute({
          outerHeight,
          outerWidth,
          innerHeight: this.imageInfo.naturalHeight,
          innerWidth: this.imageInfo.naturalWidth,
          rotate: this.rotate
        })
        this.imageInfo.y = top
        this.imageInfo.x = left
        this.imageInfo.w = width
        this.imageInfo.h = height
        // set marquee infos
        let marqueeTop = this.imageInfo.y
        let marqueeLeft = this.imageInfo.x
        let marqueeBottom = outerHeight - this.imageInfo.y - this.imageInfo.h
        let marqueeRight = outerWidth - this.imageInfo.x - this.imageInfo.w
        let marqueeWidth = this.imageInfo.w
        let marqueeHeight = this.imageInfo.h
        // ratio
        if (this.ratio) {
          if (marqueeWidth > marqueeHeight * this.ratio) {    // ho
            let centerX = this.imageInfo.w / 2 + this.imageInfo.x
            let halfWidth = marqueeHeight * this.ratio / 2
            marqueeRight = marqueeLeft = centerX - halfWidth
            console.log(marqueeRight)
          } else {  // v
            let centerY = this.imageInfo.h / 2 + this.imageInfo.y
            let halfHeight = marqueeWidth / this.ratio / 2
            marqueeBottom = marqueeTop = centerY - halfHeight
          }
        }
        this.marquee.changeLeft(marqueeLeft)
        this.marquee.changeTop(marqueeTop)
        this.marquee.changeBottom(marqueeBottom)
        this.marquee.changeRight(marqueeRight)
        this.computeInfo()
      },
      imageChanged () {
        this.$refs['cropper-image'].onload = () => {
          this.setImage()
        }
      },
      computeInfo () {
        let cropperRect = this.$refs.cropper.getBoundingClientRect()
        // TODO: scale
        let result = {}
        let computeImage = () => {
          return {  // rotate field is rotate of marquee
            x: this.marquee.left - this.imageInfo.x,
            y: this.marquee.top - this.imageInfo.y,
            w: cropperRect.width - this.marquee.left - this.marquee.right,
            h: cropperRect.height - this.marquee.top - this.marquee.bottom,
            rotate: `${this.rotate}deg`,
            src: this.image
          }
        }
        let computeMarquee = () => {
          return {  // x is position x of image, w is width of marquee, rotate is rotate of image(origin: center)
            x: this.imageInfo.x - this.marquee.left,
            y: this.imageInfo.y - this.marquee.top,
            w: cropperRect.width - this.marquee.left - this.marquee.right,
            h: cropperRect.height - this.marquee.top - this.marquee.bottom,
            rotate: `${this.rotate}deg`,
            src: this.image,
            image: {
              w: this.imageInfo.w,
              h: this.imageInfo.h,
              // TODO: 支持rotate
              rotate: '0deg'
            }
          }
        }
        if (this.infoBase === 'image') {
          result = computeImage()
        } else if (this.infoBase === 'marquee') {
          result = computeMarquee()
        } else if (this.infoBase === 'both') {
          result = {
            image: computeImage(),
            marquee: computeMarquee()
          }
        }
        this.$emit('changed', result)
      },
      getImage (callback, type = 'image/png') {
        let cropperRect = this.$refs.cropper.getBoundingClientRect()
        return makeImage({
          callback,
          rotate: this.rotate,
          type,
          width: cropperRect.width - this.marquee.left - this.marquee.right,
          height: cropperRect.height - this.marquee.top - this.marquee.bottom,
          left: this.imageInfo.x - this.marquee.left,
          top: this.imageInfo.y - this.marquee.top,
          iWidth: this.imageInfo.w,
          iHeight: this.imageInfo.h,
          image: this.$refs['cropper-image']
        })
      }
    },
    watch: {
      image (val) {
        this.imageChanged()
      },
      rotate () {
        this.setImage()
      }
    }
  }
</script>

<style>
  .vue-simple-cropper {
    position: relative;
    background-color: #f2f2f2;
    margin: 0 auto;
    width: 800px;
    height: 300px;
    overflow: hidden;
  }
  .vue-simple-cropper * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .vue-simple-cropper .vue-simple-cropper-image {
    position: absolute;
  }
  .vue-simple-cropper .vue-simple-cropper-marquee {
    position: absolute;
    box-shadow: rgba(0, 0, 0, 0.2) 0 0 0 20000px;
    cursor: move;
    outline: #1fa3ff solid 1px;
  }
  .vue-simple-cropper .vue-simple-cropper-marquee .vue-simple-cropper-marque-wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .vue-simple-cropper .vue-simple-cropper-marquee .vue-simple-cropper-marque-wrap .vue-simple-cropper-marque-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: #1fa3ff;
  }
  .vue-simple-cropper-marque-mask {
    width: 100%;
    height: 100%;
  }
  .vue-simple-cropper-marque-dot.dot1 {
    top: -3px;
    left: -3px;
    cursor: nw-resize;
  }
  .vue-simple-cropper-marque-dot.dot2 {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize;
  }
  .vue-simple-cropper-marque-dot.dot3 {
    top: -3px;
    right: -3px;
    cursor: ne-resize;
  }
  .vue-simple-cropper-marque-dot.dot4 {
    top: 50%;
    left: -3px;
    margin-top: -3px;
    cursor: w-resize;
  }
  .vue-simple-cropper-marque-dot.dot5 {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: e-resize;
  }
  .vue-simple-cropper-marque-dot.dot6 {
    bottom: -3px;
    left: -3px;
    cursor: sw-resize;
  }
  .vue-simple-cropper-marque-dot.dot7 {
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize;
  }
  .vue-simple-cropper-marque-dot.dot8 {
    bottom: -3px;
    right: -3px;
    cursor: se-resize;
  }
</style>
