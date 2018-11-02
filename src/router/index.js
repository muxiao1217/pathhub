import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/components/Layout.vue'
import disease from '@/pages/Disease'
import annotation from '@/pages/Annotation'
import slice from '@/pages/Slice'
import diseaseDetail from '@/pages/DiseaseDetail'
import sliceDetail from '@/pages/sliceDetail'
import annotationDetail from '@/pages/AnnotationDetail'
import sliceViewer from '@/pages/SliceView'
import internalSlice from '@/pages/InternalSlice'
import internalSliceDetail from '@/pages/InternalSliceDetail'
import internalLayout from '@/components/LayoutInternal'
import login from '@/pages/InternalLogin'

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
      path: '/internal/internalSliceDetail/:id',
      name: 'internalSliceDetail',
      component: internalSliceDetail
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
