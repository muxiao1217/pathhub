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
            <div class="jumpToSliceDetail">
              <router-link :to="'/internal/internalSliceView/' + id">
                <el-button class="hdblue">浏览切片大图</el-button>
              </router-link>
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
        <div class="list-title">诊断结果</div>
        <div class="list-content">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="result"></el-input>
          <div style="text-align:right">
            <el-button class="hdblue_con" @click="onResultSubmit">保存</el-button>
            <el-button class="hdblue_con" @click="showResults">显示所有评论结果</el-button>
          </div>
          <transition name="fade">
            <div class="comment-container" v-if="resultsShow">
              <div class="title">用户评论</div>
              <div v-if="!hasComments" class="noComment">暂无评论</div>
              <div class="comment">
                <comment v-for="item in resultTableData"
                        :key="item.id"
                        :author="item.username"
                        :date="item.createTime"
                        :content="item.diagnosis"
                        />
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="slice-list">
        <div class="list-title">信息修改</div>
        <div class="list-content">
          <el-form label-position="left" label-width="100px" ref="form" :modle="form">
            <el-form-item label="性别">
              <el-select placeholder="请选择性别" style="width:200px" v-model="form.sex">
                <el-option label="男" value="Man"></el-option>
                <el-option label="女" value="Female"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input style="width:200px" placeholder="请输入年龄" v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item label="临床诊断">
              <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.clinicalDiagnosis"></el-input>
            </el-form-item>
            <el-form-item label="病理分类">
              <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.pathologyClassification"></el-input>
            </el-form-item>
            <el-form-item label="病理诊断">
              <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.pathologyDiagnosis"></el-input>
            </el-form-item>
            <el-form-item style="text-align:right">
                <el-button type="primary" @click="onInfoUpdate">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
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
                      <div :style = "{backgroundImage:'url(http://test.hengdaomed.com/wsi/v1/kfb-thumnail/'+item.id+')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100%', height: '200px'}"></div>
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
/* eslint-disable */
import SeaDragon from 'openseadragon_m'
import Circle from 'circle'
import Point from 'point'
import comment from '@/components/internal/Comment'

export default {
  name: 'sliceDetail',
  components: {
    comment
  },
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
      },
      result: '',
      resultsShow: false,
      resultTableData: [],
      form: {
        sex: '',
        age: '',
        clinicalDiagnosis: '',
        pathologyClassification: '',
        pathologyDiagnosis: ''
      },
      hasComments: true
    }
  },
  created: function () {
    this.getSize()
    // this.getSiblingsSlides()
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
          this.slideInfo.age = r.data.pathologyCaseDto.age // 添加切片信息
          this.slideInfo.sex = r.data.pathologyCaseDto.sex // 添加切片信息
          this.slideInfo.pathologyClassification = r.data.pathologyCaseDto.pathologyClassification // 添加切片信息
          this.slideInfo.clinicalDiagnosis = r.data.pathologyCaseDto.clinicalDiagnosis // 添加切片信息
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
      let startTime = new Date().getTime()
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
      console.log(ossTileUrl, this.width, this.height)
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
    },
    onResultSubmit () {
      this.$api.put(this.$api.getBaseURL('v1/slide-comment'), {token: this.$store.state.token}, {diagnosis: this.result, userId: this.$store.state.userId, digitalSlideId: this.id}, res => {
        this.result = ''
        this.resultsShow = false
        this.$message({
          message: '发送成功',
          type: 'success'
        })
        if (res.code === 4400) {
          this.$message.error({
            message: '登录超时'
          })
          this.$store.commit('LOGOUT')
          this.$router.push({ path: '/internal/login' })
        }
      }, err => {
          this.$message.error({
            message: '发送失败请重试'
          })
      })
    },
    showResults () {
      this.resultsShow = !this.resultsShow
      if (this.resultsShow) {
        this.getDiagnoseResults()
      }
    },
    getDiagnoseResults () {
      this.$api.get(this.$api.getBaseURL('v1/'+ this.id +'/slide-comments'), {token: this.$store.state.token}, {
          "direction": "",
          "pageSize": 50,
          "sort": "",
          "startPage": 0
      }, res => {
        if (res.data) {
          this.resultTableData = res.data.contents
          if (this.resultTableData.length > 0) {
            this.hasComments = true
          } else {
            this.hasComments = false
          }
        }
        if (res.code === 4400) {
          this.$message.error({
            message: '登录超时'
          })
        this.$store.commit('LOGOUT')
        this.$router.push({ path: '/internal/login' })
        }

      }, err => {
        this.$message.error({
          message: '获取失败'
        })
        console.log(err)
      })
    },
    onInfoUpdate () {
      this.$api.put(this.$api.getBaseURL('v1/digitalslide'), {token: this.$store.state.token}, {
        id: this.id,
        pathologyCaseDto: {
          age: this.form.age,
          sex: this.form.sex,
          clinicalDiagnosis: this.form.clinicalDiagnosis,
          pathologyClassification: this.form.pathologyClassification,
          pathologyDiagnosis: this.form.pathologyDiagnosis
        }
      }, res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }, err => {
        this.$message.error({
          message: '更新失败'
        })
      })
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
  .jumpToSliceDetail {
    margin-top: 20px;
  }
  .hdblue {
    width: 100%;
    background-color: #187fc4;
    color: #ffffff;
  }
  .hdblue_con{
    margin-top: 10px;
    background-color: #187fc4;
    color: #ffffff;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s ease;
  }
  .fade-enter, .fade-leave-to/* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .comment {
    /* border: 1px solid #dcdfe6; */
    /* border-radius: 5px; */
    padding: 0 20px;
    margin-top: 10px;
    border-left: 5px solid #fafafa;
    max-height: 400px;
    overflow-y: hidden;
  }
  .comment:hover {
    overflow-y: auto;
  }
  .comment-container .title {
    margin-bottom: 20px;
  }
  .noComment {
    border-left: 5px solid #fafafa;
    padding: 0 20px;
  }

</style>
