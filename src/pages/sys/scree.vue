<template>
    <div>
        <Row :gutter="28" class="mb-24">
            <Col span="12">
                <Row class="countPanel">
                    <Col span="6">Col</Col>
                    <Col span="6">Col</Col>
                    <Col span="6">Col</Col>
                    <Col span="6">Col</Col>
                </Row>
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
    </div>
</template>


<style lang="less">
    .countPanel{
        .ivu-col{
            background: #fff;
        }
    }
</style>