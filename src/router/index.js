import Vue from 'vue'
import Router from 'vue-router'
import disease from '@/pages/Disease'
import annotation from '@/pages/Annotation'
import slice from '@/pages/Slice'
import diseaseDetail from '@/pages/DiseaseDetail'
import sliceDetail from '@/pages/sliceDetail'
import annotationDetail from '@/pages/AnnotationDetail'
import sliceViewer from '@/pages/SliceViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'disease',
      component: disease
    }, {
      path: '/annotation',
      name: 'annotation',
      component: annotation
    }, {
      path: '/slice',
      name: 'slice',
      component: slice
    }, {
      path: '/diseaseDetail/:id',
      name: 'diseaseDetail',
      component: diseaseDetail
    }, {
      path: '/sliceDetail/:id',
      name: 'sliceDetail',
      component: sliceDetail
    }, {
      path: '/annotationDetail/:id',
      name: 'annotationDetail',
      component: annotationDetail
    }, {
      path: '/sliceViewer',
      name: 'sliceViewer',
      component: sliceViewer
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
