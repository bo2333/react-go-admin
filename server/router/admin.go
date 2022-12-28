package router

import (
	"game_manage/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func loadViews(router *gin.Engine, htmlDir string) {
	var files []string
	filepath.Walk(htmlDir, func(path string, info os.FileInfo, err error) error {
		if strings.HasSuffix(path, ".html") {
			files = append(files, path)
		}
		return nil
	})

	router.LoadHTMLFiles(files...)
}

func Route() *gin.Engine {
	router := gin.Default()
	router.Delims("{[", "]}")
	// 自定义请求头中设置的用户的真实Ip地址
	router.TrustedPlatform = "Client-IP"
	// 如果没有找到的页面，返回主页，解决前端404
	// router.NoRoute((&controller.IndexRes{}).ViewIndex())
	router.NoRoute((&controller.IndexRes{}).ViewIndex())

	loadViews(router, "./view")
	router.StaticFS("/static", http.Dir("./view/static"))
	router.StaticFile("/favicon.ico", "./view/favicon.ico")
	router.StaticFile("/robots.txt", "./view/robots.txt")
	router.StaticFile("/manifest.json", "./view/manifest.json")

	router.GET("/", (&controller.IndexRes{}).ViewIndex())
	router.POST("/login", (&controller.IndexRes{}).Login())
	router.GET("/auth-code", (&controller.IndexRes{}).AuthCode())
	/*******登录路由**********/
	// gActionLog.Use( middleware.Session())
	// gActionLog.GET("", middleware.Access(account.AccountManage|account.AccountRead), (&account.ActionLogRes{}).Index())
	{
		//
	}

	return router
}
