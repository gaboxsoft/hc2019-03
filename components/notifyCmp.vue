<template>
  
    <div id="notify" ref="Notify"
         class="alert alert-danger" role="alert"
         v-show="show">
  </div>
</template>


<script>
  
  export default
    {
      name: 'notifyCmp',
      computed: {
      },
      data(){
        return{
          show: false,
          showTag: false,
          showLink:false
        }
      },
     
      methods: {
        showNotify: function (mensaje, tiempo, link, target) {
          var d = document.createElement('div');
          var e = {};
          if (link) {
            e = document.createElement('a');
            e.innerText = mensaje;
            e.href = link;
            e.className = "text-center";
            if (target) {
              e.target = "_blank"
            }
          }
          else {
            e = document.createElement('h5');
            e.innerText = mensaje;
          }
          d.appendChild(e);
          this.$refs.Notify.appendChild(d);
          this.show = true;          
          setTimeout(() => {
            this.show = false;
            this.$refs.Notify.removeChild(d);
          },
            tiempo * 1000);
        }

      }
  }
</script>
