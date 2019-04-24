<template>
  <div class="hello">
    <h1>{{ $t("song") }}</h1>
    <el-select v-model="$i18n.locale">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      options: [
        { value: "zh-CN", label: "中文" },
        { value: "en", label: "English" }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
