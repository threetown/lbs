<template>
    <div class="detailWrapper">
        <div class="returnServer" @click="returnService()">返回</div>
        <div class="detailCont">
            <div class="topTitle">服务调用详情</div>
            <div class="selectCont">
                <Row style="margin-bottom: 20px;">
                    <Col span="12">
                        <Select size="large" v-model="typeModel" style="width:200px;float: left;margin-right:16px" @on-change="changeQueryType">
                            <Option v-for="item in serviceTypeOptions" :value="item.value" :key="item.value">{{ item.title }}</Option>
                        </Select>
                        <Select size="large" v-model="nameModel" style="width:200px;float: left" @on-change="changeQueryName">
                            <Option v-for="item in serviceNameOptions" :value="item.value" :key="item.value">{{ item.title }}</Option>
                        </Select>
                    </Col>
                    <Col span="12">&nbsp;
                    </Col>
                </Row>
            </div>
            <div class="tableCont">
                <div v-if="tableData.loading">{{tableData.loadTips}}</div>
                <Table v-if="!tableData.loading" class="" border :columns="tableData.columns" :data="tableData.data"></Table>
                <div v-show="!tableData.loading" class="tablePage">
                    <Page :total="tableData.total"
                        :current="tableData.page"
                        :page-size="tableData.rows"
                        @on-change="changeQueryPage"
                        show-total></Page>
                </div>
            </div>
            <div class="lineChartCont echartStyle">
                <div class="eChartTitle">{{serviceName}}调用量统计</div>
                <div class="eChartBtn">
                    <RadioGroup v-model="lineChartBtnModel" type="button" @on-change="linechartBtnClick">
                        <Radio label="totalCall">总调用量</Radio>
                        <Radio label="todayCall">当日调用量</Radio>
                    </RadioGroup>
                </div>
                <div class="lineChart">
                    <Spin fix v-if="lineChart.loading">
                        <div class="loader-spin">
                            <svg class="circular" viewBox="25 25 50 50">
                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                            </svg>
                        </div>
                    </Spin>
                    <line-single-bar-light-echart v-if="!lineChart.loading" :id="lineChart.id" :option="lineChart.option"></line-single-bar-light-echart>
                </div>
               
            </div>
            <div class="circlePieChartCont echartStyle">
                <div class="eChartTitle">{{serviceName}}调用量统计</div>
                <div class="eChartBtn">
                    <RadioGroup v-model="pieChartBtnModel" type="button" @on-change="pieChartBtnClick">
                        <Radio label="totalCall">总调用量</Radio>
                        <Radio label="todayCall">当日调用量</Radio>
                    </RadioGroup>
                </div>
                <div class="pieChart">
                    <Spin fix v-if="pieChart.loading">
                        <div class="loader-spin">
                            <svg class="circular" viewBox="25 25 50 50">
                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                            </svg>
                        </div>
                    </Spin>
                    <circle-pie-light-echart v-if="!pieChart.loading" :id="pieChart.id" :option="pieChart.data"></circle-pie-light-echart>
                </div>
            </div>
        </div>
        <Modal
            v-model="perDetailModal.isOpen"
            :mask-closable="false"
            class-name="custom-modal vertical-center-modal"
            width="700">
            <Icon type="ios-close-empty" slot="close" @click="closePerDetailModal"></Icon>
            <h2 class="perDetailTitle" slot="header">{{serviceName}}调用服务次数统计</h2>
            <div class="perDetailCont">
                <div class="dateEChartBtn">
                    <RadioGroup v-model="dateChartBtnModel" type="button" @on-change="dateChartBtnClick">
                        <Radio label="year">按年度</Radio>
                        <Radio label="month">按月度</Radio>
                        <Radio label="date">按日期</Radio>
                    </RadioGroup>
                    <div class="dateTimeCont">
                        <DatePicker :type="dateType" :placeholder="'Select ' + dateType" :value="curDate" v-model="curDate" :format="dataFormater" style="width: 200px" @on-change="dateSelectChange"></DatePicker>
                    </div>
                </div>
                <div class="dateLineChart">
                    <Spin fix v-if="perDetailModal.loading">
                        <div class="loader-spin">
                            <svg class="circular" viewBox="25 25 50 50">
                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                            </svg>
                        </div>
                    </Spin>
                    <line-single-bar-light-echart v-if="!perDetailModal.loading" :id="perDetailModal.id" :option="perDetailModal.option" width="680px"></line-single-bar-light-echart>
                </div>
            </div>
            <p slot="footer"></p>
            
        </Modal> <!-- 编辑/新增服务 -->
    </div>
