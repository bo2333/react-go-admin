package account

import (
	"game_manage/modules/db"
	"time"
)

//
// 需要数据库 account_log
//

const eOpLogin = 0     // 用户登录 P0[0.正常登录 1.登录失败]
const eOpUserAdd = 1   // 添加用户
const eOpUserBind = 2  // 禁用用户
const eOpUserRight = 3 // 修改权限

// SAdminLog
//
//	@Description: 日志保存结构
type SAdminLog struct {
	Lid uint64 `gorm:"primary_key;auto_increment" json:"lid"`
	Aid uint64 `gorm:"size:11;comment:'account Aid'" json:"aid"`
	Op  uint32 `gorm:"size:11;comment:'分类对应 eOpLog '" json:"op"`
	P0  uint64 `gorm:"size:20;comment:'附加参数'" json:"p0"`
	P1  uint64 `gorm:"size:20;comment:'附加参数'" json:"p1"`
	P2  int64  `gorm:"size:20;comment:'附加参数'" json:"p2"`
	P3  string `gorm:"size:11;comment:'附加参数'" json:"p3"`
	Ctm int64  `gorm:"size:20;comment:'创建时间'" json:"ctm"`
}

// TableName 为 SAdminLog 绑定表名
func (SAdminLog) TableName() string {
	return "account_log"
}

// AdminAddLog
//
//	@Description: 添加管理日志
//	@param aid	帐户id
//	@param op	操作分类
//	@param p0	参数0
//	@param p1	参数1
//	@param p2	参数2
//	@param p3	参数3
func AdminAddLog(aid uint64, op uint32, p0 uint64, p1 uint64, p2 int64, p3 string) {
	log := SAdminLog{}
	log.Aid = aid
	log.Op = op
	log.P0 = p0
	log.P1 = p1
	log.P2 = p2
	log.P3 = p3
	log.Ctm = time.Now().Unix()
	db.Mysql.Create(&log)
}
