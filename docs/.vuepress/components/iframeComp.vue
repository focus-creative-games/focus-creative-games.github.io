<template>
    <iframe class="video-iframe" width="80%" v-resize="{ log: true }" frameborder="no" 
        allowfullscreen="allowfullscreen" scrolling="no" seamless="" 
        sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts" :src="ihtml">
    </iframe>
</template>

<script>
  export default {
      props: {
          ihtml: {
              type: String
          }
      },
      mounted(){
            function changeVideoIframe(){
                const video = document.getElementsByClassName('video-iframe');
                const width = document.getElementsByClassName('video-iframe')[0].scrollWidth;
                for(let i = 0;i<video.length;i++){
                    video[i].style.height = width*0.75+'px'
                }
            }
            changeVideoIframe()
            window.onresize = function(){changeVideoIframe()}
      }
  }
</script>
<style>
iframe video {
  margin: 0;
}

iframe body {
  margin: 0;
}
</style>
