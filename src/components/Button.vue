<template>
  <button class="button primary"><slot></slot></button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const Button = defineComponent({
  name: "Button",
});

export default Button;
</script>

<style lang="scss" scoped>
.button {
  background-color: #DA0037;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.button:disabled {
  background-color: #eee;
  color: #4e4e4e;
}
</style>
