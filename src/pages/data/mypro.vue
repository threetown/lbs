<template>
    <div style="margin: -25px -25px 0;">
        <div class="full-block-mod" style="padding: 0;">
            <iframe :src="mapviewProUrl" frameborder="0" width="100%" :height="height" style="vertical-align: top;"></iframe>
        </div>
    </div>
</template>

<script>
    import { mapviewProUrl } from "src/config/basicConfig"
    export default {
        data () {
            return {
                height: '600px',
                mapviewProUrl
            }
        },
        created(){
            const self = this;
            this.height = window.innerHeight - 65 + 'px';
             window.onresize = ()=> {
                 self.height = window.innerHeight - 65 + 'px';
             }
        }
    }
</script>
