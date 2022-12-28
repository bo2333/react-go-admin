package account

import (
	"math"
	"sync"
	"time"
)

//
// 需要数据库 account
//

const ERead uint32 = 1 << 0         // 账号查询 1 对应 rights.js
const EWrite uint32 = ERead | 1<<1  // 账号管理 2
const EManage uint32 = ERead | 1<<2 // 账号审核 4

const loginErrorMax = 5

type SLogin struct {
	Aid   uint64
	Count uint32
	Ntm   int64       // 下次允许登录的时间 10s的count次方
	Etm   int64       // 清除错误记录的时间 math.Pow(10,loginErrorMax)
	trObj *time.Timer // 一天内允许错误5次，如果成功一次就将前面的错误次数清除
}

var accountLoginError sync.Map

// SBase 基本帐号结构
type SBase struct {
	Aid    uint64 `gorm:"primary_key;auto_increment" json:"aid"`
	Name   string `gorm:"size:32;comment:'名字'" json:"name"`
	Access uint32 `gorm:"size:11;comment:'权限'" json:"access"`
}

// SGeneral 普通帐号结构
type SGeneral struct {
	SBase
	Valid uint32 `gorm:"size:11;comment:'是否有效0.无效 1有效'" json:"valid"` //
	Ltm   int64  `gorm:"size:20;comment:'最后登录ip时间'" json:"ltm"`
	Host  string `gorm:"size:64;comment:'最后登录ip地址'" json:"host"`
	Ctm   int64  `gorm:"size:20;comment:'创建时间'" json:"ctm"`
}

// SAdvanced 高级帐号结构
type SAdvanced struct {
	SGeneral
	Acct string `gorm:"size:18;comment:'帐号'" json:"acct"`
	Pwd  string `gorm:"size:128;comment:'密码'" json:"pwd"`
}

// LoginCheck
//
//	@Description:	登录检查，是否允许登录
//	@param aid		用户aid
//	@return int64	错误返回：0.允许登录 1.下一次允许登录的时间戳
func LoginCheck(aid uint64) int64 {
	if v, ok := accountLoginError.Load(aid); ok {
		lInfo := v.(SLogin)
		now := time.Now().Unix()
		if lInfo.Count < loginErrorMax {
			if lInfo.Ntm > now {
				return lInfo.Ntm
			}
		} else {
			if lInfo.Etm > now {
				return lInfo.Etm
			}
		}
	}
	return 0
}

// LoginError
//
//	@Description:	添加登录错误
//	@param aid		用户aid
//	@return int64	返回下一次允许登录的时间戳
func LoginError(aid uint64) {
	var lInfo SLogin
	now := time.Now().Unix()
	v, errInfo := accountLoginError.Load(aid)
	if v != nil {
		lInfo = v.(SLogin)
	}
	if !errInfo {
		lInfo.Aid = aid
		lInfo.Count = 1
		lInfo.Etm = int64(math.Pow(10.0, loginErrorMax))
		lInfo.Ntm = now + 10
		lInfo.trObj = time.AfterFunc(time.Second*time.Duration(lInfo.Etm), func() {
			LoginClear(aid, false)
		})
	} else {
		lInfo.Count += 1
		lInfo.Ntm = int64(math.Pow(10.0, float64(lInfo.Count)))
		// 下次允许登录的时间 > 清除错误记录的时间
		if lInfo.Ntm > lInfo.Etm {
			lInfo.Etm = lInfo.Ntm
			if lInfo.Count >= loginErrorMax {
				return
			}
		}
		// 防止还没清除就重置
		if lInfo.trObj.Stop() {
			select {
			case <-lInfo.trObj.C: // try to drain the channel
			default:
			}
		}
		lInfo.trObj.Reset(time.Second * time.Duration(lInfo.Etm))
	}
	accountLoginError.Store(aid, lInfo)

}

// LoginClear
//
//	@Description: 	删除每次登录记录
//	@param aid		用户aid
//	@param delTimer	是否要删除定时器（如果是定时器传入的，就为false）
func LoginClear(aid uint64, delTimer bool) {
	if v, ok := accountLoginError.Load(aid); ok {
		if delTimer {
			lInfo := v.(SLogin)
			if lInfo.trObj != nil {
				lInfo.trObj.Stop()
			}
		}
		accountLoginError.Delete(aid)
	}
}
