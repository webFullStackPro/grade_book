<template>
  <div class="home">
    <div class="home-container">{{ $t('welcomeMessage')}}</div>
    <div class="home-container">{{ $t('advertisement')}}</div>
    <div class="home-container"><img src="../assets/weixinqrcode_small.jpg"/></div>
  </div>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home'
}
</script>

<style scoped>
.home-container{
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  font-size: 24px;
  margin-top: 20px;
}
</style>
