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
                            <dd>{{userinfo.username}}</dd>
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
                                <span v-show="!edit.gender">{{labelGender ? labelGender : '保密'}}</span>
                                <span v-show="!edit.gender" class="editButton" title="修改性别" @click="edit.gender = !edit.gender"><Icon type="compose"></Icon></span>
                                <div v-show="edit.gender" class="editCtrl">
                                    <RadioGroup v-model="userinfo.currentGender">
                                        <Radio :label="item.value" v-for="item in genderArr" :key="item.value">{{item.label}}</Radio>
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
                            <dd>
                                <span v-show="!edit.industry">{{userinfo.industry ? userinfo.industry : '未设置'}}</span>
                                <span v-show="!edit.industry" class="editButton" title="修改昵称"><Icon type="compose"></Icon></span>
                            </dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业名称</dt>
                            <dd>
                                <span v-show="!edit.companyName">{{userinfo.companyName ? userinfo.companyName : '未填写'}}</span>
                                <span v-show="!edit.companyName" class="editButton" title="修改昵称" @click="edit.companyName = !edit.companyName"><Icon type="compose"></Icon></span>
                                <div v-show="edit.companyName" class="editCtrl">
                                    <Input v-model="userinfo.currentCompanyName" style="width: 220px"></Input>
                                    <span class="editGroup">
                                        <Icon class="cancel" type="ios-close-outline" title="取消" @click="cancelEditCompanyName"></Icon>
                                        <Icon class="submit" type="ios-checkmark-outline" title="保存" @click="handleSaveCompanyName"></Icon>
                                    </span>
                                </div>
                            </dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业官网</dt>
                            <dd>
                                <span v-show="!edit.website">{{userinfo.website ? userinfo.website : '未填写'}}</span>
                                <span v-show="!edit.website" class="editButton" title="修改昵称" @click="edit.website = !edit.website"><Icon type="compose"></Icon></span>
                                <div v-show="edit.website" class="editCtrl">
                                    <Input v-model="userinfo.currentWebsite" style="width: 220px"></Input>
                                    <span class="editGroup">
                                        <Icon class="cancel" type="ios-close-outline" title="取消" @click="cancelEditWebsite"></Icon>
                                        <Icon class="submit" type="ios-checkmark-outline" title="保存" @click="handleSaveWebsite"></Icon>
                                    </span>
                                </div>
                            </dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业简介</dt>
                            <dd>
                                <span v-show="!edit.companyProfile">{{userinfo.companyProfile ? userinfo.companyProfile : '未填写'}}</span>
                                <span v-show="!edit.companyProfile" class="editButton" title="修改昵称" @click="edit.companyProfile = !edit.companyProfile"><Icon type="compose"></Icon></span>
                                <div v-show="edit.companyProfile" class="editCtrl">
                                    <Input v-model="userinfo.currentCompanyProfile" style="width: 360px"></Input>
                                    <span class="editGroup">
                                        <Icon class="cancel" type="ios-close-outline" title="取消" @click="cancelEditCompanyProfile"></Icon>
                                        <Icon class="submit" type="ios-checkmark-outline" title="保存" @click="handleSaveCompanyProfile"></Icon>
                                    </span>
                                </div>
                            </dd>
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
                            <Col span="16">您已绑定了手机 {{userinfo.phone | FormatPhone}} [您的手机为安全手机，可以找回密码，但不能用于登录]</Col>
                            <Col class="tar" span="4">                                
                                <span v-if="userinfo.phone">已设置</span>
                                <span v-else style="color: #333;">未设置</span> | <a @click="triggerModifyPhone">设置</a>
                            </Col>
                        </Row>
                        <Row class="safeSetting">
                            <Col class="text-blank" span="4">绑定邮箱</Col>
                            <Col span="16">绑定邮箱主要用于接收密保信息，保障账户安全。</Col>
                            <Col class="tar" span="4">
                                <span v-if="userinfo.email">{{userinfo.email}}</span>
                                <span v-else><span style="color: #333;">未设置</span> | <a @click="triggerBindMail">设置</a></span>
                            </Col>
                        </Row>
                        <Row class="safeSetting">
                            <Col class="text-blank" span="4">帐号密码</Col>
                            <Col span="16">安全性高的密码可以使帐号更安全。建议您定期更换密码，设置一个包含字母，符号或数字中至少两项且长度超过6位的密码。</Col>
                            <Col class="tar" span="4">已设置 | <a @click="triggerModifyPassword">修改</a></Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>

        <Modal
            v-model="isOpenAuthenticateModal"
            class-name="custom-modal vertical-center-modal"
            width="480">
            <Icon type="ios-close-empty" slot="close" @click="closeAuthenticateModal('AuthenticateForm')"></Icon>
            <h2 class="title" slot="header">身份验证</h2>
            <Alert type="warning" show-icon style="margin-bottom: 32px;">为了您的账号安全，进行敏感操作前须先验证身份。</Alert>
            <Form class="custom-form" :model="AuthenticateForm" ref="AuthenticateForm" :rules="AuthenticateForm.rule" label-position="left" :label-width="92">
                <FormItem label="验证方式">
                    <span class="text">手机验证</span>
                </FormItem>
                <FormItem label="绑定手机">
                    <span class="text">{{userinfo.phone}}</span>
                </FormItem>
                <FormItem class="sendCodeItem" label="短信验证码" prop="code">
                    <Input v-model.trim="AuthenticateForm.code" placeholder="请输入短信验证码"></Input>
                    <Button type="primary" size="large" @click.prevent="AuthenticateSendSMSCode" v-show="!AuthenticateForm.computedTime">发送验证码</Button>
                    <Button size="large" disabled v-show="AuthenticateForm.computedTime">{{AuthenticateForm.computedTime}}s后再次发送</Button>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeAuthenticateModal('AuthenticateForm')">取消</Button>
                <Button type="primary" size="large" @click.prevent="handleAuthenticate('AuthenticateForm')">提交</Button>
            </div>
        </Modal> <!-- 身份验证 -->

        <Modal
            v-model="isOpenModifyPhoneModal"
            class-name="custom-modal vertical-center-modal"
            width="480">
            <Icon type="ios-close-empty" slot="close" @click="closeModifyPhoneModal('ModifyPhoneForm')"></Icon>
            <h2 class="title" slot="header">修改绑定手机</h2>
            <Form class="custom-form" :model="ModifyPhoneForm" ref="ModifyPhoneForm" :rules="ModifyPhoneForm.rule" label-position="left" :label-width="92">
                <FormItem label="新绑定手机" prop="phone">
                    <Input v-model.trim="ModifyPhoneForm.phone" placeholder="新绑定手机"></Input>
                </FormItem>
                <FormItem class="sendCodeItem" label="短信验证码" prop="code">
                    <Input v-model.trim="ModifyPhoneForm.code" placeholder="请输入短信验证码"></Input>
                    <Button type="primary" size="large" @click.prevent="ModifyPhoneSendSMSCode('ModifyPhoneForm')" v-show="!ModifyPhoneForm.computedTime">发送验证码</Button>
                    <Button size="large" disabled v-show="ModifyPhoneForm.computedTime">{{ModifyPhoneForm.computedTime}}s后再次发送</Button>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeModifyPhoneModal('ModifyPhoneForm')">取消</Button>
                <Button type="primary" size="large" :loading="ModifyPhoneForm.loading" @click.prevent="handleModifyPhone('ModifyPhoneForm')">
                    <span v-if="!ModifyPhoneForm.loading">提交</span>
                    <span v-else>正在提交</span>
                </Button>
            </div>
        </Modal> <!-- 修改绑定手机 -->

        <Modal
            v-model="isOpenBindMailModal"
            class-name="custom-modal vertical-center-modal"
            width="480">
            <Icon type="ios-close-empty" slot="close" @click="closeBindMailModal('BindMailForm')"></Icon>
            <h2 class="title" slot="header">绑定邮箱</h2>
            <Alert type="warning" show-icon style="margin-bottom: 32px;">邮箱将作为您的邮箱登录信息，登录邮箱设置后不可更换。</Alert>
            <Form class="custom-form" :model="BindMailForm" ref="BindMailForm" :rules="BindMailForm.rule" label-position="left" :label-width="92">
                <FormItem label="邮箱" prop="mail">
                    <Input v-model.trim="BindMailForm.mail" placeholder="邮箱"></Input>
                </FormItem>
                <FormItem class="sendCodeItem" label="邮件验证码" prop="code">
                    <Input v-model.trim="BindMailForm.code" placeholder="请输入邮件验证码"></Input>
                    <Button type="primary" size="large" @click.prevent="BindMailSendSMSCode('BindMailForm')" v-show="!BindMailForm.computedTime">发送验证码</Button>
                    <Button size="large" disabled v-show="BindMailForm.computedTime">{{BindMailForm.computedTime}}s后再次发送</Button>
                    <div class="tips" v-show="BindMailForm.code.length == 0" style="clear:both;margin-top: 12px;">如果没有收到验证码邮件，请核实邮箱是否正常使用，并检查垃圾邮件。</div>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeBindMailModal('BindMailForm')">取消</Button>
                <Button type="primary" size="large" @click.prevent="handleBindMail('BindMailForm')">提交</Button>
            </div>
        </Modal> <!-- 绑定邮箱 -->

        <Modal
            v-model="isOpenModifyPasswordModal"
            class-name="custom-modal vertical-center-modal"
            width="480">
            <Icon type="ios-close-empty" slot="close" @click="closeModifyPasswordModal('ModifyPasswordForm')"></Icon>
            <h2 class="title" slot="header">修改密码</h2>
            <Form class="custom-form" :model="ModifyPasswordForm" ref="ModifyPasswordForm" :rules="ModifyPasswordForm.rule" label-position="left" :label-width="92">
                <FormItem label="旧密码" prop="oldpassword">
                    <Input type="password" v-model.trim="ModifyPasswordForm.oldpassword" placeholder="旧密码"></Input>
                </FormItem>
                <FormItem label="新密码" prop="password">
                    <Input type="password" v-model.trim="ModifyPasswordForm.password" placeholder="新密码"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="cpassword">
                    <Input type="password" v-model.trim="ModifyPasswordForm.cpassword" placeholder="确认密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeModifyPasswordModal('ModifyPasswordForm')">取消</Button>
                <Button type="primary" size="large" @click.prevent="handleModifyPassword('ModifyPasswordForm')">提交</Button>
            </div>
        </Modal> <!-- 修改密码 -->
    </div>
