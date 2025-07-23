<template>
  <div class="demo-input">
    <tiny-input type="textarea" v-model="input" :rows="3" placeholder="rows 为默认"></tiny-input>
    <br />
    <br />
    <tiny-input
      type="textarea"
      v-model="input"
      :rows="1"
      placeholder="rows 为 1"
      :maxlength="100"
      show-word-limit
    ></tiny-input>
  </div>
</template>

<script>
import { TinyInput } from '@opentiny/vue'

export default {
  components: {
    TinyInput
  },
  data() {
    return {
      input: '2222'
    }
  }
}
</script>

<style scoped>
.demo-input .tiny-textarea {
  width: 400px;
}
</style>
