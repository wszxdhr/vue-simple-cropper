export default {
  left: 0,
  right: 0,
  bottom: 100,
  top: 100,
  parent: null,
  ratioLocked: false,
  // TODO: 放大origin
  changeLeft (val) {
    let left = val > 0 ? val : 0
    if (this.ratioLocked && this.parent) {
      let rect = this.parent.getBoundingClientRect()
      let thisWidth = rect.width - this.left - this.right
      let bottom = rect.height - this.top - thisWidth
      if (bottom < 0) {
        bottom = 0
        let thisHeight = rect.height - this.top
        left = rect.width - thisHeight - this.right
      }
      this.bottom = bottom
    }
    this.left = left
  },
  changeRight (val) {
    this.right = val
  },
  changeBottom (val) {
    this.bottom = val
  },
  changeTop (val) {
    this.top = val
  },
  setRatioLocked (val, option) {
    this.ratioLocked = val
    if (val) {
      let width = this.w
      let height = this.h
      let ratio = width / height
      if (option) {
        if (option.ratio) {
          ratio = option.ratio
        } else if (option.w && option.h) {
          ratio = option.w / option.h
          width = option.w
          height = option.h
        }
      }
      this.w = width
      this.h = width / ratio
    }
  },
  setRect ({left, bottom, right, top}) {
    if (left !== undefined && left !== null) {
      this.left = left
    }
    if (bottom !== undefined && bottom !== null) {
      this.bottom = bottom
    }
    if (right !== undefined && right !== null) {
      this.right = right
    }
    if (top !== undefined && top !== null) {
      this.top = top
    }
  }
}
