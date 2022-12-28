import React, {memo, useState, useEffect} from "react";
import {Col, Layout, Menu, Row} from 'antd';
import {useNavigate} from 'react-router-dom';
import {routes} from "@.router/list";
import {DatabaseOutlined} from "@ant-design/icons";
import cookie from "react-cookies";
import {COOKIE_KEYS} from "../cookieKeys";
import {RequireRight} from "@.router/auth";
import thx from './theme.less'

const getMenus = (m) => {
    let mes = []
    let access = cookie.load(COOKIE_KEYS.access)
    for (let index in m) {
        let rInfo = m[index]
        if (RequireRight(rInfo.need.right , access)) {
            let tmp = {}
            if (rInfo.menuFlag && rInfo.menuFlag > 0) {
                if (m[index].menuFlag === 1) {
                    let sub = getMenus(rInfo.children)
                    for (const subKey in sub) {
                        mes.push(sub[subKey])
                    }
                } else {
                    for(const k in rInfo) {
                        if (k === 'path' || k === 'label' || k === 'icon' || k === 'element' || k === 'children') {
                            if (k === 'path') {
                                tmp.key = rInfo[k]
                            } else {
                                if (k === 'children') {
                                    if (rInfo.menuFlag === 2) {
                                        tmp[k] = getMenus(rInfo[k])
                                    }
                                } else {
                                    tmp[k] = rInfo[k]
                                }
                            }
                        }
                    }
                    mes.push(tmp)
                }
            }
        }
    }
    return mes
}

function FrameSidebar(props) {
    const { Sider } = Layout;
    const navigate = useNavigate()
    const [stRoutes] = useState(getMenus(routes))

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const onClick =  (e) => {
        navigate(e.key, {k:e.key})
        props.setBreadVal(e.key)
    }

    return (
        <Sider
            trigger={null}
            breakpoint="md"
            style={{ overflowY: 'auto' }}
            /*theme="light"*/
            className={thx.sidebar}
        >
            <div className={thx.logo}>
                <Row>
                    <Col flex={1}>
                        <DatabaseOutlined  />
                    </Col>
                    <Col flex={8} xs={0} sm={0} md={16}  >
                        <span>管理中心</span>
                    </Col>
                </Row>

            </div>
            <Menu mode="inline"
                theme="dark"
                items={stRoutes}
                onClick={onClick}
                className = {thx.menu}
            />
        </Sider>
    )
}


export default memo(FrameSidebar)