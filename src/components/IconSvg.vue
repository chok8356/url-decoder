<template>
  <!--eslint-disable-->
  <i
    :class="$style.icon"
    v-html="icon">
  </i>
</template>

<script setup lang="ts">
withDefaults(defineProps<{icon: string}>(), {
  icon: '',
});

</script>

<style lang="scss" module>
.icon {
  align-items: center;
  display: inline-flex;
  height: auto;
  justify-content: center;
  line-height: 1;
  max-height: 100%;
  max-width: 100%;
  width: auto;

  svg {
    height: auto;
    stroke: currentcolor;
    width: 100%;
  }
}
</style>
