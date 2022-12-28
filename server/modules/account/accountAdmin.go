package account

//
// 需要数据库 account account_log
//

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"game_manage/modules/db"
	"game_manage/modules/sessions"
	"time"
)

// SAdmin 后台管理帐号结构
type SAdmin struct {
	SAdvanced
}

var Names = map[uint32]string{
	0: "帐号查询",
}

// TableName 为SAdmin 绑定表名
func (SAdmin) TableName() string {
	return "account"
}

// encryption
//
//	@Description: 加密密码方法
//	@param acct	帐户
//	@param pwd	密码
//	@param salt 附加值
//	@return string 加密后的字符串
func encryption(acct string, pwd string, salt string) string {
	str := fmt.Sprintf("%s%s%s", acct, pwd, salt)
	h := md5.New()
	h.Write([]byte(str))
	return hex.EncodeToString(h.Sum(nil))
}

func (ret *SAdmin) Add(aid uint32, info *SAdmin) int64 {
	adminInfo := SBase{}
	db.Mysql.Where("id = ?", aid).Take(&adminInfo)
	if adminInfo.Aid == 0 {
		return -1
	}

	if info.Aid != 0 /* 新增 */ {
		return -2
	}

	user := SAdmin{}
	if err := db.Mysql.Where("acct = ?", info.Acct).Take(&user).Error; err != nil {
		return -3
	}

	if user.Aid != 0 /* 新增 */ {
		return -4
	}

	if err := db.Mysql.Create(&info).Error; err != nil {
		return -5
	}

	return int64(info.Aid)
}

func (ret *SAdmin) Login(host string, port int32, acct string, pwd string, salt string, sonsSalt string, sonsSec int64) (int64, string) {
	if err := db.Mysql.Where("acct = ?", acct).Take(ret).Error; err != nil {
		return -1, "帐号不存在"
	}

	// 检查是否能登录
	nextTm := LoginCheck(ret.Aid)
	if nextTm != 0 {
		return nextTm, "密码错误"
	}
	pwdSalt := encryption(acct, pwd, salt)
	if pwdSalt != ret.Pwd {
		AdminAddLog(ret.Aid, eOpLogin, 1, 0, 0, host)
		LoginError(ret.Aid)
		return -2, "未到允许登录时间"
	}
	// 如果存在就清理再登录
	if sessions.In(ret.Aid) {
		sessions.Clear(ret.Aid, true)
	}

	// 更新登录记录
	ret.Host = host
	ret.Ltm = time.Now().Unix()
	db.Mysql.Save(&ret)

	// 只要成功就检查之前的错误，把其清除
	LoginClear(ret.Aid, true)

	AdminAddLog(ret.Aid, eOpLogin, 0, 0, 0, host)

	return 0, sessions.Create(ret.Aid, 1, sonsSalt, sonsSec, host, port)
}
