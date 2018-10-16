<template>
 <div>
   <div id="pic" style="width:100%;height:800px;margin-top:30px"></div>
 </div>
</template>

<script>
var seadragon = require('@/assets/js/openSeadragon/openseadragon.js')
export default {
  name: 'sliceViewer',
  created () {
    console.log(seadragon)
    setTimeout(function () {
      seadragon.OpenSeadragon({
        id: 'pic',
        prefixUrl: '/static/',
        tileSources: [{
          type: 'zoomifytileservice',
          realPath: 10,
          width: 103887,
          height: 85775,
          tilesUrl: 'https://test.hengdaomed.com/wsi/v1/kfb'
        }]
      })
    })
  }
}
</script>

<style scoped>

</style>
