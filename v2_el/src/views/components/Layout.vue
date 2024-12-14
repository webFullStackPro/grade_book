<template>
  <el-container>
    <el-header>
      <router-view name="header" />
    </el-header>
    <el-container>
      <el-aside width="auto" class="aside">
        <Aside/>
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '@/views/components/Aside.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout',
  components: {Aside},
  data() {
    return {
    };
  },
  created () {
  },
  methods: {
  }
}
</script>

<style>
.aside {
  height: calc(100vh - 60px);
}
.main {
  height: calc(100vh - 60px);
}
</style>
