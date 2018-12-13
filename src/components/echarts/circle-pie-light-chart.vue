    <template>
        <div class="circle-pie-light-echart" :id="id" :option="option" :style="style"></div>
    </template>

    <script>
    import echartsConfig from "src/config/echartsConfig";

    export default {
        name: "circle-pie-light-echart",
        props: {
            id: {
                type: String
            },
            height: {
                type: String,
                default: '380px'
            },
            width: {
                type: String,
                default: '100%'
            },
            option: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data: function() {
            return {}
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                const self = this;
                echartsConfig.init({
                    id: self.id,
                    option: echartsConfig.circlePieLightChartOptions(self.option)
                })
            }
        },
        computed: {
            style () {
                return {
                    height: this.height,
                    width: this.width
                }
            }
        },
        watch: {
            option: {
                handler() {
                    this.init();
                },
                deep: true
            }
        }
    };
    </script>