package db

// mysql
import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Mysql *gorm.DB

func InitMysql(host string, userName string, password string, database string, maxOpenConn int, maxIdleConn int) {
	var err error
	dns := fmt.Sprintf("%s:%s@(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", userName, password, host, database)
	Mysql, err = gorm.Open(mysql.Open(dns), &gorm.Config{})
	if err != nil {
		fmt.Println(err)
	}
	sqlDb, _ := Mysql.DB()
	sqlDb.SetMaxOpenConns(maxOpenConn)
	sqlDb.SetMaxIdleConns(maxIdleConn)
	/**
		 禁用表名复数>
		 !!!如不禁用则会出现表 y结尾边ies的问题
		 !!!如果只是部分表需要使用源表名，请在实体类中声明TableName的构造函数
	     ```
	         func (实体名) TableName() string {
	             return "数据库表名"
	         }
	     ```
	*/

	//注册回调函数
	RegisterCallback()
}

func RegisterCallback() {
	//注册创建数据回调
	Mysql.Callback().Create().After("gorm:create").Register("my_plugin:after_create", func(db *gorm.DB) {
		str := fmt.Sprintf("sql语句：%s 参数：%s", db.Statement.SQL.String(), db.Statement.Vars)
		fmt.Println(str)
	})
	//TODO 注册删除数据回调

	//TODO 注册更新数据回调
}

// Version 取出db版本
func Version() string {
	type version struct {
		V string `gorm:"size:64;comment:'版本'"`
	}

	var ver version
	err := Mysql.Raw("select version() as v;").First(&ver).Error
	if err == nil {
		return ver.V
	}
	return ""
}
