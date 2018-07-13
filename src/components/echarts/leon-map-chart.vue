    <template>
        <div class="map-chart" :id="id" :option="option" :style="style"></div>
    </template>

    <script>
    import echartsConfig from "src/config/echartsConfig";
    require('echarts/map/js/china.js')

    export default {
        name: "leon-map-chart",
        props: {
            id: {
                type: String
            },
            height: {
                type: String,
                default: '658px'
            },
            width: {
                type: String,
                default: '858px'
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
                    option: echartsConfig.MapEChartsOptions(self.option)
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