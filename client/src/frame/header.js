
import React, {useState} from 'react'
import cookie from "react-cookies";
import {COOKIE_KEYS} from "@./cookieKeys";
import {
    UserOutlined,
    GlobalOutlined,
    CodepenOutlined,
    LogoutOutlined,
    HomeOutlined,
    ApartmentOutlined,
    LineChartOutlined,
    BugOutlined,
    GoogleOutlined,
    TeamOutlined
} from "@ant-design/icons";
import {Button, Popconfirm, Col, notification, Divider, Row} from 'antd';
import {useNavigate} from "react-router-dom";
import {RIGHT_TEAM_INFO} from "@.router/rights";
import {NotificationPlacement} from "antd/es/notification";
import thx from './theme.less'

// 读取权限信息
function GetUserAccessInfo(access, host) {
    let rows = []
    for (const idx in RIGHT_TEAM_INFO) {
        let col = []
        let info = RIGHT_TEAM_INFO[idx]
        let has = false
        for (const bitKey in info.bits) {
            if (((1 << bitKey) & access) === 0) {
                break
            }
            let color = info.bits[bitKey] === "可读" ? "#f47920":
                        info.bits[bitKey] === "可写" ? "#8552a1":
                        info.bits[bitKey] === "管控" ? "#ed1941":
                        info.bits[bitKey] === "审核" ? "#f15a22":
                        info.bits[bitKey] === "前端" ? "#009ad6":
                                                        "#1b315e"
            col.push(
                <span style={{ fontSize: '12px',  color: color }} key={idx + bitKey}>
                    {info.bits[bitKey]}<span style={{ fontSize: '12px', fontWeight: 'bolder', color: '#fff' }}>▪</span>
                </span>
            )
            has = true
        }
        if (has) {
            rows.push(
                <div key={idx}>
                    <Row>
                        <Col>
                            {
                                idx === "0" ? <HomeOutlined style={{ fontSize: '16px', color: '#1d953f' }}/> :
                                    idx === "1" ? <ApartmentOutlined style={{ fontSize: '16px', color: '#007d65' }}/>:
                                        idx === "2" ? <LineChartOutlined style={{ fontSize: '16px', color: '#f26522' }}/>:
                                            idx === "3" ? <BugOutlined style={{ fontSize: '16px', color: '#aa2116' }}/>:
                                                idx === "4" ? <GoogleOutlined style={{ fontSize: '16px', color: '#08c' }}/>:
                                                    <TeamOutlined style={{ fontSize: '16px', color: '#ffd400' }}/>
                            }
                            <span style={{ fontSize: '14px', fontWeight: 'bolder', color: '#fff' }}>▪</span><span style={{ fontSize: '14px', fontWeight: 'bolder', color: '#1d953f' }}>{info.name}:　</span>
                        </Col>
                        <Col>
                            {col.map((item) => (
                                item
                            )) }
                        </Col>
                    </Row>
                </div>
            )
        }
    }
    rows.push(
        <div key={"ipAccessShow"}>
            <Divider />
            <GlobalOutlined style={{ fontSize: '20px', color: '#bed742'}}/>
            <span style={{ fontSize: '14px', color: '#1d953f'}}>  {cookie.load(COOKIE_KEYS.userHost)} </span>
        </div>
    )
    return rows
}


export default function FrameHeader(props) {
    const navigate = useNavigate();
    const [stUserName, setUserName] = useState(cookie.load(COOKIE_KEYS.userName))
    const [stUserHost, setUserHost] = useState(cookie.load(COOKIE_KEYS.userHost))
    const [stUserAccess, setUserAccess] = useState(cookie.load(COOKIE_KEYS.access))
    const [stUserAccessInfo] = useState(GetUserAccessInfo(cookie.load(COOKIE_KEYS.access)))
    const [api, contextHolder] = notification.useNotification();

    // 这里要做处理
    const onShowAccess = (placement: NotificationPlacement) => {
        api.info({
            message: <span style={{fontSize: '18px', fontWeight: 'bolder', color:'#1890ff'}}>用户权限</span>,
            description: stUserAccessInfo,
            onClick: () => {
                console.log("用户权限值:", stUserAccess, props, placement);
            },
            placement,
            style:{opacity: 0.9, borderRadius: 8}
        });
    }

    // 退出
    const onExit = () => {
        cookie.remove(COOKIE_KEYS.sonsId)
        cookie.remove(COOKIE_KEYS.access)
        cookie.remove(COOKIE_KEYS.userName)
        cookie.remove(COOKIE_KEYS.userHost)
        setUserName("")
        setUserHost("")
        setUserAccess(0)
        navigate('/login')
    }


    return (
        <>
            {contextHolder}
            <Col flex={2}>
                <UserOutlined className={thx.icon}/>
                <span className={thx.label}>  {stUserName} </span>
            </Col>
            <Col flex={2} xs={0} sm={14} md={14} lg={14} xl={14}>
                <GlobalOutlined className={thx.icon}/>
                <span className={thx.label}>  {stUserHost} </span>
            </Col>
            <Col flex={2}>
                <Button
                    type="link"
                    icon={<CodepenOutlined className={thx.icon}/>}
                    onClick={() => onShowAccess('top')}
                >
                <span className={thx.button}> 权限 </span>
                </Button>
            </Col>
            <Col flex={"auto"} ></Col>
            <Col flex={1}>
                <div >
                    <Popconfirm
                        title="退出？"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={onExit}
                    >
                        <Button
                            type="link"
                            icon={<LogoutOutlined className={thx.exitIcon}/>}
                        />
                    </Popconfirm>
                </div>
            </Col>
        </>
    )
}