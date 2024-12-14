<script setup lang="ts">
import Header from '@/views/layout/Header.vue'
import Aside from '@/views/layout/Aside.vue'
</script>

<template>
  <el-container>
    <el-header><Header/></el-header>
    <el-container>
      <el-aside width="auto" class="aside">
        <Aside/>
      </el-aside>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.el-header,.el-footer {
  padding: 0 !important; /* 去掉默认的 padding */
}
.aside,.el-main {
  height: calc(100vh - 60px);
}
</style>
