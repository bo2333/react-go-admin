import React, {lazy} from "react";
import {RIGHTS} from "./rights";
import {
    HomeOutlined,
    GoogleOutlined,
    DatabaseOutlined,
    LineChartOutlined,
    ApartmentOutlined,
    TeamOutlined,
    BugOutlined,
    HourglassOutlined,
    InsertRowAboveOutlined,
    RedditOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import { LazyComponent } from './router';
import ErrorRoute from "./error";
import {RequireAuth} from "./auth";
import thx from '../frame/theme.less'

export const icp = '粤 xxxxxxxxx'
export const organizer = 'xdd'

export const friends = [
    {
        name: 'abc',
        href:'https://xxx.xxx.com'
    },
    {
        name: 'ooo',
        href:'https://xxx.xxx.com'
    },
    {
        name: 'psd',
        href:'https://xxx.xxx.com'
    },
]


// routes
//  @path: 定义路由的路径
//  @component: 需要展示页面路径
//  @name: 本个路由的名字
//  @lazy: 这个路由是否懒加载
//  @children: 子项
//  @menuFlag 0.不是菜单项 1.有菜单(但不读取本项,向下取) 2.有菜单(读取本项并向下取) 3.有菜单(不向下取菜单)
//  @right: 权限 【对应部门】
//
export const routes = [
    {
        path: '/',
        label: "主页",
        need: { login: true, right: RIGHTS.NONE },
        menuFlag: 1,
        loader: async () => { return RequireAuth(true, 0) },
        element: <LazyComponent lazyChildren={lazy(() => import('../frame/frame'))} />,
        errorElement: <ErrorRoute />,
        children: [
            {
                path: '/home',
                label: <span className={thx.label}>主页</span>,
                icon: <HomeOutlined className={`${thx.icon} ${thx.iconHome}`}/>,
                need: { login: true, right: RIGHTS.ACCOUNT_ALL},
                element: <LazyComponent lazyChildren={lazy(() => import('@.view/home/account/account'))} />,
                loader: async () => { return RequireAuth(true, RIGHTS.ACCOUNT_ALL) },
                // loader: async () => { return redirect("/login") },
                menuFlag: 2,
                errorElement: <ErrorRoute />,
                children: [
                    {
                        path: '/home/account',
                        label: <span className={thx.childrenLabel}>帐号管理</span>,
                        icon: <DatabaseOutlined className={thx.childrenLabel}/>,
                        need: { login: true, right: RIGHTS.ACCOUNT_ALL },
                        menuFlag: 3,
                        loader: async () => { return RequireAuth(true, 0) },
                        errorElement: <ErrorRoute />,
                        element: <LazyComponent lazyChildren={lazy(() => import('@.view/home/account/account'))} />
                    }
                ]
            },
            // ------------------------------------------------------------------------------------------------------------
            {
                path: '/dev-ops',
                label: <span className={thx.label}>运维</span>,
                icon: <ApartmentOutlined className={`${thx.icon} ${thx.iconDevOps}`} />,
                need: { login: true, right: RIGHTS.DEV_OPS_ALL },
                // element: lazy(() => import('../view/servers')),
                menuFlag: 2,
                errorElement: <ErrorRoute />,
                children: [
                    {
                        path: '/dev-ops/servers',
                        label: <span className={thx.childrenLabel}>服务器组</span>,
                        menuFlag: 3,
                        icon: <DatabaseOutlined className={thx.childrenLabel}/>,
                        need: { login: true, right: RIGHTS.DEV_OPS_ALL },
                        loader: async () => { return RequireAuth(true, RIGHTS.DEV_OPS_ALL) },
                        errorElement: <ErrorRoute />,
                        element: <LazyComponent lazyChildren={lazy(() => import('../view/dev-ops/servers'))} />
                    }
                ]
            },
            // ------------------------------------------------------------------------------------------------------------
            {
                path: '/operate',
                label: <span className={thx.label}>运营</span>,
                menuFlag: 2,
                icon: <LineChartOutlined className={`${thx.icon} ${thx.iconDevOps}`} />,
                need: { login: true, right: RIGHTS.OPERATE_ALL },
                // element: lazy(() => import('../view/servers')),
                errorElement: <ErrorRoute />,
                children: [
                    {
                        path: '/operate/servers',
                        label: <span className={thx.childrenLabel}>消费</span>,
                        menuFlag: 3,
                        icon: <ShoppingCartOutlined className={thx.childrenLabel}/>,
                        need: { login: true, right: RIGHTS.OPERATE_ALL },
                        loader: async () => { return RequireAuth(true, RIGHTS.OPERATE_ALL) },
                        errorElement: <ErrorRoute />,
                        element: <LazyComponent lazyChildren={lazy(() => import('../view/operate/consumption'))} />
                    }
                ]
            },
            {
                path: '/develop',
                label: <span className={thx.label}>研发</span>,
                menuFlag: 2,
                icon: <RedditOutlined className={`${thx.icon} ${thx.iconDevelop}`} />,
                need: { login: true, right:RIGHTS.DEVELOP_ALL },
                errorElement: <ErrorRoute />,
                children: [
                    {
                        path: '/develop/client-bug',
                        label: <span className={thx.childrenLabel}>前端-bug</span>,
                        menuFlag: 3,
                        icon: <BugOutlined className={thx.childrenLabel}/>,
                        need: { login: true, right: RIGHTS.DEVELOP_ALL },
                        loader: async () => { return RequireAuth(true, 0) },
                        errorElement: <ErrorRoute />,
                        element: <LazyComponent lazyChildren={lazy(() => import('@.view/develop/client/bug'))} />
                    },
                    {
                        path: '/develop/server-bug',
                        label: <span className={thx.childrenLabel}>后端-bug</span>,
                        menuFlag: 3,
                        icon: <BugOutlined className={thx.childrenLabel}/>,
                        need: { login: true, right: RIGHTS.DEVELOP_ALL },
                        loader: async () => { return RequireAuth(true, 0) },
                        errorElement: <ErrorRoute />,
                        element: <LazyComponent lazyChildren={lazy(() => import('@.view/develop/server/bug'))} />
                    }
                ]
            },
            // ------------------------------------------------------------------------------------------------------------
            {
                path: '/game-manager',
                label: <span className={thx.label}>GM</span>,
                menuFlag: 2,
                icon: <GoogleOutlined className={`${thx.icon} ${thx.iconGameManager}`} />,
                need: { login: true, right: RIGHTS.GAME_MANAGER_ALL },
                // element: lazy(() => import('../view/servers')),
                errorElement: <ErrorRoute />,
                children: [
                    {
                        path: '/game-manager/activity',
                        label: <span className={thx.childrenLabel}>活动</span>,
                        menuFlag: 3,
                        icon: <HourglassOutlined className={thx.childrenLabel}/>,
                        need: { login: true, right: RIGHTS.GAME_MANAGER_ALL },
                        loader: async () => { return RequireAuth(true, RIGHTS.GAME_MANAGER_ALL) },
                        errorElement: <ErrorRoute />,
                        element: <LazyComponent lazyChildren={lazy(() => import('../view/game-manager/activity'))} />,
                    }
                ]
            },
            // ------------------------------------------------------------------------------------------------------------
            {
                path: '/customer-service',
                label: <span className={thx.label}>客服</span>,
                menuFlag: 2,
                icon: <TeamOutlined className={`${thx.icon} ${thx.iconCustomerService}`} />,
                need: { login: true, right: RIGHTS.CUSTOMER_SERVICE_ALL },
                errorElement: <ErrorRoute />,
                children: [
                    {
                        path: '/customer-service/log',
                        label: <span className={thx.childrenLabel}>玩家日志</span>,
                        menuFlag: 3,
                        icon: <InsertRowAboveOutlined className={thx.childrenLabel}/>,
                        need: { login: true, right: RIGHTS.CUSTOMER_SERVICE_ALL },
                        loader: async () => { return RequireAuth(true, RIGHTS.CUSTOMER_SERVICE_ALL) },
                        errorElement: <ErrorRoute />,
                        element: <LazyComponent lazyChildren={lazy(() => import('../view/customer-service/log'))} />,
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        label: "登录",
        menuFlag: 0,
        need: { login: false, right: RIGHTS.NONE },
        element: <LazyComponent lazyChildren={lazy(() => import('../login/login'))} />,
        errorElement: <ErrorRoute />,
        children: []
    },
    {
        path: '*',
        label: "404",
        menuFlag: 0,
        need: { login: true, right: RIGHTS.NONE },
        right:0,
        element: <LazyComponent lazyChildren={lazy(() => import('@.view/home/account/account'))} />,
        errorElement: <ErrorRoute />,
        children: []
    },
]