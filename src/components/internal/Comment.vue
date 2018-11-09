<template>
  <div class="comment-root">
    <div class="author">
      <img src="@/assets/icon/user.png" style="width:20px;" alt="">
      <span>{{author}}:</span>
    </div>
    <div class="date">{{date}}</div>
    <div class="content">{{content}}</div>
  </div>
</template>

<script>
export default {
  props: [
    'author',
    'date',
    'content'
  ]
}
</script>

<style scoped>
  .comment-root {
    padding-bottom: 10px;
    border-bottom: 1px solid #fafafa;
    margin-bottom: 30px;
  }
  .comment-root .author {
    font-weight: bold;
    font-size: 18px;
  }
  .comment-root .date {
    font-size: 14px;
    margin-top: 5px;
    margin-bottom: 5px;
    color: #aaaaaa;
  }
  .comment-root .content {
  }
</style>
