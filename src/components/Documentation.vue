<template>
  <div class="content has-text-justified">
    <div v-for="elem in docum">
      <h4 v-if="elem.text.title != ''">{{elem.text.title}}</h4>
      <p v-html="elem.text.content"></p>
      <figure v-if="elem.image.src != ''">
        <img :src="require(`@/assets/images/${elem.image.src}`)" :alt="elem.image.alt">
        <figcaption>
          {{elem.image.alt}}
        </figcaption>
      </figure>
      <br />
    </div>
  </div>
</template>

<script>
import doc from '@/assets/documentation.json'

export default {
  name: 'documentation',
  props: ['type'],
  computed: {
    docum(){
      return doc[this.type]
    }
  }
}
</script>
<style>

</style>
