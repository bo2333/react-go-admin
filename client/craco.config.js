/* craco.config.js */
const CracoLessPlugin = require('craco-less');
const { loaderByName } = require('@craco/craco')
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const path = require("path");

// const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')

module.exports = {
    webpack: {
        alias: {
            '@@.': path.resolve(__dirname, '.'),
            '@.': path.resolve(__dirname, 'src'),
            '@.images': path.resolve(__dirname, 'src/images'),
            '@.router': path.resolve(__dirname, 'src/router'),
            '@.login': path.resolve(__dirname, 'src/login'),
            '@.frame': path.resolve(__dirname, 'src/frame'),
            '@.view': path.resolve(__dirname, 'src/view'),
            // 此处是一个示例，实际可根据各自需求配置
        },
        plugins: [
            // 查看打包的进度
            // new SimpleProgressWebpackPlugin()
        ]
    },
    babel: {//支持装饰器
        plugins: [
            // AntDesign 按需加载
            ['import', {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true // 设置为true即是less 这里用的是css 会影响皮肤
            }],
        ],
    },
    //配置craco提供的plugin
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { "@primary-color": "#5b8c00" },
                        javascriptEnabled: true,
                    },
                },
                cssLoaderOptions: {
                    modules: {
                        // 通过这个生成的 classname 结构如：ComponentName_className_hash:5
                        getLocalIdent: (context, localIdentName, localName, options) => {
                            if (context.resourcePath.includes("node_modules")) {
                                return localName;
                            }
                            return getCSSModuleLocalIdent(
                                context,
                                localIdentName,
                                localName,
                                options
                            );
                        },
                    },
                },
/*
                // 这个有问题，会影响皮肤
                modifyLessRule: (lessRule, context) => {
                    lessRule.test = /\.module\.less$/;
                    lessRule.exclude = /node_modules|antd\.css/;
                    return lessRule;
                },*/
            },
        },
    ],
    devServer: {
        proxy: {
            "/": {
                target: "http://192.168.99.211:8888",
                bypass: function(req, res, proxyOptions) {
                    if (req.headers.accept.indexOf("html") !== -1) {
                        console.log("Skipping proxy for browser request.");
                        return "/index.html";
                    }
                }
            },
        },
    },
}
