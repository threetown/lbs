    <template>
        <div class="line-chart" :id="id" :option="option" :style="style"></div>
    </template>

    <script>
    import echarts from "echarts";
    import echartsConfig from "src/config/echartsConfig";

    export default {
        name: "leon-line-chart",
        props: {
            id: {
                type: String
            },
            height: {
                type: String,
                default: '300px'
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
                console.log(self.option, 42)
                echartsConfig.init({
                    id: self.id,
                    option: echartsConfig.lineAreaChartOptions(self.option)
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
        }
    };
    </script>