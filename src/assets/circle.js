export default class circle {
  constructor (centerX, centerY, r, realX, realY, originPoint, w1) {
    this.centerX = centerX
    this.centerY = centerY
    this.r = r
    this.realX = realX
    this.realY = realY
    this.selected = false
    this.originPoint = originPoint
    this.w1 = w1
    this.realR = this.r * this.w1
    this.edgeR = this.realR + 2 * this.w1
  }

  /**
   * true 在圆内，false 在圆外
   * @param x
   * @param y
   */
  isInner (x, y) {
    let distance = Math.sqrt(Math.pow(x - this.realX, 2) + Math.pow(y - this.realY, 2))
    return distance <= this.edgeR
  }

  select () {
    this.selected = true
    this.originPoint.click()
  }

  getSelected () {
    return this.originPoint.selected
  }
}
