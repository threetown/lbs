<template>
    <div>
        <Row :gutter="16" class="mb-12">
            <Col span="12">
                <Row type="flex" justify="space-between" class="countPanel">
                    <Col>
                        <div class="dataPanel type-wait">
                            <Icon type="ios-speedometer-outline"></Icon>
                            <div class="data">
                                <div class="num">88</div>
                                <div class="tips">待处理业务</div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div class="dataPanel type-error">
                            <Icon type="ios-information-outline"></Icon>
                            <div class="data">
                                <div class="num">88</div>
                                <div class="tips">异常服务</div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div class="dataPanel type-warning">
                            <Icon type="flash-off"></Icon>
                            <div class="data">
                                <div class="num">88</div>
                                <div class="tips">预警业务</div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div class="dataPanel type-error">
                            <Icon type="ios-person"></Icon>
                            <div class="data">
                                <div class="num">88</div>
                                <div class="tips">异常用户</div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <ul class="todayData">
                    <li>
                        今日访问次数-PV
                        <span class="num">26388</span>
                        <span class="info">昨日同比 ↑ 1%</span>
                    </li>
                    <li>
                        今日访问用户-UV
                        <span class="num">13938</span>
                        <span class="info">昨日同比 ↑ 1%</span>
                    </li>
                    <li>
                        昨日新增用户
                        <span class="num">26388</span>
                        <span class="info">昨日同比 ↑ 1%</span>
                    </li>
                </ul>
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
                    </div>
                </div>
            </Col>
        </Row>
        <div class="full-echart-panel">
            <div class="header">
                <h2 class="title">业务分析 <strong>每日业务总量分析</strong></h2>
            </div>
            <div class="content">
                暂无数据
            </div>
        </div>
    </div>
</template>


<style lang="less">
    ul,li{
        list-style: none;
    }
    .mb-12{
        margin-bottom: 12px;
    }
    .countPanel{
        margin-bottom: 12px;
        .ivu-col{
            background: #fff;
            width: 23%;
        }
    }
    .dataPanel{
        position: relative;
        height: 92px;
        padding: 22px 5px 22px 48px;
        i{
            position: absolute;
            left: 10px;
            top: 28px;
            font-size: 24px;
            line-height: 28px;
            width: 28px;
            height: 28px;
            text-align: center;
            border-radius: 50%;
            background-color: #D6F2FF;
            color: #00A0EB;
        }
        .data{
            .num{
                font-size: 20px;
                line-height: 24px;
                font-family: 'MicrosoftYaHei';
                font-weight: bold;
                color: #333;
            }
            .tips{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        &.type-warning{
            i{
                color: #FF6C00;
                background-color: #FFE5CC;
            }
        }
        &.type-error{
            i{
                color: #F71A1A;
                background-color: #FFDFDF;
            }
            
        }
    }
    .todayData{
        background-color: #fff;
        overflow: hidden;
        height: 120px;
        padding: 22px;
        text-align: center;
        li{
            position: relative;
            width: 33.33%;
            float: left;
            height: 76px;
            &::before{
                position: absolute;
                content: '';
                right: 0;
                top: 50%;
                margin-top: -27px;
                width: 1px;
                height: 54px;
                background-color: #E5E5E5;
            }
            &:last-child::before{
                display: none;
            }
            .num{
                font-size: 26px;
                color: #008AFF;
                display: block;
                line-height: 34px;
            }
            .info{
                font-size: 14px;
                color: #999;
            }
        }
    }

    .full-echart-panel{
        padding: 20px;
        background-color: #fff;
        .header{
            font-family: MicrosoftYaHei;
            .title{
                font-size:16px;
                color:#333;
                line-height:24px;
                strong{
                    font-weight: normal;
                    font-size: 14px;
                    color: #999;
                    display: block;
                }
            }
        }
        .content{
            text-align: center;
            font-size: 16px;
            color: #666;
            height: 266px;
            line-height: 266px;
        }
    }
</style>