
import React, {useEffect, useState, memo, useRef} from 'react'
import {Navigate, redirect} from "react-router-dom";
import { Layout, Card, Form, Input, Button, Row, Col, Image, Divider,Typography   } from 'antd';
import 'antd/dist/antd.min.css';
import { LoginOutlined, UserOutlined, QrcodeOutlined, BarcodeOutlined, DatabaseOutlined } from '@ant-design/icons';
import axios from "axios";
import cookie from "react-cookies";
// import "./login.css"
import {COOKIE_KEYS} from "../cookieKeys";
import loginLess from './login.less'



function Login(props){
    const [stAuthCodeImage, setStAuthCodeImage] = useState("")
    const [stAuthCodeId, setStAuthCodeId] = useState("")
    const [stSubmit, setStSubmit] = useState(false)
    const [stSubmitSec, setStSubmitSec] = useState(0)
    const [stSonsId, setStSonsId] = useState(0)
    const { Content } = Layout;
    const formRef = useRef(null)
    // 刷新验证图片
    function refreshAuthCode(id, image) {
        if (stSonsId === 0) {
            setStAuthCodeId(id)
            setStAuthCodeImage(image)
            if (formRef && formRef.current) {
                formRef.current.setFieldsValue({authCodeId: id})
            }
        }
    }

    // 定时器
    function timerSubmit() {
        let step = 3000
        setStSubmit(true)
        let sec = step/1000
        setStSubmitSec(sec)
    }

    // 定时器控制按钮时间
    useEffect(() => {
        let id = 0
        if (stSubmitSec > 0) {
            id = setInterval(()=>{
                let v = stSubmitSec - 1
                setStSubmitSec(v);
                if (v <= 0) {
                    setStSubmit(false)
                }
            },1000)
        }
        return () => {
            if (id > 0) {
                clearInterval(id)
            }
        }
    }, [stSubmitSec])


    // 请求验证信息
    function handleCodeImage() {
        axios({
            method: 'get',
            url: '/auth-code',
        }).then((response) => {
            refreshAuthCode(response.data.msg.id, response.data.msg.image)
        }).catch(function (error) {
            console.log(error);
        });
    }

    // 提交成功
    function handleFinish(val) {
        delete val['authCodeImage']
        let formData = new FormData();
        for (const k in val) {
            formData.append(k, val[k]);
        }
        let cnf = {headers: { "Content-Type": "multipart/form-data" }}
        timerSubmit()

        axios.post('/login', formData, cnf).then((response) => {
            let data = response.data;
            if (data.err === 0 && data.msg && data.msg['sonsId']) {
                let sonsId = cookie.load(COOKIE_KEYS.sonsId)
                if (sonsId) {
                    setStSonsId(sonsId)
                    redirect("/home")
                }
            } else {
                refreshAuthCode(data.msg.id, data.msg.image)
            }
        }).catch(function (error) {
            console.log(error);
        });

    }

    // 提交失败
    function handleFinishFailed(errorInfo) {
        console.log('handleFinishFailed:登录失败');
        timerSubmit()
        handleCodeImage()
    }

    useEffect(() => {
        let sonsId = 0
        let t = cookie.load('sonsId')
        if ( t !== undefined && t !== null ) {
            sonsId = parseInt(t)
        }
        setStSonsId(sonsId)
        if (sonsId === 0) {
            handleCodeImage()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {
                stSonsId > 0 ? <Navigate to={'/'} replace={'true'} /> : (
                    <Layout className={loginLess.body}>
                        <Content className={loginLess.content}>
                            <Card className={loginLess.form}>
                                <Form
                                    name="formLogin"
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18}}
                                    onFinish={handleFinish}
                                    onFinishFailed={handleFinishFailed}
                                    autoComplete="off"
                                    size={"small"}
                                    layout={'horizontal'}
                                    ref={formRef}
                                >
                                    <Typography.Title level={1} type={'secondary'} strong={true} className={loginLess.title}> <DatabaseOutlined />管理中心</Typography.Title>
                                    <Divider />
                                    <Form.Item
                                        label={<Typography><UserOutlined /> user </Typography>}
                                        name="user"
                                        rules={[
                                            { required: true, message: 'Please input your username!' },
                                            { pattern:/^1[34578]\d{9}$/,message:"请输入正确手机" }
                                        ]}
                                        layout={"inline"}
                                    >
                                        <Input style={{backgroundColor:'transparent'}} />
                                    </Form.Item>


                                    <Form.Item
                                        label={<Typography><BarcodeOutlined /> pwd </Typography>}
                                        name="pwd"
                                        rules={[
                                            { required: true, message: 'Please input your password!' },
                                            { pattern:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=\w).{8,10}$/,message:"大小字母|数字|符号,长度:8-10" }
                                        ]}
                                    >
                                        <Input.Password style={{backgroundColor:'transparent'}} />
                                    </Form.Item>

                                    <Row justify={"end"}>
                                        <Col>
                                            <Form.Item name="authCodeId" hidden={true}>
                                                <Input
                                                    style={{backgroundColor:'transparent'}}
                                                    name="authCodeId"
                                                    id="authCodeId"
                                                    value={stAuthCodeId}
                                                    onChange={(e) => {setStAuthCodeId(e.target.value)}}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item name="authCodeImage">
                                                <Image width={195} height={50} preview={false} onClick={handleCodeImage} src={stAuthCodeImage}>
                                                </Image >
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        label={<Typography><QrcodeOutlined/> code </Typography>}
                                        name="authCodeVal"
                                        rules={[{ required: true, message: 'Please input your username!' }]}
                                        layout={"inline"}
                                    >
                                        <Input style={{backgroundColor:'transparent'}} />
                                    </Form.Item>

                                    <Row justify={"end"}>
                                        <Col>
                                            <Form.Item >
                                                <Button type="primary" htmlType="submit" icon={<LoginOutlined />} disabled={stSubmit}>
                                                    登录 { stSubmitSec > 0? stSubmitSec + " 秒" : "" }
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Content>
                    </Layout>
                )
            }
        </>
    )
}

export default memo(Login)

/*
style={{backgroundImage:`url(${Background})`}}
props.stSonsId !== 0 ? (<RouteTable></RouteTable>) :
 */