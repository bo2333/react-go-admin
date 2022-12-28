import React, {memo, useEffect, useState} from 'react'
import 'antd/dist/antd.min.css';
import {Layout, Row} from 'antd';
import FrameSidebar from "./sidebar"
import FrameFooter from "./footer"
import FrameHeader from "./header";
import {Outlet} from "react-router-dom";
import thx from './theme.less'

function Frame(props) {
    const { Header, Content, Footer } = Layout;
    const [breadVal, setBreadVal] = useState('/home')
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Layout className={thx.frame} >
            <Layout className={thx.body}>
                <FrameSidebar setBreadVal={setBreadVal}/>
                <Layout >
                    <Header className={thx.header}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} wrap={false}>
                            <FrameHeader breadVal={breadVal}/>
                        </Row>
                    </Header>
                    <Layout>
                        <Content className={thx.content}>
                            <Outlet />
                        </Content>
                    </Layout>
                    <Footer className={`footer`}>
                        <FrameFooter/>
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default memo(Frame) //