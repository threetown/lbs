    <template>
        <div class="line-bar-chart" :id="id" :option="option" :style="style"></div>
    </template>

    <script>
    import echartsConfig from "src/config/echartsConfig";

    export default {
        name: "leon-line-bar-chart",
        props: {
            id: {
                type: String
            },
            height: {
                type: String,
                default: '246px'
            },
            width: {
                type: String,
                default: '100%'
            },
            option: {
                type: Object,
                default() {
                    return {}
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
                    option: echartsConfig.lineBarChartOptions(self.option)
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