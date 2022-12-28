package sessions

//  这里只产生和校验 sessions 的正确性。

import (
	"crypto/sha256"
	"fmt"
	"sync"
	"time"
)

type SInfo struct {
	Id    uint64      `json:"id"`
	Ctm   int64       `json:"ctm"` // 创建key的时间 与 + slot 组成Key Key   string      `json:"key"`
	Fd    int         `json:"fd"`
	trObj *time.Timer // 删除定时器
}

var users sync.Map

func encryption(id uint64, ctm int64, salt string, host string, port int32) string {
	str := fmt.Sprintf("%d_%d_%s_%s_%d", id, ctm, salt, host, port)
	sum := sha256.Sum256([]byte(str))
	return string(sum[:])
}

// Create
//
//	@Description: 创建Sessions
//	@param id		用户id
//	@param fd		通信fd
//	@param salt		加密key串
//	@param sec		使用时间秒 0:长期使用 指定秒数后失效
//	@return string
func Create(id uint64, fd int, salt string, sec int64, host string, port int32) string {
	ss := SInfo{}
	ss.Id = id
	ss.Ctm = time.Now().UnixMicro()
	if sec != 0 {
		ss.trObj = time.AfterFunc(time.Second*time.Duration(sec), func() {
			Clear(id, false)
		})
	}

	users.Store(id, ss)
	return encryption(id, ss.Ctm, salt, host, port)
}

// Check
//
//	@Description: 检查Sessions是否正常 (登录成功才有Sessions)
//	@return -1.不存在 -2.解码失败 >=0.成功，并返回此id的Fd
func Check(id uint64, key string, salt string, host string, port int32) int {
	v, ok := users.Load(id)
	if !ok {
		return -1
	}
	ss := v.(SInfo)
	k := encryption(ss.Id, ss.Ctm, salt, host, port)
	if k != key {
		return -2
	}
	return ss.Fd
}

func In(id uint64) bool {
	_, ok := users.Load(id)
	if ok {
		return true
	}
	return false
}

// Clear
//
//	@Description: 	删除Sessions记录
//	@param id		对应id
//	@param delTimer true.主动删除 false.定时器自动删除
func Clear(id uint64, delTimer bool) {
	v, ok := users.Load(id)
	if ok {
		if delTimer {
			lInfo := v.(SInfo)
			if lInfo.trObj != nil {
				lInfo.trObj.Stop()
			}
		}
	}
	users.Delete(id)
}
