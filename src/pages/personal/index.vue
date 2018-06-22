<template>
    <div>
        <Row :gutter="28" class="mb-24">
            <Col span="12">
                <div class="normal-block-mod">
                    <div class="mormal-block-hd ivu-row">
                        <h2 class="mbm-title">基本信息</h2>
                    </div>
                    <div class="mormal-block-bd">
                        <dl class="basicInfo">
                            <dt>用户名</dt>
                            <dd>amap_13007128888</dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>昵称</dt>
                            <dd>
                                <span v-show="!edit.nickname">{{userinfo.nickname ? userinfo.nickname : '未填写'}}</span>
                                <span v-show="!edit.nickname" class="editButton" title="修改昵称" @click="edit.nickname = !edit.nickname"><Icon type="compose"></Icon></span>
                                <!-- <transition name="fade"> -->
                                    <div v-show="edit.nickname" class="editCtrl">
                                        <Input v-model="userinfo.currentNickname" style="width: 150px"></Input>
                                        <span class="editGroup">
                                            <Icon class="cancel" type="ios-close-outline" title="取消" @click="cancelEditNickname"></Icon>
                                            <Icon class="submit" type="ios-checkmark-outline" title="保存" @click="handleSaveNickname"></Icon>
                                        </span>
                                    </div>
                                <!-- </transition> -->
                            </dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>性别</dt>
                            <dd>
                                <span v-show="!edit.gender">{{labelGender}}</span>
                                <span v-show="!edit.gender" class="editButton" title="修改性别" @click="edit.gender = !edit.gender"><Icon type="compose"></Icon></span>
                                <div v-show="edit.gender" class="editCtrl">
                                    <RadioGroup v-model="userinfo.currentGender">
                                        <Radio :label="item.value" v-for="item in genderArr">{{item.label}}</Radio>
                                    </RadioGroup>
                                    <span class="editGroup">
                                        <Icon class="cancel" type="ios-close-outline" title="取消" @click="cancelEditGender"></Icon>
                                        <Icon class="submit" type="ios-checkmark-outline" title="保存" @click="handleSaveGender"></Icon>
                                    </span>
                                </div>
                            </dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>生日</dt>
                            <dd>
                                <span v-show="!edit.birthday">{{userinfo.birthday ? userinfo.birthday : '未设置'}}</span>
                                <span v-show="!edit.birthday" class="editButton" title="修改性别" @click="edit.birthday = !edit.birthday"><Icon type="compose"></Icon></span>
                                <div v-show="edit.birthday" class="editCtrl">
                                    <DatePicker @on-change="setBirthday" type="date" placeholder="选择日期" style="width: 150px;vertical-align: top;"></DatePicker>
                                    <span class="editGroup">
                                        <Icon class="cancel" type="ios-close-outline" title="取消" @click="cancelEditBirthday"></Icon>
                                        <Icon class="submit" type="ios-checkmark-outline" title="保存" @click="handleSaveBirthday"></Icon>
                                    </span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </Col>
            <Col span="12">
                <div class="normal-block-mod">
                    <div class="mormal-block-hd ivu-row">
                        <h2 class="mbm-title">企业信息</h2>
                    </div>
                    <div class="mormal-block-bd">
                        <dl class="basicInfo">
                            <dt>所属行业</dt>
                            <dd>未设置 <Icon type="compose"></Icon></dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业名称</dt>
                            <dd>国信达数据有限公司 <Icon type="compose"></Icon></dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业官网</dt>
                            <dd>www.baidu.com <Icon type="compose"></Icon></dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业简介</dt>
                            <dd>企业简介企简介企业简介企业简介企业简介 <Icon type="compose"></Icon></dd>
                        </dl>
                    </div>
                </div>
            </Col>
        </Row>
        <Row :gutter="28" class="mb-24">
            <Col span="24">
                <div class="normal-block-mod">
                    <div class="mormal-block-hd ivu-row">
                        <h2 class="mbm-title">安全设置</h2>
                    </div>
                    <div class="mormal-block-bd">
                        <Row class="safeSetting">
                            <Col class="text-blank" span="4">绑定手机</Col>
                            <Col span="16">您已绑定了手机176****0996 [您的手机为安全手机，可以找回密码，但不能用于登录]</Col>
                            <Col class="tar" span="4">已设置 | 修改</Col>
                        </Row>
                        <Row class="safeSetting">
                            <Col class="text-blank" span="4">绑定邮箱</Col>
                            <Col span="16">绑定邮箱主要用于接收密保信息，保障账户安全。</Col>
                            <Col class="tar" span="4">已设置 | 修改</Col>
                        </Row>
                        <Row class="safeSetting">
                            <Col class="text-blank" span="4">帐号密码</Col>
                            <Col span="16">安全性高的密码可以使帐号更安全。建议您定期更换密码，设置一个包含字母，符号或数字中至少两项且长度超过6位的密码。</Col>
                            <Col class="tar" span="4">已设置 | 修改</Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import * as basicConfig from 'src/config/basicConfig'
    import * as tools from 'src/util/tools'

    export default {
        name: 'personal',
        data () {
            return {
                userinfo: {
                    nickname: 'leon',
                    currentNickname : 'leon',
                    gender: 0, // 0，保密；1，男；2，女
                    currentGender: 0,
                    birthday: '',
                    currentBirthday: ''
                },
                edit: {
                    nickname: false,
                    gender: false,
                    birthday: false
                }
            }
        },
        methods: {
            cancelEditNickname () {
                this.userinfo.currentNickname = this.userinfo.nickname;
                this.edit.nickname = false;
            },
            handleSaveNickname () {
                // TODO
                this.userinfo.nickname = this.userinfo.currentNickname;
                this.edit.nickname = false;
            },
            cancelEditGender(){
                this.userinfo.currentGender = this.userinfo.gender;
                this.edit.gender = false;
            },
            handleSaveGender() {
                this.userinfo.gender = this.userinfo.currentGender;
                this.edit.gender = false;
            },
            setBirthday(datatime){
                this.userinfo.currentBirthday = datatime;
            },
            cancelEditBirthday() {
                this.userinfo.currentBirthday = this.userinfo.birthday;
                this.edit.birthday = false;
            },
            handleSaveBirthday(){
                // TODO
                this.userinfo.birthday = this.userinfo.currentBirthday;
                this.edit.birthday = false;
            }
        },
        computed: {
            genderArr(){
                return basicConfig.gender;
            },
            labelGender(){
                const self = this;
                return tools.getDictData(self.genderArr, self.userinfo.gender)
            }
        }
    }
