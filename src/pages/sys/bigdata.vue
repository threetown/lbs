<template>
    <div class="fullscreen" ref="fullscree">
        <div class="button-group">
            <Button type="primary" class="triggerFullscree" @click="fullScreen" v-show="!fullscree.status"><Icon type="arrow-expand"></Icon></Button>
            <Button type="primary" class="triggerFullscree" @click="exitFull" v-show="fullscree.status"><Icon type="arrow-expand"></Icon></Button>
        </div>
        <img src="~assets/img/bigdata.png" style="max-width: 100%;" />
    </div>
</template>

<script>
export default {
  data() {
    return {
        fullscree: {
            status : false
        }
    }
  },
  methods: {
    fullScreen() {
      let el = this.$refs.fullscree
        this.fullscree.status = true;
      let rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen;

      if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
      } else if (typeof window.ActiveXObject != "undefined") {
        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
        let wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    exitFull() {
        this.fullscree.status = false;
      // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
        document.mozCancelFullScreen ||    //Chrome等
        document.webkitExitFullscreen || //FireFox
        document.webkitExitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(document);
        }else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
  }
};
</script>

<style lang="less" scoped>
    html,body{
        height: 100%;
    }
    
    .fullscreen{
        position: relative;
        height: 100%;
        background: #111213;
        .button-group{
            position: absolute;
            right: 10px;
            top: 10px;
            z-index: 10;
            font-size: 12px;
            width: 100px;
            height: 34px;
            .triggerFullscree{
                display: none;
                i{
                    font-size: 20px;
                    margin-right: 5px;
                    vertical-align: top;
                }
            }
            
            &:hover{
                .triggerFullscree{
                    display: block;
                }
            }
        }
    }
    
</style>