</template>

<script>
import * as tools from 'src/util/tools'
import { ajaxRequestServiceCallDetail, ajaxRequestServiceDetailByDate } from 'src/service/sys'
import lineSingleBarLightEchart from 'components/echarts/line-single-bar-light-chart'
import circlePieLightEchart from 'components/echarts/circle-pie-light-chart'
export default {
    name:'serviceCallDetail',
    components:{
        lineSingleBarLightEchart,
        circlePieLightEchart
    },
    data(){
        return {
            //传递过来的
            paramsData:{},
            //curRow 详情row
            curRow:{},
            //all data
            serviceDetail:[],
            serviceTypeOptions:[],
            serviceNameOptions:[],
            //当前服务名称
            serviceName:'',
            typeModel: 0,
            nameModel: 0,
            tableData:{
                loading:false,
                loadTips:'努力加载中，请稍等...',
                columns:[
                   {
                        title: '服务名称',
                        key: 'serviceName'
                    },
                    {
                        title: '应用名称',
                        key: 'appName'
                    },
                    {
                        title: '调用总量',
                        key: 'totalCall',
                        sortable:true
                    },
                    {
                        title: '当日调用量',
                        key: 'todayCall',
                        sortable:true
                    },
                    {
                        title: '操作',key: 'action', align: 'center', width: 220, render: (h, params) => {
                            return h('div', {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items', on: {
                                        click: () => {
                                            //
                                            this.clickShowDetail(params);
                                        }
                                    }
                                }, '明细')
                            ])
                        }
                    }
                ],
                data:[],
                page: 1,
                rows: 8,
                total: 0,
            },
            lineChartBtnModel:'totalCall',
            pieChartBtnModel:'totalCall',
            lineChart:{
                id:"serviceLineChat",
                loading:false,
                option:{
                    type:'total',
                    name:'调用量',
                    legend:'调用量',
                    data:[]
                }
            },
            pieChart:{
                id:"servicePieChat",
                loading:false,
                data:[]
            },
            dateChartBtnModel:'year',
            dateType:'year',
            dataFormater:'yyyy',
            curDate:'',
            perDetailModal:{
                isOpen:false,
                loading:false,
                loadTips:'努力加载中，请稍等...',
                id:'perDetailChart',
                option:{
                    type:'month',
                    name:'调用量',
                    legend:'调用量',
                    data:[
                            {
                                'xAxis': '01',
                                'yAxis':80
                            },
                            {
                                'xAxis': '02',
                                'yAxis':90
                            },
                            {
                                'xAxis': '03',
                                'yAxis':40
                            },{
                                'xAxis': '04',
                                'yAxis':50
                            },
                            {
                                'xAxis': '05',
                                'yAxis':80
                            },
                            {
                                'xAxis': '06',
                                'yAxis':90
                            },
                            {
                                'xAxis': '07',
                                'yAxis':50
                            },{
                                'xAxis': '08',
                                'yAxis':70
                            }
                        ]
                }
            }
        }
    },
    methods:{
        init(params){
            this.paramsData = params;
            this.getServiceCallDetail(params);
        },
        returnService(){
            this.$router.push({
                name: 'service' 
            });
        },
        getServiceCallDetail(params){
            let self = this;
            let data = {};
            data.serviceId = params.serviceId;
            data.serviceTypeMajor = params.serviceTypeMajor;
            this.tableData.loading = true;
            ajaxRequestServiceCallDetail(data).then(res => {
                if(res.state === 0){
                    let arrData = res.data.data;
                    if(arrData.length > 0){
                        this.tableData.loading = false;
                        this.serviceDetail = arrData;
                        this.generateTableData(arrData);
                    }else{
                        this.tableData.loadTips="抱歉，暂无数据！";
                    }
                   
                }else{
                    this.tableData.loadTips="糟糕，加载失败！";
                }
            })
        },
        generateTableData(data){
            if(this.paramsData.serviceTypeMajor && this.paramsData.serviceId){
                this.typeModel = this.paramsData.serviceTypeMajor.toString();
                this.nameModel = this.paramsData.serviceId;
                this.serviceName = this.paramsData.serviceName;
            }else{
                this.typeModel = data[0].code;
                this.nameModel = data[0].children[0].serviceId;
                this.serviceName = data[0].children[0].serviceName;
            }
            //服务类型
            this.serviceTypeOptions = data.map((item,index) => {
                return {
                    title:item.name,
                    value:item.code
                }
            });
            //服务名称
            let serviceNameData = data.find(item => item.code == this.typeModel).children;
            this.serviceNameOptions = serviceNameData.map(item =>{
                return {
                    title:item.serviceName,
                    value:item.serviceId
                }
            });
            //表格数据
            let arrTableData = serviceNameData.find(item => item.serviceId == this.nameModel).children;
            arrTableData.data.rows.map(item => item.serviceName = this.serviceName);
            this.tableData.data = arrTableData.data.rows;
            this.tableData.total = arrTableData.data.total;

            this.generateChartData(arrTableData.data.rows);
            this.genarateCirclePieData(arrTableData.data.rows);
        },
        generateChartData(data){
            this.lineChart.option.data = [];
            //lineChartBtnModel的值与list返回的总量 调用总量一致 勿改
            this.lineChart.option.data = data.map(item => {
                return {
                    xAxis:item.appName,
                    yAxis:item[this.lineChartBtnModel]
                }
            })
        },
        genarateCirclePieData(data){
            this.pieChart.data = [];
            this.pieChart.data = data.map(item => {
                return {
                    name:item.appName,
                    legend:item.appName+'--'+item[this.pieChartBtnModel],
                    value:item[this.pieChartBtnModel]
                }
            })
        },
        changeQueryType(){
            let data = this.serviceDetail;
            let serviceNameData = data.find(item => item.code == this.typeModel).children;
            //服务名称
            this.serviceNameOptions = serviceNameData.map(item =>{
                return {
                    title:item.serviceName,
                    value:item.serviceId
                }
            });
            this.nameModel = serviceNameData[0].serviceId;
            this.serviceName = serviceNameData[0].serviceName;
            //
            let arrTableData = serviceNameData.find(item => item.serviceId == this.nameModel).children;
            arrTableData.data.rows.map(item => item.serviceName = this.serviceName);
            this.tableData.data = arrTableData.data.rows;
            this.tableData.total = arrTableData.data.total;
            //刷新chart
            this.generateChartData(this.tableData.data);
            this.genarateCirclePieData(this.tableData.data);

        },
        changeQueryName(){
            let data = this.serviceDetail;
            let serviceNameData = data.find(item => item.code == this.typeModel).children;
            //服务名称
            let arrTableData = serviceNameData.find(item => item.serviceId == this.nameModel).children;
            this.serviceName = serviceNameData.find(item => item.serviceId == this.nameModel).serviceName;
            arrTableData.data.rows.map(item => item.serviceName = this.serviceName);
            this.tableData.data = arrTableData.data.rows;
            this.tableData.total = arrTableData.data.total;

            //刷新chart
            this.generateChartData(this.tableData.data);
            this.genarateCirclePieData(this.tableData.data);
        },
        changeQueryPage(){

        },
        linechartBtnClick(){
            this.generateChartData(this.tableData.data);
        },
        pieChartBtnClick(){
            this.genarateCirclePieData(this.tableData.data);
        },
        clickShowDetail(row){
            this.curRow = row;
            //弹框展示
            this.perDetailModal.isOpen = true;
            //设置时间格式
            this.curDate = tools.getCurDateByKey(this.dateType);
            //获取chart数据
            this.getDetailChartByDate();
        },
        closePerDetailModal(){
            this.perDetailModal.isOpen = false;
        },
        dateChartBtnClick(){
            this.dateType = this.dateChartBtnModel;
            if(this.dateType == 'year'){
                this.dataFormater = 'yyyy';
            }else if(this.dateType == 'month'){
                this.dataFormater = 'yyyy-MM';
            }else if(this.dateType == 'date'){
                this.dataFormater = 'yyyy-MM-dd';
            }
            //重置curDate 为当前时间
            this.curDate = tools.getCurDateByKey(this.dateType);
            //获取chart数据
            this.getDetailChartByDate();
        },
        getDetailChartByDate(){
            let self = this;
            let params = {
                dateType:this.dateType,
                dateValue:this.curDate,
                serviceId:this.nameModel,
                appId:this.curRow.appId,
                appName:this.curRow.appName

            };
            ajaxRequestServiceDetailByDate(params).then(res =>{
                this.perDetailModal.loading = true;
                if(res.state === 0){
                   let arrData = res.data.data;
                    if(arrData.length > 0){
                        this.perDetailModal.option.data = arrData.map(item => {return {xAxis:item.time,yAxis:item.value}});
                        this.perDetailModal.loading = false;
                    }else{
                        this.perDetailModal.loadTips = "抱歉，暂无数据！";
                    }
                }else{
                    this.perDetailModal.loadTips = "糟糕，加载失败！";
                }
            })
        
        },
        dateSelectChange(){
            this.getDetailChartByDate();
        }
    },
    created(){
        const self = this;
        this.init(self.$route.query.row);
    }
}
</script>
<style scorped>
    .detailWrapper{
        /* padding: 20px; */
        background: #fff;
    }

    .detailWrapper .returnServer{
        height: 54px;
        padding-left: 16px;
        text-align: left;
        font-size: 16px;
        color:#333;
        line-height: 54px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
    }

    .returnServer::before{
        content: '<';
        position: relative;
        left: 0;
        font-size: 14px;
        color:#333;
        padding-right: 4px;
        font-weight: bolder;
        text-align: center;
        line-height: 54px;
    }

    .detailWrapper .detailCont{
        padding: 10px 30px;
    }

    .detailCont .topTitle{
        height: 44px;
        text-align: left;
        font-size: 16px;
        color:#333;
        font-weight: bold;
        line-height: 44px;
    }

    .detailCont .selectCont{

    }
    .tableCont{
        background: #fff;
    }
    .tableCont .tablePage{
        margin-top: 12px;
        text-align: right;
    }

    .lineChartCont{
        margin-top: 10px;
    }

    .detailCont .echartStyle{

    }

    .echartStyle .eChartTitle{
        text-align: left;
        font-size: 16px;
        color:#333;
        font-weight: bold;
        line-height: 44px;
        border-bottom: 1px solid #f0f0f0;
    }

    .echartStyle .eChartBtn{
        line-height: 44px;
        margin: 10px 30px;
    }

    .lineChart{
        height: 300px;
        margin-bottom: 10px;
    }

    .pieChart{
        height: 400px;
        margin-bottom: 10px;
    }

    .circlePieChartCont{
        margin-top: 10px;
    }
    .custom-modal .ivu-modal-header{
        height: 54px !important;
        line-height: 54px;
    }
    .custom-modal .ivu-modal-body{
        padding:0 10px !important;
    }
    .perDetailTitle{
        line-height: 54px;
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }

    .perDetailCont{
        height: 340px;
    }

    .perDetailCont .dateEChartBtn{
        line-height: 44px;
        margin: 10px 30px;
    }

    .perDetailCont .dateTimeCont{
        float: right;
        height: 44px;
        width: 200px;
    }
    .perDetailCont .dateLineChart{
        height: 300px;
        margin-bottom: 10px;
    }
    .action-group{
        color:#108EFF;
        cursor: pointer;
    }
</style>