</script>

<style lang="less">
    .text-blank{
        color: #000;
    }
    .editButton{
        font-size: 16px;
        width: 18px;
        height: 16px;
        color: #008AFF;
        cursor: pointer;
        text-align: center;
        display: inline-block;
        vertical-align: middle;
        i{
            vertical-align: top;
        }
    }
    .editCtrl{
        display: inline-block;
        .ivu-input-wrapper,
        .ivu-radio-group,
        .ivu-radio-wrapper{
            vertical-align: top;
            .ivu-input{
                height: 30px;
                font-size: 14px;
                color: #666;
            }
        }
        .ivu-select-dropdown{
            font-size: 12px;
        }
        .editGroup{
            height: 30px;
            display: inline-block;
            vertical-align: top;
            font-size: 0;
            i{
                cursor: pointer;
                font-size: 22px;
                line-height: 30px;
                vertical-align: middle;
                margin: 0 5px;
                &.cancel{
                    color: #FF5151;
                }
                &.submit{
                    color: #00A85B;
                }
            }
        }
    }
    .basicInfo{
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        line-height: 32px;
        display: flex;
        margin-bottom: 5px;
        dt{
            color: #999;
            width: 68px;
            display: inline-block;
        }
        dd{
            flex: 1;
            color: #333;
        }
    }
    .safeSetting{
        border-bottom: 1px solid #e5e5e5;
        padding: 38px 0;
        .tar{
            text-align: right;
        }
    }

</style>