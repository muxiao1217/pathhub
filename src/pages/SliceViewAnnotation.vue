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
    <div id="draw" @click="toggleDrawing" class="ctrlBtn zoombyx mgtp7" v-bind:class="{drawing: drawEnable}">a</div>
    <div id="delete" @click="deleteSelectedObject" class="ctrlBtn zoombyx mgtp7">d</div>

   </div>
   <div class="logo">
    <img src="@/assets/pathhub_blue.png" alt="">
   </div>
 </div>
</template>

<script>
import seadragon from 'openseadragon_n'
import '@/utils/annotations/main.js'
import deepClone from '@/utils/deepClone.js'

export default {
  name: 'sliceViewer',
  data () {
    return {
      windowHeight: document.documentElement.clientHeight,
      id: this.$route.params.id,
      viewer: '',
      overlay: '',
      drawEnable: false,
      savedPath: null
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
    this.addFabricjsOverlay()
    this.getSize()
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
      this.viewer = seadragon({
        id: 'pic',
        prefixUrl: '/static/',
        tileSources: [{
          type: 'zoomifytileservice',
          realPath: this.id,
          width: this.width,
          height: this.height,
          tilesUrl: ossTileUrl,
          updateAnnotationCanvas: function () {}
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
      var options = {
        scale: 1000
      }
      this.overlay = this.viewer.fabricjsOverlay(options)
      this.overlay.fabricCanvas().freeDrawingBrush.color = 'red'
      this.overlay.fabricCanvas().freeDrawingBrush.width = 2
      this.overlay._fabricCanvas.on('path:created', function (opt) {
        console.log(opt.path)
        this.savedPath = deepClone(opt.path)
      })
    },
    addFabricjsOverlay: function () {
      seadragon.Viewer.prototype.fabricjsOverlay = function (options) {
        this._fabricjsOverlayInfo = new Overlay(this)
        this._fabricjsOverlayInfo._scale = options.scale

        return this._fabricjsOverlayInfo
      }
      // static counter for multiple overlays differentiation
      var counter = (function () {
        var i = 1

        return function () {
          return i++
        }
      })()

      var Overlay = function (viewer) {
        var self = this

        this._viewer = viewer

        this._containerWidth = 0
        this._containerHeight = 0

        this._canvasdiv = document.createElement('div')
        this._canvasdiv.style.position = 'absolute'
        this._canvasdiv.style.left = 0
        this._canvasdiv.style.top = 0
        this._canvasdiv.style.width = '100%'
        this._canvasdiv.style.height = '100%'
        this._viewer.canvas.appendChild(this._canvasdiv)

        this._canvas = document.createElement('canvas')

        this._id = 'osd-overlaycanvas-' + counter()
        this._canvas.setAttribute('id', this._id)
        this._canvasdiv.appendChild(this._canvas)
        this.resize()
        this._fabricCanvas = new fabric.Canvas(this._canvas)
        // disable fabric selection because default click is tracked by OSD
        this._fabricCanvas.selection = false
        // prevent OSD click elements on fabric objects
        this._fabricCanvas.on('mouse:down', function (options) {
          if (options.target) {
            options.e.preventDefaultAction = true
            options.e.preventDefault()
            options.e.stopPropagation()
          }
        })
        this._viewer.addHandler('update-viewport', function () {
          self.resize()
          self.resizecanvas()
        })

        this._viewer.addHandler('open', function () {
          self.resize()
          self.resizecanvas()
        })
      }

      Overlay.prototype = {
        // ----------
        canvas: function () {
          return this._canvas
        },
        fabricCanvas: function () {
          return this._fabricCanvas
        },
        // ----------
        clear: function () {
          this._fabricCanvas.clearAll()
        },
        // ----------
        resize: function () {
          if (this._containerWidth !== this._viewer.container.clientWidth) {
            this._containerWidth = this._viewer.container.clientWidth
            this._canvasdiv.setAttribute('width', this._containerWidth)
            this._canvas.setAttribute('width', this._containerWidth)
          }

          if (this._containerHeight !== this._viewer.container.clientHeight) {
            this._containerHeight = this._viewer.container.clientHeight
            this._canvasdiv.setAttribute('height', this._containerHeight)
            this._canvas.setAttribute('height', this._containerHeight)
          }
        },
        resizecanvas: function () {
          var origin = new seadragon.Point(0, 0)
          var viewportZoom = this._viewer.viewport.getZoom(true)
          this._fabricCanvas.setWidth(this._containerWidth)
          this._fabricCanvas.setHeight(this._containerHeight)
          var zoom = this._viewer.viewport._containerInnerSize.x * viewportZoom / this._scale
          this._fabricCanvas.setZoom(zoom)
          var viewportWindowPoint = this._viewer.viewport.viewportToWindowCoordinates(origin)
          var x = Math.round(viewportWindowPoint.x)
          var y = Math.round(viewportWindowPoint.y)
          var canvasOffset = this._canvasdiv.getBoundingClientRect()

          var pageScroll = seadragon.getPageScroll()

          this._fabricCanvas.absolutePan(new fabric.Point(canvasOffset.left - x + pageScroll.x, canvasOffset.top - y + pageScroll.y))
        }

      }
    },
    toggleDrawing: function () {
      this.drawEnable = !this.drawEnable
      this.viewer.setMouseNavEnabled(!this.drawEnable)
      this.viewer.outerTracker.setTracking(!this.drawEnable)
      this.overlay.fabricCanvas().isDrawingMode = this.drawEnable
    },
    deleteSelectedObject: function () {
      this.overlay._fabricCanvas.remove(this.overlay._fabricCanvas.getActiveObject())
      setTimeout(() => {
        console.log('do')
        console.log(this.savedPath)
        fabric.util.enlivenObjects([this.savedPath], function (objects) {
          objects.forEach(function (o) {
            this.overlay._fabricCanvas.add(o)
          })
        })
      }, 3000)
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
    background: #187fc4 url('../assets/addition.png') no-repeat;
    background-size: 100%;
  }
  #zoomoutbtn {
    background: #187fc4 url('../assets/offline.png') no-repeat;
    background-size: 100%;
  }
  #home {
    background: #187fc4 url('../assets/homepage.png') no-repeat;
    background-size: 100%;
  }
  #full {
    background: #187fc4 url('../assets/fullscreen.png') no-repeat;
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

  .drawing {
    background-color: #179653 ;
  }

</style>
