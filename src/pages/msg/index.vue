<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">消息中心<strong>包括预警消息、和系统公告等</strong></h2>
        </div>
        <Row style="margin-bottom: 22px;">
            <Col span="12">
                <Checkbox v-model="selectAll">全选</Checkbox>
                <Button type="primary" icon="trash-a" size="large" @click="showDeleteModal()">删除</Button>
                <Button type="primary" icon="ios-checkmark" size="large" @click="markReadMsg()">标记为已读</Button>
            </Col>
            <Col span="12">
                <Select size="large" v-model="typeModel" style="width:200px;float: right;margin-left:16px" @on-change="changeQueryType">
                    <Option v-for="item in msgTypeOptions" :value="item.value" :key="item.value">{{ item.title }}</Option>
                </Select>
                <Select size="large" v-model="statusModel" style="width:200px;float: right" @on-change="changeQueryStatus">
                    <Option v-for="item in msgStatusOptions" :value="item.value" :key="item.value">{{ item.title }}</Option>
                </Select>
            </Col>
        </Row>
        <div v-if="Loading.state" :class="'Placeholder ' + Loading.class">{{Loading.info}}</div>
        <div v-if="!Loading.state">
            <div class="collapse">
                <CheckboxGroup v-model="checkModel">
                    <div :class="index === curOpen ? 'panel active' : 'panel'" v-for="(item, index) in msgPageResource.msgData">
                        <div class="hd">
                            <Row>
                                <Col span="1">
                                    <Checkbox :label="item.relId" ><span>&nbsp;</span></Checkbox>
                                </Col>
                                <Col span="17" :class="item.noticeStatusCd ? 'msgReadStyle':'msgUnReadStyle'">[公告]{{item.title}}</Col>
                                <Col span="4" :class="item.noticeStatusCd ? 'msgReadStyle':'msgUnReadStyle'">{{item.noticeDt}}</Col>
                                <Col span="2" :class="[item.noticeStatusCd ? 'msgReadStyle':'msgUnReadStyle', 'tac', 'arrow']"><Icon type="ios-arrow-down" @click="toggleTab(index)"></Icon></Col>
                            </Row>
                        </div>
                        <div class="bd" v-if="index === curOpen ? true : false">
                            <Row class="msgCont">
                                <Col span="1">&nbsp;
                                </Col>  
                                <Col span="23">
                                    <Card :bordered="false" dis-hover>
                                        <p v-html="item.content"></p>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </CheckboxGroup>
               
            </div>
            <!-- 分页 -->
            <Page class="tablePage" show-total :total="msgPageResource.total"
                    :current="msgPageResource.page"
                    :page-size="msgPageResource.rows"
                    @on-change="changeQueryPage"/>
        </div>
        <Modal
            v-model="isOpenDeleteModal"
            class-name="custom-modal custom-warning-modal vertical-center-modal"
            width="378">
            <h2 class="title" slot="header">删除消息</h2>
            <div class="content">
                <p>您确定要删除所选公告消息吗?</p>
            </div>
            <div slot="footer" >
                <Button type="text" size="large" @click="isOpenDeleteModal = !isOpenDeleteModal">取消</Button>
                <Button type="primary" size="large"  @click.prevent="deleteMsg()">确认</Button>
            </div>
        </Modal> <!-- 删除 -->
    </div>
