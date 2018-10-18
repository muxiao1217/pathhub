<template>
 <div>
   <div id="pic" style="width:100%;height:800px;margin-top:30px"></div>
 </div>
</template>

<script>
import seadragon from 'openseadragon'
import '@/utils/annotations/main.js'

export default {
  name: 'sliceViewer',
  created () {
    setTimeout(function () {
      seadragon({
        id: 'pic',
        prefixUrl: '/static/',
        tileSources: [{
          type: 'zoomifytileservice',
          realPath: 10,
          width: 103887,
          height: 85775,
          tilesUrl: 'https://test.hengdaomed.com/wsi/v1/kfb'
        }],
        showNavigator: true,
        debugMode: true
      })
    })
  }
}
</script>

<style scoped>

</style>
