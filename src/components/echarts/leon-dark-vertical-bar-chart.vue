    <template>
        <div class="dark-vertical-bar-chart" :id="id" :option="option" :style="style"></div>
    </template>

    <script>
    import echartsConfig from "src/config/echartsConfig";

    export default {
        name: "leon-dark-vertical-bar-chart",
        props: {
            id: {
                type: String
            },
            height: {
                type: String,
                default: '150px'
            },
            width: {
                type: String,
                default: '100%'
            },
            option: {
                type: Array
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
                    option: echartsConfig.darkVerticalBarChartOptions(self.option)
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