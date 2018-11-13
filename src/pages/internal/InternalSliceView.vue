<template>
 <div>
   <div id="pic" :style="containerStyle"></div>
   <div class="controlDock">
    <div id="zoominbtn" class="ctrlBtn"></div>
    <div id="zoomoutbtn" class="ctrlBtn"></div>
    <div id="home" class="ctrlBtn"></div>
    <div id="full" class="ctrlBtn"></div>
    <div id="x1" class="ctrlBtn zoombyx">1X</div>
    <div id="x2" class="ctrlBtn zoombyx mgtp7">2X</div>
    <div id="x4" class="ctrlBtn zoombyx mgtp7">4X</div>
    <div id="x10" class="ctrlBtn zoombyx mgtp7">10X</div>
    <div id="x20" class="ctrlBtn zoombyx mgtp7">20X</div>
    <div id="x40" class="ctrlBtn zoombyx mgtp7">40X</div>

   </div>
   <div class="logo">
    <img src="@/assets/pathhub_blue.png" alt="">
   </div>
 </div>
</template>

<script>
import seadragon from 'openseadragon_n'
import '@/utils/annotations/main.js'
import Circle from 'circle'
import Point from 'point'

export default {
  name: 'sliceViewer',
  data () {
    return {
      windowHeight: document.documentElement.clientHeight,
      id: this.$route.params.id,
      annotations: [],
      constant: {
        LOG_2: Math.log(2)
      }
    }
  },
  computed: {
    containerStyle () {
      return {
        width: '100%',
        height: this.windowHeight + 'px'
      }
    }
  },
  created () {
    window.onresize = () => {
      this.windowHeight = document.documentElement.clientHeight
    }
    this.getSize()
    this.getAnnotations()
  },
  mounted () {
  },
  methods: {
    getSize: function () {
      new Promise((resolve, reject) => {
        this.$api.get(this.$api.getHEReaderHost() + '/v1/kfb-init/' + this.id, {}, null, r => {
          if (r !== 'success') {
            reject(r)
          } else {
            resolve(r)
          }
        })
      }).then((data) => {
        return new Promise((resolve, reject) => {
          this.$api.get(this.$api.getHEReaderHost() + '/v1/kfb-size/' + this.id, {}, null, r => {
            this.width = r.width
            this.height = r.height
            // let maxValue = Math.max(r.width, r.height)
            // let level = this.filepath = r.path
            resolve(r)
          })
        })
      }).then((data) => {
        this.seaDragon()
      })
    },
    seaDragon: function () {
      let ossTileUrl = this.$api.getHEReaderHost() + '/v1/kfb'
      seadragon({
        id: 'pic',
        prefixUrl: '/static/',
        tileSources: [{
          type: 'zoomifytileservice',
          realPath: this.id,
          width: this.width,
          height: this.height,
          tilesUrl: ossTileUrl,
          updateAnnotationCanvas: this.drawAnnotationCanvas()
        }],
        showNavigator: false,
        navigatorPosition: 'BOTTOM_LEFT',
        navigatorHeight: '150px',
        navigatorWidth: '250px',
        navigatorAutoFade: false,
        zoomInButton: 'zoominbtn',
        zoomOutButton: 'zoomoutbtn',
        homeButton: 'home',
        fullPageButton: 'full',
        x1Button: 'x1',
        x2Button: 'x2',
        x4Button: 'x4',
        x10Button: 'x10',
        x20Button: 'x20',
        x40Button: 'x40'

      })
    },
    drawAnnotationCanvas: function () {
      // let annotations = this.annotations
      let _this = this
      return (viewer) => {
        const viewport = viewer.viewport
        const bounds = viewport.getBounds()
        if (!_this.canvasContainer) {
          _this.canvasContainer = document.getElementById('pic').children[0].children[0]
          _this.annotationCanvas = document.createElement('canvas')
          _this.annotationCanvas.style = 'background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; width: 100%; height: 100%;'
          _this.canvasContainer.appendChild(_this.annotationCanvas)
          _this.annotationCanvas.width = viewport.viewer.drawer.canvas.width
          _this.annotationCanvas.height = viewport.viewer.drawer.canvas.height
        }
        let context = _this.annotationCanvas.getContext('2d')
        context.clearRect(0, 0, _this.annotationCanvas.width, _this.annotationCanvas.height)
        const [realOffsetX, realOffsetY, w1] = this.calculateRectOfAnnotations(bounds, context.canvas)
        this.drawAnnotationStroke(_this, realOffsetX, realOffsetY, w1, w1)
        this.drawAnnotationPoint(context, realOffsetX, realOffsetY, w1, w1, bounds)
      }
    },
    calculateRectOfAnnotations: function (bounds, canvas) {
      const width = bounds.width
      const height = bounds.height
      const left = bounds.x
      const top = bounds.y

      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      var offsetLeft = left
      var offsetTop = top
      const realWidth = canvasWidth / width
      const realHeight = canvasHeight / height
      let realOffsetX = -offsetLeft * realWidth
      let realOffsetY = -offsetTop * realHeight
      const w1 = Math.pow(2, Math.log(this.width / realWidth) / this.constant.LOG_2)
      const w2 = Math.pow(2, Math.log(this.height / realHeight) / this.constant.LOG_2)
      return [realOffsetX, realOffsetY, w1, w2]
    },
    drawAnnotationStroke: function (_this, realOffsetX, realOffsetY, w1, w2) {
      this.strokes = []
      for (let annotationIndex in this.annotations) {
        let annotation = this.annotations[annotationIndex]
        let context = _this.annotationCanvas.getContext('2d')
        context.save()
        context.translate(realOffsetX, realOffsetY)
        context.lineWidth = 3
        context.strokeStyle = 'yellow'
        context.beginPath()
        for (let index in annotation) {
          let point = annotation[index]
          if (index === 0) {
            context.moveTo(Math.round(point.x / w1), Math.round(point.y / w2))
          } else {
            context.lineTo(Math.round(point.x / w1), Math.round(point.y / w2))
          }
          context.index = annotationIndex
        }
        let point = annotation[0]
        context.lineTo(Math.round(point.x / w1), Math.round(point.y / w2))
        context.stroke()
        context.closePath()
        context.restore()
        this.strokes.push(context)
      }
    },
    // draw points it can be shown in big canvas
    drawAnnotationPoint: function (context, realOffsetX, realOffsetY, w1, w2) {
      context.save()
      context.translate(realOffsetX, realOffsetY)
      context.fillStyle = 'blue'
      this.circles = []
      let canvasWidth = context.canvas.width
      let canvasHeight = context.canvas.height
      let startX = -realOffsetX * w1
      let startY = -realOffsetY * w1
      let maxWidth = startX + canvasWidth * w1
      let maxHeight = startY + canvasHeight * w1
      for (let annotation of this.annotations) {
        let lastCircle
        for (let index in annotation) {
          let point = annotation[index]
          let circle = new Circle(Math.round(point.x / w1), Math.round(point.y / w2), 5, point.x, point.y, point, w1)
          if (!((circle.realX >= startX && circle.realX <= maxWidth) &&
              (circle.realY >= startY && circle.realY <= maxHeight))) {
            continue
          }
          if (lastCircle) {
            let distance = Math.sqrt(Math.pow(circle.centerX - lastCircle.centerX, 2) + Math.pow(circle.centerY - lastCircle.centerY, 2))
            if (distance < 5) {
              continue
            }
          }
          if (point.selected) {
            context.fillStyle = 'red'
            circle.r = 7
          } else {
            context.fillStyle = 'blue'
          }
          this.circles.push(circle)
          context.beginPath()
          context.arc(circle.centerX, circle.centerY, circle.r, 0, Math.PI * 2, true)
          context.fill()
          context.closePath()
          lastCircle = circle
        }
      }
      context.restore()
    },
    getAnnotations: function () {
      this.$api.get(this.$api.getHEReaderURL('/v1/annotation/' + this.id), null, null, r => {
        let annotations = JSON.parse(r)
        for (let annotationGroup of annotations) {
          let pointGroup = []
          for (let annotationPoint of annotationGroup['positions']) {
            pointGroup.push(new Point(annotationPoint['X'], annotationPoint['Y']))
          }
          this.annotations.push(pointGroup)
        }
      })
    }
  }
}
</script>

<style scoped>
  .logo {
    position: absolute;
    /* top: 20px;
    left: 20px; */
    top: 0;
    left: 0;
    z-index: 2;
    border-radius: 10px;
    padding: 5px;
  }
  .logo img {
    width: 250px;
  }
  .controlDock {
    position: absolute!important;
    top: 50px;
    right: 20px;
    width: 50px;
    /* height: 50px; */
  }
  .ctrlBtn {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background-color: #187fc4;
  }
  #zoominbtn {
    background: #187fc4 url('../../assets/addition.png') no-repeat;
    background-size: 100%;
  }
  #zoomoutbtn {
    background: #187fc4 url('../../assets/offline.png') no-repeat;
    background-size: 100%;
  }
  #home {
    background: #187fc4 url('../../assets/homepage.png') no-repeat;
    background-size: 100%;
  }
  #full {
    background: #187fc4 url('../../assets/fullscreen.png') no-repeat;
    background-size: 100%;
  }
  .zoombyx {
    text-align: center;
    color: #fff;
    font-size: 25px;
    font-weight: 800;
    line-height: 2;
  }
  .mgtp7 {
    margin-top: 7px;
  }

</style>
