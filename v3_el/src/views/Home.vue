<script setup lang="ts">

</script>

<template>
  <div>
    <div class="home-container">{{ $t('welcomeMessage')}}</div>
    <div class="home-container">{{ $t('advertisement')}}</div>
    <div class="home-container"><img src="../assets/weixinqrcode_small.jpg" alt="{{ $t('weixinAlt')}}"/></div>
  </div>
</template>

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
