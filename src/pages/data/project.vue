<template>
    <div>
        <div class="full-block-mod" style="padding: 0;">
            <iframe src="http://mapview.cindata.cn" frameborder="0" width="100%" :height="height"></iframe>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                height: '600px'
            }
        },
        created(){
            const self = this;
            this.height = window.innerHeight - 114;
             window.onresize = ()=> {
                 self.height = window.innerHeight - 114;
             }
        }
    }
</script>