export default function ({image, width, height, left, top, iWidth, iHeight, rotate, type, callback}) {
  let img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  let ctx = null
  ctx = canvas.getContext('2d')
  ctx.save()
  img.onload = () => {
    ctx.translate(left + iWidth / 2, top + iHeight / 2)
    ctx.rotate(rotate * Math.PI / 180)
    ctx.translate(-(left + iWidth / 2), -(top + iHeight / 2))
    ctx.drawImage(img, left, top, iWidth, iHeight)
    ctx.restore()
    callback(canvas.toDataURL(type || 'image/png'))
  }
  img.src = image.src
}
