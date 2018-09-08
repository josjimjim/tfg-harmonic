<template>
  <div class="field is-horizontal">
    <div class="field-label is-small">
      <label v-text="label" class="label"></label>
    </div>
    <div class="field-body">
      <div class="field">
        <p class="control">
          <slot></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'generic-input',
  props: ['label']
}
</script>
<style>

</style>
