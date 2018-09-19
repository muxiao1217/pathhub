<template>
  <div class="case-root">
    <div class="fix">
      <div class="slice-detail">
        <el-container class="slice-container">
          <el-aside width="250px">
            <div class="intro">
              <div class="intro-title">切片信息</div>
              <div class="intro-content">
                  <div class="grid-content bg-purple">
                    <div class="info">
                      <span class="info-title">性别：</span>
                      <span class="info-content">{{slideInfo.sex}}</span>
                    </div>
                    <div class="info pd-bt-10">
                      <span class="info-title">年龄：</span>
                      <span class="info-content">{{slideInfo.age}}</span>
                    </div>
                  </div>
              </div>
            </div>
            <div class="intro mg-tp-20">
              <div class="intro-title">病例信息</div>
              <div class="intro-content">
                <div class="grid-content bg-purple">
                  <div class="info">
                    <span class="info-title">临床诊断：</span>
                    <span class="info-content">{{slideInfo.clinicalDiagnosis}}</span>
                  </div>
                  <div class="info pd-bt-10">
                    <span class="info-title">病理分类：</span>
                    <span class="info-content">{{slideInfo.pathologyClassification}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-aside>
          <el-main class="slice-content">
            <div id="content" v-if="flag" :style="'width:90%;margin:0 auto;height:'+(content_height-60)+'px'">
              <div id="pic" style="width:100%;height:100%"></div>
            </div>
          </el-main>
        </el-container>
      </div>
      <div class="slice-list">
        <div class="list-title">相关切片</div>
        <div class="list-content">
          <div class="align-center" v-if="!siblingsDigitalSlides.length > 0">暂无内容</div>
          <swiper :options="swiperOption">
            <swiper-slide v-for="item in siblingsDigitalSlides" :key="item.id">
              <div class="slice">
                <router-link :to="/sliceDetail/+item.id">
                  <el-card shadow="hover">
                    <div>
                      <div :style = "{backgroundImage:'url(https://test.hengdaomed.com/wsi/v1/kfb-thumnail/'+item.id+')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100%', height: '200px'}"></div>
                      <div class="slice-id">编号{{item.id}}</div>
                    </div>
                  </el-card>
                </router-link>
              </div>
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import SeaDragon from 'openseadragon'
import Circle from 'circle'
import Point from 'point'

export default {
  name: 'sliceDetail',
  data () {
    return {
      'id': this.$route.params.id,
      'slide': {},
      'width': 0,
      'height': 0,
      'filepath': null,
      'siblingsDigitalSlides': '',
      flag: true,
      seaDragonObj: null,
      content_height: 0,
      selectStatus: '',
      tagStatus: [],
      annotations: [],
      updateTimer: null,
      canvasContainer: null,
      context: null,
      canvasContainerDIV: null,
      navigatorFlag: 0,
      navigatorTimer: null,
      circles: [],
      strokes: [],
      demoSize: 10,
      selectPoint: null,
      drawAnnotationStatus: false, // true:正在绘制标注中，false：离开标注绘制状态
      constant: {
        LOG_2: Math.log(2)
      },
      swiperOption: {
        slidesPerView: 6,
        spaceBetween: 30,
        slidesPerGroup: 1,
        // loop: true,
        // loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      slideInfo: {
        age: '',
        sex: '',
        pathologyClassification: '',
        clinicalDiagnosis: ''
      }
    }
  },
  created: function () {
    this.getSize()
    this.getSiblingsSlides()
    this.getDigitalSlide()
    this.getAnnotations()
    this.content_height = window.innerHeight - 80
    this.initDocumentEvents()
  },
  methods: {
    initDocumentEvents: function () {
      // document.addEventListener('navigator-init', this.drawAnnotationNavigator)
      this.handleDocumentKeyEvent()
    },
    handleDocumentKeyEvent: function () {
      document.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
          case 46:
            if (this.selectPoint) {
              let nextPoint = this.deletePoint(this.selectPoint)
              this.selectPoint = nextPoint
              if (this.selectPoint) {
                this.selectPoint.click()
              }
            }
            break
        }
      }.bind(this))
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
    },
    getDigitalSlide: function () {
      this.$api.get(this.$api.getBaseURL('v1/digitalslide/' + this.id), null, null, r => {
        if (r.code === 200) {
          this.slide = r.data
          this.slideInfo = r.data.pathologyCaseDto // 添加切片信息
          console.log(this.slideInfo)
          for (var i = 0; i < this.slide.tags.length; i++) {
            this.tagStatus[i] = "";
          }
        }
      })
    },
    switchSlide: function (id) {
      this.flag = false
    },
    getSiblingsSlides: function () {
      this.$api.get(this.$api.getBaseURL('v1/digitalslide/' + this.id + '/siblings'), null, null, r => {
        if (r.code === 200) {
          this.siblingsDigitalSlides = r.data.contents
        }
      })
    },
    getSize: function () {
      new Promise((resolve, reject) => {
        this.$api.get(this.$api.getHEReaderHost() + '/v1/kfb-init/' + this.id, {}, null, r => {
          if (r != 'success') {
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
            let maxValue = Math.max(r.width, r.height)
            let level = this.filepath = r.path
            resolve(r)
          })
        })
      }).then((data) => {
        this.seaDragon()
      })
    },
    // calculate points transform args about big canvas
    calculateRectOfAnnotations: function (bounds, canvas) {
      const width = bounds.width;
      const height = bounds.height;
      const left = bounds.x;
      const top = bounds.y;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      var offsetLeft = left;
      var offsetTop = top;
      const realWidth = canvasWidth / width
      const realHeight = canvasHeight / height
      let realOffsetX = -offsetLeft * realWidth
      let realOffsetY = -offsetTop * realHeight
      const w1 = Math.pow(2, Math.log(this.width / realWidth) / this.constant.LOG_2)
      const w2 = Math.pow(2, Math.log(this.height / realHeight) / this.constant.LOG_2)
      return [realOffsetX, realOffsetY, w1, w2]
    },
    // calculate points transform args about navigator
    calculateRectOfAnnotationForNavigator: function (bounds, context, position, size) {
      const width = bounds.width;
      const height = bounds.height;
      const left = bounds.x;
      const top = bounds.y;

      const canvasWidth = context.canvas.width;
      const canvasHeight = context.canvas.height;
      var offsetLeft = position.x;
      var offsetTop = position.y;
      let realOffsetX = position.x
      let realOffsetY = position.y
      let w1 = Math.pow(2, Math.log(this.width / size.x) / this.constant.LOG_2)
      let w2 = Math.pow(2, Math.log(this.height / size.y) / this.constant.LOG_2)
      return [realOffsetX, realOffsetY, w1, w2]
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
            continue;
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
          context.arc(circle.centerX, circle.centerY, circle.r, 0, Math.PI * 2, true);
          context.fill()
          context.closePath()
          lastCircle = circle
        }
      }
      context.restore()
    },
    // draw strokes of every group annotation
    drawAnnotationStroke: function (_this, realOffsetX, realOffsetY, w1, w2) {
      this.strokes = []
      for (let annotationIndex in this.annotations) {
        let annotation = this.annotations[annotationIndex]
        let context = _this.annotationCanvas.getContext('2d')
        context.save();
        context.translate(realOffsetX, realOffsetY)
        context.lineWidth = 3;
        context.strokeStyle = "yellow";
        context.beginPath()
        for (let index in annotation) {
          let point = annotation[index]
          if (index == 0) {
            context.moveTo(Math.round(point.x / w1), Math.round(point.y / w2));
          } else {
            context.lineTo(Math.round(point.x / w1), Math.round(point.y / w2));
          }
          context.index = annotationIndex
        }
        let point = annotation[0]
        context.lineTo(Math.round(point.x / w1), Math.round(point.y / w2));
        context.stroke()
        context.closePath()
        context.restore();
        this.strokes.push(context)
      }
    },
    // draw strokes of every group annotation by context
    drawAnnotationStrokeByContext: function (context, realOffsetX, realOffsetY, w1, w2) {
      context.save();
      context.translate(realOffsetX, realOffsetY)
      context.lineWidth = 3;
      context.strokeStyle = "yellow";
      this.strokes = []
      context.beginPath()
      for (let annotationIndex in this.annotations) {
        let annotation = this.annotations[annotationIndex]
        for (let index in annotation) {
          let point = annotation[index]
          if (index == 0) {
            context.moveTo(Math.round(point.x / w1), Math.round(point.y / w2));
          } else {
            context.lineTo(Math.round(point.x / w1), Math.round(point.y / w2));
          }
          context.index = annotationIndex
        }
        let point = annotation[0]
        context.lineTo(Math.round(point.x / w1), Math.round(point.y / w2));
      }
      context.stroke()
      context.closePath()
      context.restore();
    },
    drawAnnotationNavigator: function (e) {
      let source = e.detail.tile;
      let size = source.size
      let position = source.position;
      let context = e.detail.context;
      const bounds = source.bounds;
      const [realOffsetX, realOffsetY, w1, w2] = this.calculateRectOfAnnotationForNavigator(bounds, context, position, size);
      this.drawAnnotationStrokeByContext(context, realOffsetX, realOffsetY, w1, w2);
    },
    drawAnnotationCanvas: function () {
      let annotations = this.annotations;
      let _this = this;
      return (viewer) => {
        const viewport = viewer.viewport;
        const bounds = viewport.getBounds();
        if (!_this.canvasContainer) {
          _this.canvasContainer = document.getElementById("pic").children[0].children[0];
          _this.annotationCanvas = document.createElement('canvas');
          _this.annotationCanvas.style = 'background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; width: 100%; height: 100%;';
          _this.canvasContainer.appendChild(_this.annotationCanvas)
          _this.annotationCanvas.width = viewport.viewer.drawer.canvas.width;
          _this.annotationCanvas.height = viewport.viewer.drawer.canvas.height;
        }
        let context = _this.annotationCanvas.getContext('2d')
        context.clearRect(0, 0, _this.annotationCanvas.width, _this.annotationCanvas.height)
        const [realOffsetX, realOffsetY, w1, w2] = this.calculateRectOfAnnotations(bounds, context.canvas)
        this.drawAnnotationStroke(_this, realOffsetX, realOffsetY, w1, w1)
        this.drawAnnotationPoint(context, realOffsetX, realOffsetY, w1, w1, bounds)
      }
    },
    searchCircle: function (point) {
      for (let circle of this.circles) {
        if (circle.isInner(point.x, point.y)) {
          return circle.originPoint
        }
      }
    },
    deletePoint: function (point) {
      for (let pointGroupIndex in this.annotations) {
        let pointGroup = this.annotations[pointGroupIndex]
        for (let index in pointGroup) {
          let targetPoint = pointGroup[index]
          if (targetPoint.equal(point)) {
            let nextPoint
            pointGroup.splice(index, 1)
            if (pointGroup.length <= 0) {
              this.annotations.splice(pointGroupIndex, 1)
              return null
            }
            if ((index + 1) === pointGroup.length) {
              nextPoint = pointGroup[0]
            } else {
              nextPoint = pointGroup[index]
            }

            return nextPoint
          }
        }
      }
    },
    searchPoint: function (point) {
      for (let pointGroup of this.annotations) {
        for (let targetPoint of pointGroup) {
          if (targetPoint.equal(point)) {
            this.annotations.r
            return targetPoint
          }
        }
      }
    },
    seaDragon: function () {
      let ossTileUrl = this.$api.getHEReaderHost() + '/v1/kfb'
      let timeUrl = this.$api.getHost() + '/digitalslide/kfb/tile/' + this.id
      const viewer = SeaDragon({
        id: 'pic',
        prefixUrl: 'https://test.hengdaomed.com/pathhub/static/',
        tileSources: [{
          annotations: this.annotations,
          realPath: this.id,
          type: 'zoomifytileservice',
          tilesUrl: ossTileUrl,
          width: this.width,
          height: this.height,
          updateAnnotationCanvas: this.drawAnnotationCanvas(),
        }],
        showNavigator: true,
        navigatorPosition: "BOTTOM_LEFT",
        showFullPageControl: true,
      });

      viewer.addHandler('canvas-press', this.handleCanvasCanvasPress)

      viewer.addHandler('canvas-drag', this.handleCanvasDrag)

      viewer.addHandler('canvas-drag-end', this.handleCanvasDragEnd)

      viewer.addHandler('canvas-click', this.handleCanvasClick)
    },
    // handle canvas press, monitoring once annotation redrawn whether to start
    handleCanvasCanvasPress: function (sources) {
      let source = sources.eventSource
      let point = sources.position
      let bounds = source.viewport.getBounds()
      const [realOffsetX, realOffsetY, w1, w2, realX, realY] = this.calculatePointArgs(this.annotationCanvas, bounds, point)
      let currentPoint = this.searchCircle({
        'x': realX,
        'y': realY
      })
      if (currentPoint) {
        if (this.selectPoint) {
          this.selectPoint.cancelClick()
        }
        this.selectPoint = currentPoint
        this.selectPoint.click()
        this.drawAnnotationStatus = true
      }
    },
    // handle canvas drag, change and redrawn annotations while mouse pointer is in one point
    handleCanvasDrag: function (sources) {
      let source = sources.eventSource
      let point = sources.position
      let bounds = source.viewport.getBounds()
      const [realOffsetX, realOffsetY, w1, w2, realX, realY] = this.calculatePointArgs(this.annotationCanvas, bounds, point)
      let currentPoint = this.searchCircle({
        'x': realX,
        'y': realY
      })
      if (this.selectPoint && this.drawAnnotationStatus) {
        this.selectPoint.x = realX
        this.selectPoint.y = realY
        sources.preventDefaultAction = true
      }
    },
    // handle canvas drag end event, change status and stop redrawn annotation
    handleCanvasDragEnd: function (sources) {
      this.drawAnnotationStatus = false
    },
    // handle canvas click event, highlight selected point
    handleCanvasClick: function (sources) {
      let source = sources.eventSource
      let point = sources.position
      let bounds = source.viewport.getBounds()
      const [realOffsetX, realOffsetY, w1, w2, realX, realY] = this.calculatePointArgs(this.annotationCanvas, bounds, point)
      let currentPoint = this.searchCircle({
        'x': realX,
        'y': realY
      })
      if (currentPoint) {
        this.selectPoint = currentPoint
        this.selectPoint.click()
      } else {
        if (this.selectPoint) {
          this.selectPoint.cancelClick()
          this.selectPoint = null
        }
      }
      this.drawAnnotationCanvas()(source.viewport.viewer)
    },
    // calculate args about mouse pointer position in canvas, it include real offset args,
    calculatePointArgs: function (canvas, bounds, point) {
      let canvasSize = {
        'width': canvas.width,
        'height': canvas.height
      }
      const realWidth = canvasSize.width / bounds.width
      const realHeight = canvasSize.height / bounds.height
      const w1 = Math.pow(2, Math.log(this.width / realWidth) / this.constant.LOG_2)
      const w2 = Math.pow(2, Math.log(this.width / realHeight) / this.constant.LOG_2)
      let realOffsetX = -bounds.x * realWidth
      let realOffsetY = -bounds.y * realHeight
      let realX = w1 * (point.x - realOffsetX)
      let realY = w2 * (point.y - realOffsetY)
      return [realOffsetX, realOffsetY, w1, w2, realX, realY]
    }
  },
  watch: {
    '$route': function (to, from) {
      this.$router.history.go()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .fix {
    min-height: 1000px;
  }
  .case-root {
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 40px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  .intro {
    border: 1px solid #ebeef5;
    overflow: hidden;
  }
  .intro-title {
    background-color: #fafafa;
    padding: 10px;
    color: #2c3e50;
  }
  .info {
    padding-left: 10px;
    padding-top: 10px;
    font-size: 14px;
  }
  .info-content {
    color: #909399;
  }
  .slice-list .list-title {
    padding: 10px;
    background-color: #fafafa;
  }
  .slice-detail .slice-container {
  }
  .slice-content {
    margin-left: 10px;
    border: 1px solid #ebeef5;
  }
  .slice-list {
    margin-top: 30px;
  }
  .slice-list .list-title {
    padding: 10px;
    background-color: #fafafa;
  }
  .list-content {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .slice-id {
    text-align: center;
    margin-top: 5px;
  }
  .slice {
    margin-bottom: 10px;
  }
  .slice-root {
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 40px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  .disease-list {
    margin-top: 30px;
    padding: 10px;
    background-color: #fafafa;
  }
</style>
