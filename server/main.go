package main

import (
	"context"
	"flag"
	"fmt"
	"game_manage/config"
	"game_manage/modules/db"
	"game_manage/router"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"time"
)

var workDir string

func getWorkDir() {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	workDir = filepath.Dir(ex)
	fmt.Println("Executable path :" + workDir)
	realPath, err := filepath.EvalSymlinks(workDir)
	if err != nil {
		panic(err)
	}
	fmt.Println("Symlink evaluated:" + realPath)
}

func main() {

	fmt.Printf("s:%d \n", time.Now().Unix())
	var d = flag.String("d", "", "string类型参数")
	flag.Parse()
	if *d != "" {
		os.Chdir(*d)
		workDir = string(*d)
	} else {
		getWorkDir()
	}
	log.Printf("*********** workDir: %s *************\n", workDir)

	// 获取工作目录
	config.ReadConf(workDir) // 读取配置
	db.InitMysql(
		config.Ini.SMysql.Host,
		config.Ini.SMysql.UserName,
		config.Ini.SMysql.Password,
		config.Ini.SMysql.Database,
		config.Ini.SMysql.MaxOpenConn,
		config.Ini.SMysql.MaxIdleConn,
	)
	rMain := router.Route()
	if rMain == nil {
		os.Exit(0)
	}
	url := config.Ini.SBase.Host + ":" + config.Ini.SBase.Port
	log.Println(url)
	srv := &http.Server{
		Addr:           url,
		Handler:        rMain,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit

	log.Println("exit ...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("exit error:", err)
	}
	log.Println("exiting")
}
