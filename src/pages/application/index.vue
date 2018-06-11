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
                            <dd>jun13008888</dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>性别</dt>
                            <dd>保密</dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>生日</dt>
                            <dd>未设置</dd>
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
                            <dd>未设置</dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业名称</dt>
                            <dd>国信达数据有限公司</dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业官网</dt>
                            <dd>www.baidu.com</dd>
                        </dl>
                        <dl class="basicInfo">
                            <dt>企业简介</dt>
                            <dd>企业简介企简介企业简介企业简介企业简介</dd>
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
                            <Col span="16">安全性高的密码可以使帐号更安全。建议您定期更换密码，设置一个包含字母，符号或数字中至少两项
且长度超过6位的密码。</Col>
                            <Col class="tar" span="4">已设置 | 修改</Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>


<style lang="less">
    .text-blank{
        color: #000;
    }
    .basicInfo{
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        line-height: 32px;
        display: flex;
        dt{
            color: #ccc;
            width: 68px;
            display: inline-block;
        }
        dd{
            flex: 1;
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