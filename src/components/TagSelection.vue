<template>
  <div class="selection-root">
    <div class="selection-label">{{title}}:</div>
    <div class="selection-content">
      <div v-for="item in options" class="items" :class="{selected: item.selected}" @click="selectOneItem(item, options)">
        {{item.label}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'options'],
  name: 'tag-selection',
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    selectOneItem (item, options) {
      for (let i = 0; i < options.length; i++) {
        options[i].selected = false
      }
      item.selected = true
      this.$emit('input', item.value)
      this.$emit('change', item.value)
    }
  }
}
</script>

<style scoped>
  .selection-label {
    display: inline-block;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
  }
  .selection-content {
    display: inline-block;
    margin-left: 10px;
  }
  .items {
    display: inline-block;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 12px;
    cursor: pointer;
    margin-right: 30px;
  }
  .selected {
    background: #187fc4;
    color: #fff;
    font-size: 16px;
    /* font-style: italic; */
    font-weight: 600;
    border-radius: 10px;
  }

</style>