</template>
<script>
import { ajaxPostMsg, ajaxUpdateMsg, ajaxDelMsg } from 'src/service/msg'
export default {
        data() {
            return{
                //消息列表
            
                Loading: {
                    state: false,
                    class: 'loading',
                    info: '努力加载中，请稍等...'
                },
                checkModel:[],
                msgTypeOptions:[{
                        title:'预警消息',
                        value:2,
                    },
                    {
                        title:'异常消息',
                        value:1,
                    },
                    {
                        title:'系统公告',
                        value:0,
                    }
                ],
                msgStatusOptions:[{
                        title:'全部消息',
                        value:2
                    },
                    {
                        title:'已读消息',
                        value:1
                    },
                    {
                        title:'未读消息',
                        value:0
                    }
                ],
                typeModel: 2,
                statusModel: 2,
                curOpen: 0,
                selectAll:false,
                selectRelIds:{},
                isOpenDeleteModal:false,
                msgPageResource:{
                    msgData: [],
                    page: 1,
                    rows: 4,
                    total: 0
                }
            }
            
        },
        methods: {
            getMsgList(){
                let self = this;
                let data = {        
                    rows: this.msgPageResource.rows,
                    page:this.msgPageResource.page,
                    //消息类型  预警2 异常1 公告0
                    noticeType:this.typeModel,
                    //消息状态 全部'' 已读1 未读0
                    noticeStatusCd:this.statusModel === 2 ? undefined : this.statusModel,
                }
                this.Loading.state = true;
                this.Loading.class = 'loading';
                this.Loading.info = '努力加载中，请稍等...';
                ajaxPostMsg(data).then(res => {
                    if(res.success){
                        let resource = res.data.data;
                        if(resource && resource.rows.length){
                            self.msgPageResource.msgData = resource.rows;
                            self.msgPageResource.total = resource.total;
                            self.Loading.state = false;
                            //check 重置
                            this.checkModel = [];
                        }else{
                            self.Loading.class = 'empty'
                            self.Loading.info = '抱歉，暂无数据！'
                        }
                    }
                }).catch( reason => {
                    self.Loading.class = 'error';
                    self.Loading.info = '糟糕，服务器内部错误';//'错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })

            },
            toggleTab(index){
                this.curOpen = this.curOpen === index ? '' : index;
            },
            //显示删除确认框
            showDeleteModal(){
                //获取selectRelIds
                this.setSelectRelIds();
                //有选中要删除的公告则出现删除弹框
                if(this.selectRelIds && this.selectRelIds.relIds){
                    this.isOpenDeleteModal = true;
                }else{
                    //显示提示框
                    this.$Message.warning('请选择要操作的公告消息');
                    return false;
                }
                
            },
            //删除操作
            deleteMsg(){
                //获取selectRelIds
                if(this.selectRelIds && this.selectRelIds.relIds){
                    ajaxDelMsg(this.selectRelIds).then(res =>{
                        if(res.success){
                            this.$Message.success(res.message);
                            //关闭确认框
                            this.isOpenDeleteModal = false;
                            //刷新表格
                            this.getMsgList();
                        }
                    }).catch( reason => {
                        self.Loading.class = 'error';
                        self.Loading.info = '糟糕，服务器内部错误';//'错误提示：' + reason.statusText + '（'+ reason.status +'）';
                    })
                }else{
                    //显示提示框
                    this.$Message.warning('请选择要操作的公告消息');
                    return false;
                }

            },
            //标记已读操作
            markReadMsg(){
                //获取selectRelIds
               this.setSelectRelIds();
               //判断是否存在selectRelIds
                if(this.selectRelIds && this.selectRelIds.relIds){
                    ajaxUpdateMsg(this.selectRelIds).then(res =>{
                        if(res.success){
                            this.$Message.success(res.message);
                            this.getMsgList();
                        }
                        }).catch( reason => {
                            self.Loading.class = 'error';
                            self.Loading.info = '糟糕，服务器内部错误';//'错误提示：' + reason.statusText + '（'+ reason.status +'）';
                        })
               }else{
                    //显示提示框
                    this.$Message.warning('请选择要操作的公告消息');
                    return false;
               }

            },
            //分页
            changeQueryPage(curPage){
                this.msgPageResource.page = curPage;
                this.getMsgList();
            },
            //类型下拉
            changeQueryType(value){
                this.typeModel = value;
                this.getMsgList();
            },
            //状态下拉
            changeQueryStatus(value){
                this.statusModel = value;
                this.getMsgList();
            },
            //获取选择的id
            setSelectRelIds:function(){
                  //获取check id
                this.selectRelIds = {};
                var params = {};
                if(this.selectAll){
                    var checkedIds = this.msgPageResource.msgData.map(function(row){
                        return row.relId;
                    });
                    params.relIds = checkedIds.join(',');
                }else{
                    if(this.checkModel.length){
                        params.relIds = this.checkModel.join(',');
                    }
                }
                this.selectRelIds = params;
            }
        },
        computed:{
         
        },
        created(){
            this.getMsgList();
        }
}
</script>


<style lang="less">
  @import "~assets/styles/app.less";
</style>