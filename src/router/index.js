import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/components/Layout.vue'
import disease from '@/pages/Disease'
import annotation from '@/pages/Annotation'
import slice from '@/pages/Slice'
import diseaseDetail from '@/pages/DiseaseDetail'
import sliceDetail from '@/pages/SliceDetail'
import annotationDetail from '@/pages/AnnotationDetail'
import sliceViewer from '@/pages/SliceView'
import sliceViewrAnnotation from '@/pages/SliceViewAnnotation'
import internalSlice from '@/pages/internal/InternalSlice'
import internalSliceView from '@/pages/internal/InternalSliceView'
import internalLayout from '@/components/internal/LayoutInternal'
import internalSliceDetail from '@/pages/internal/InternalSliceDetail'
import login from '@/pages/internal/InternalLogin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layout,
      children: [
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
        }
      ]
    }, {
      path: '/sliceViewer/:id',
      name: 'sliceViewer',
      component: sliceViewer
    }, {
      path: '/sliceViewerAnnotation/:id',
      name: 'sliceViewerAnnotation',
      component: sliceViewrAnnotation
    },
    {
      path: '/internal/internalSliceView/:id',
      name: 'internalSliceView',
      component: internalSliceView
    }, {
      path: '/internal',
      name: 'internal',
      redirect: '/internal/internalSlice/4',
      component: internalLayout,
      children: [
        {
          path: 'internalSlice/:id',
          name: 'internalSlice',
          component: internalSlice
        }, {
          path: 'internalSliceDetail/:id',
          name: 'internalSliceDetail',
          component: internalSliceDetail
        }
      ]
    }, {
      path: '/internal/login',
      name: 'login',
      component: login
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return {
      y: 0
    }
  }
})
