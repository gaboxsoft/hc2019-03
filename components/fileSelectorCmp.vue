
<template>
  <div>
    <!--<div id="template" style="display: none">-->
    <div id="template" class="bg-warning">
      <!--<div id="template" >-->
      <div class="upload" v-show="valid">
        <slot><input type="file" /></slot>
        <button class="custom-upload" @click="showUpload">AGREGA ARCHIVO</button>

      </div>
      <small :class="{ invalid: !valid }">
        {{ files.length }} / {{ max }}
        Archivo(s) seleccionado(s)
      </small>
      <ul class="files">
        <li v-for="file,index in files">
          <button @click="removeFile(index)">
            x
          </button>
          {{ file.name }}
        </li>
      </ul>
    </div>

  </div>
</template>
<script>


  /////////////////////////////



  /////////////////////////////
  export default {
    name: 'fileSelectorCmp',
    props: {
      max: {
        type: Number,
        default: 1
      },
      value: Array
    },


    data() {
      return {
        files: [],
        input: null
      }
    },

    mounted() {
      // Find input
      this.input = this.$el.querySelector('input[type=file]');
      this.input.addEventListener('change', () => this.onFileSelection())
      this.input.style.display = 'none'

      // Set multiple attribute on input, if max is more than one
      if (this.max > 1) {
        this.input.setAttribute('multiple', 'multiple');
      }
      else {
        this.input.removeAttribute('multiple');
      }

      // Populate internal value, if external value is given,
      // attempt to populate external value by firing event if not
      if (this.value) {
        this.files = this.value
      }
      else {
        this.$emit('input', [])
      }
    },

    methods: {

      /**
       * Executed, when the user selects a (or multiple) new file(s)
       * @returns {void}
       */
      onFileSelection() {

        // add all selected files
        for (let file of this.input.files) {
          //this.files.push({ name: file.name })
          this.files.push(file)
          //console.log('file capturado:',file)
        }

        // reset file input
        this.input.value = null;
      },

      /**
   * Removes the file with the given index
   * @param {number} index
   * @returns {void}
   */
      removeFile(index) {
        this.files.splice(index, 1)
      },

      showUpload() {
        const event = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        console.log(event)
        this.input.dispatchEvent(event)
      }
    },

    computed: {
      valid() {
        return this.files.length < this.max
      }
    },

    watch: {
      files(files) {
        this.$emit('input', files)
      }
    }
  }

</script>

