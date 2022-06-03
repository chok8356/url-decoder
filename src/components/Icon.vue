<template>
  <!--eslint-disable-->
  <i
    :class="$style.icon"
    :title="title"
    v-html="icon">
  </i>
</template>

<script setup lang="ts">
interface Props {
  icon: string,
  title: string
}

withDefaults(defineProps<Props>(), {
  icon: '',
  title: '',
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
  user-select: none;
  width: auto;

  svg {
    height: auto;
    stroke: currentcolor;
    width: 100%;
  }
}
</style>
