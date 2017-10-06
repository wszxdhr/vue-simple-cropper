export default function ({outerHeight, outerWidth, innerHeight, innerWidth, rotate, offsetX, offsetY}) {
  let isVertical = (rotate === 90 || rotate === 270)
  let oWidth = isVertical ? outerHeight : outerWidth
  let oHeight = isVertical ? outerWidth : outerHeight
  let innerRatio = innerWidth / innerHeight
  let outerRatio = oWidth / oHeight
  let iWidth = 0
  let iHeight = 0
  if (innerRatio > outerRatio) {
    iWidth = oWidth
    iHeight = iWidth / innerRatio
  } else {
    iHeight = oHeight
    iWidth = iHeight * innerRatio
  }
  // compute position
  let left = (outerWidth - iWidth) / 2
  let top = (outerHeight - iHeight) / 2
  return {height: iHeight, width: iWidth, top, left}
}
