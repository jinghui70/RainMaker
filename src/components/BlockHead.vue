<template>
  <div class="block-head">
    <el-button
      v-if="goBack"
      icon="el-icon-d-arrow-left"
      type="info"
      @click="actionClick('goBack')"
      circle
      size="mini"
    />
    <span class="block-head__title" :class="{ action: !!titleAction }" @click="actionClick(titleAction)">
      {{ title }}
    </span>
    <div class="block-head__actions">
      <template v-for="action in actions">
        <span
          class="block-head__actionBtn"
          :class="{ disabled: action.disabled }"
          :key="action.id"
          @click="actionClick(action.id)"
        >
          <template v-if="action.icon">
            <i slot="icon" :class="action.icon" />
          </template>
          {{ action.title }}
        </span>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "BlockHead",
  props: {
    title: String,
    titleAction: String,
    actions: Array,
    goBack: {
      type: Boolean,
      defalult: false
    }
  },
  methods: {
    actionClick: function(e) {
      if (e && !e.disabled) this.$emit("action-click", e);
    }
  }
};
</script>
<style lang="scss">
.block-head {
  width: 100%;
  min-height: 36px;
  background: #1e1e1e;
  display: flex;
  align-items: center;
}

.block-head__title {
  color: #8b8b8b;
  font-weight: bold;
  margin-left: 10px;
  user-select: none;
  &.action:hover {
    cursor: pointer;
  }
}

.block-head__actions {
  display: flex;
  flex: 1;
  align-items: center;
  padding-right: 5px;
  justify-content: flex-end;
}

.block-head__actionBtn {
  display: inline-block;
  min-width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  margin-left: 10px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: #333333;
  }
  &.disabled {
    color: #333333;
    &:hover {
      background-color: inherit;
    }
  }
}
</style>