</template>

<script>
    import * as basicConfig from 'src/config/basicConfig'
    import * as tools from 'src/util/tools'

    import { ajaxPostUserinfo, ajaxPostChangePhone, ajaxPostChangeMail, ajaxPostChangePassword } from 'src/service/personal'

    export default {
        name: 'personal',
        data () {
            const customValidatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.ModifyPasswordForm.cpassword !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.ModifyPasswordForm.validateField('cpassword');
                    }
                    callback();
                }
            };
            const customValidatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ModifyPasswordForm.password) {
                    callback(new Error('两次密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                userinfo: {},
                edit: {
                    nickname: false,
                    gender: false,
                    birthday: false,
                    website: false,
                    companyName: false,
                    companyProfile: false,
                    industry: false
                },
                isOpenAuthenticateModal: false,
                AuthenticateForm: {
                    code: '',
                    computedTime: 0,
                    timer: null,
                    rule: {
                        code: [
                            { required: true, message: '请输入短信验证码', trigger: 'blur' }
                        ]
                    }
                },
                isOpenModifyPhoneModal: false,
                ModifyPhoneForm: {
                    phone: '',
                    code: '',
                    computedTime: 0,
                    timer: null,
                    loading: false,
                    rule: {
                        phone: [
                            { required: true, message: '请输入新手机号', trigger: 'blur' },
                            { pattern: /^((1[3-8][0-9])+\d{8})$/, message: '请填写正确的手机号码' }
                        ],
                        code: [
                            { required: true, message: '请输入短信验证码', trigger: 'blur' }
                        ]
                    }
                },
                isOpenBindMailModal: false,
                BindMailForm: {
                    mail: '',
                    code: '',
                    computedTime: 0,
                    timer: null,
                    rule: {
                        mail: [
                            { required: true, message: '请输入邮箱', trigger: 'blur' },
                            { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
                        ],
                        code: [
                            { required: true, message: '请输入邮件验证码', trigger: 'blur' }
                        ]
                    }
                },
                isOpenModifyPasswordModal: false,
                ModifyPasswordForm: {
                    oldpassword: '',
                    password: '',
                    cpassword: '',
                    rule: {
                        oldpassword: [
                            { required: true, message: '请输入旧密码', trigger: 'blur' }
                        ],
                        password: [
                            { required: true, validator: customValidatePass, trigger: 'blur' }
                        ],
                        cpassword: [
                            { required: true, validator: customValidatePassCheck, trigger: 'blur' }
                        ]
                    }
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
            },
            cancelEditWebsite() {
                this.userinfo.currentWebsite = this.userinfo.website;
                this.edit.website = false;
            },
            handleSaveWebsite() {
                this.userinfo.website = this.userinfo.currentWebsite;
                this.edit.website = false;
            },
            cancelEditCompanyName() {
                this.userinfo.currentCompanyName = this.userinfo.companyName;
                this.edit.companyName = false;
            },
            handleSaveCompanyName() {
                this.userinfo.companyName = this.userinfo.currentCompanyName;
                this.edit.companyName = false;
            },
            cancelEditCompanyProfile() {
                this.userinfo.currentCompanyProfile = this.userinfo.companyProfile;
                this.edit.companyProfile = false;
            },
            handleSaveCompanyProfile() {
                this.userinfo.companyProfile = this.userinfo.currentCompanyProfile;
                this.edit.companyProfile = false;
            },
            triggerModifyPhone(){
                // this.triggerAuthenticateModal();
                this.isOpenModifyPhoneModal = true;
            },
            closeModifyPhoneModal(name){
                this.$refs[name].resetFields();
                this.isOpenModifyPhoneModal = false;
                // clear timer
                this.ModifyPhoneForm.computedTime = 0;
                clearInterval(this.ModifyPhoneForm.timer);
            },
            handleModifyPhone(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        self.ModifyPhoneForm.loading = true;
                        let changeData = {
                            phone: self.ModifyPhoneForm.phone
                        }
                        ajaxPostChangePhone(changeData).then(res => {
                            if(res.state === 0){
                                self.userinfo.phone = self.ModifyPhoneForm.phone;
                                self.closeModifyPhoneModal(name);
                                self.$Message.success(res.message)
                            }else{
                                self.$Message.error(res.message)
                            }
                            self.ModifyPhoneForm.loading = false;
                        })
                    }
                })
            },
            ModifyPhoneSendSMSCode(name){
                let self = this;
                this.$refs[name].validateField('phone', (valid) => {
                    if(!!!valid) {
                        self.ModifyPhoneForm.computedTime = 120;
                        self.ModifyPhoneForm.timer = setInterval(() => {
                            self.ModifyPhoneForm.computedTime--;
                            if (self.ModifyPhoneForm.computedTime == 0) {
                                clearInterval(self.ModifyPhoneForm.timer);
                            }
                        }, 1000);

                        // TODO，发送手机验证码
                        self.$Message.success('短信发送成功');
                    }
                })
                
            },
            triggerBindMail(){
                // this.triggerAuthenticateModal();
                this.isOpenBindMailModal = true;
            },
            closeBindMailModal(name){
                this.$refs[name].resetFields();
                this.isOpenBindMailModal = false;
                // clear timer
                this.BindMailForm.computedTime = 0;
                clearInterval(this.BindMailForm.timer);
            },
            handleBindMail(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        let data = {
                            "email": self.BindMailForm.mail
                        }
                        ajaxPostChangeMail(data).then(res => {
                            if(res.state === 0){
                                self.closeBindMailModal(name);
                                self.$Message.success(res.message);
                            }else{
                                self.$Message.error(res.message);
                            }                            
                        })
                    }
                })
            },
            BindMailSendSMSCode(name){
                let self = this;
                this.$refs[name].validateField('mail', (valid) => {
                    console.log(name,valid)
                    if(!!!valid) {                     
                        self.BindMailForm.computedTime = 120;
                        self.BindMailForm.timer = setInterval(() => {
                            self.BindMailForm.computedTime--;
                            if (self.BindMailForm.computedTime == 0) {
                                clearInterval(self.BindMailForm.timer);
                            }
                        }, 1000);
                        // TODO，发送手机验证码
                        self.$Message.success('验证码发送到邮箱，请注意查收！');
                    }
                })
            },
            triggerModifyPassword(){
                // this.triggerAuthenticateModal();
                this.isOpenModifyPasswordModal = true;
            },
            closeModifyPasswordModal(name){
                this.$refs[name].resetFields();
                this.isOpenModifyPasswordModal = false;
                // clear timer
                this.ModifyPasswordForm.computedTime = 0;
                clearInterval(this.ModifyPasswordForm.timer);
            },
            handleModifyPassword(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    console.log(name,valid)
                    if(valid) {
                        let data = {
                            "oldPassword": self.ModifyPasswordForm.oldpassword,
                            "newPassword": self.ModifyPasswordForm.password
                        }
                        ajaxPostChangePassword(data).then(res => {
                            console.log(res)
                            if(res.state === 0){
                                self.closeModifyPasswordModal(name);
                                self.$Message.success(res.message);
                            }else{
                                self.$Message.error(res.message)
                            }
                        })
                    }
                })
            },
            triggerAuthenticateModal(){
                this.isOpenAuthenticateModal = true;
            },
            closeAuthenticateModal(name){
                this.$refs[name].resetFields();
                this.isOpenAuthenticateModal = false;
                // clear timer
                this.AuthenticateForm.computedTime = 0;
                clearInterval(this.AuthenticateForm.timer);
            },
            handleAuthenticate(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        // TODO，提升配额
                        self.$Message.success('操作成功！');
                        self.closeAuthenticateModal(name);
                    }
                })
            },
            closeAuthenticateModal(name){
                this.$refs[name].resetFields();
                this.isOpenAuthenticateModal = false;
                // clear timer
                this.AuthenticateForm.computedTime = 0;
                clearInterval(this.AuthenticateForm.timer);
            },
            handleAuthenticate(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        // TODO，提升配额
                        self.$Message.success('操作成功！');
                        self.closeAuthenticateModal(name);
                    }
                })
            },
            AuthenticateSendSMSCode(){
                let self = this;
                self.AuthenticateForm.computedTime = 120;
                self.AuthenticateForm.timer = setInterval(() => {
                    self.AuthenticateForm.computedTime--;
                    if (self.AuthenticateForm.computedTime == 0) {
                        clearInterval(self.AuthenticateForm.timer);
                    }
                }, 1000);

                // TODO,setSMS
                self.$Message.success('短信发送成功');
            },
            setUserInfo(){
                const self = this;
                ajaxPostUserinfo().then(res => {
                    if(res.state === 0){
                        let userResource = res.data.data;
                        self.userinfo = {
                            username: userResource.loginName,
                            nickname: userResource.staffName,
                            currentNickname : userResource.staffName,
                            gender: userResource.sex ? userResource.sex : 0, // 0，保密；1，男；2，女
                            currentGender: userResource.sex ? userResource.sex : 0,
                            birthday: userResource.birthday,
                            currentBirthday: userResource.birthday,
                            website: userResource.website,
                            currentWebsite: userResource.website,
                            companyName: userResource.companyName,
                            currentCompanyName:  userResource.companyName,
                            companyProfile: userResource.introduction,
                            currentCompanyProfile: userResource.introduction,
                            industry: '',
                            email: userResource.email,
                            phone: userResource.telephone
                        }
                    }
                }).catch(error =>{
                    self.$Message.error(error)
                })
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
        },
        created(){
            this.setUserInfo()
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