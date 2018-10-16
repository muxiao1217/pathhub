<template>
  <div class="selection-root">
    <div class="selection-label">{{title}}:</div>
    <div class="selection-content">
      <!-- eslint-disable -->
      <div v-for="item in options" class="items" :class="{selected: item.selected}" @click="selectOneItem(item, options)">
        {{item.label}}
      </div>
      <!-- eslint-enable -->
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
      if (!item.selected) {
        for (let i = 0; i < options.length; i++) {
          options[i].selected = false
        }
        item.selected = true
        this.$emit('input', item.value)
        this.$emit('change', item.value)
      } else {
        item.selected = false
        this.$emit('input', '')
        this.$emit('change', '')
      }
    }
  }
}
</script>

<style scoped>
  .selection-label {
    display: inline-block;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    position: absolute;
    left: 0px;
    top: 20px;
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
    margin-bottom: 10px;
  }
  .selected {
    background: #187fc4;
    color: #fff;
    font-size: 16px;
    /* font-style: italic; */
    font-weight: 600;
    border-radius: 10px;
  }
  .selection-root {
    position: relative;
    padding: 20px 75px 10px 70px;
    border-bottom: 1px solid #eee;
  }

</style>
