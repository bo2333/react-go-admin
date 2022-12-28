package config

import (
	"fmt"
	"gopkg.in/ini.v1"
)

type SIni struct {
	SMysql `ini:"mysql"`
	SBase  `ini:"base"`
	SLimit `ini:"limit"`
}

type SMysql struct {
	Host        string `ini:"host"`
	Port        string `ini:"port"`
	UserName    string `ini:"username"`
	Password    string `ini:"password"`
	Database    string `ini:"database"`
	MaxOpenConn int    `ini:"max_open_conn"`
	MaxIdleConn int    `ini:"max_idle_conn"`
}

type SBase struct {
	Port     string `ini:"port"`
	Host     string `ini:"host"`
	PwdSalt  string `ini:"pwd_salt"`
	SonsSalt string `ini:"sessions_salt"`
	SonsSec  int64  `ini:"sessions_sec"`
}
type SLimit struct {
	SecR  float64 `ini:"sec_r"`
	SecB  int     `ini:"sec_b"`
	GetR  float64 `ini:"get_r"`
	GetB  int     `ini:"get_b"`
	PostR float64 `ini:"post_r"`
	PostB int     `ini:"post_b"`
}

var Ini = new(SIni)

// ReadConf 初始化配置文件
func ReadConf(workDir string) {
	err := ini.MapTo(Ini, workDir+"/config/app.ini")
	if err != nil {
		fmt.Printf("load ini err:%v", err)
	}
}
