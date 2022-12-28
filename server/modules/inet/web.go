package inet

import (
	"game_manage/modules/auth"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Res struct {
}

const (
	ErrSuccess = 0 // 成功
	ErrFail    = 1 // 失败
	ErrParam   = 2 // 参数错误
	ErrConf    = 3 // 配置错误

	ErrDBSave = 50 // 数据保存出错

	ErrAccount = 100 // 账号不存在
	ErrPassLen = 110 // 密码长度
	ErrPass    = 111 // 密码不匹配

	ErrLogin = 200 // 没有登录
)

func (Base *Res) HTML(c *gin.Context, url string, msg interface{}) {
	c.HTML(http.StatusOK, url, msg)
}

func (Base *Res) JSON(c *gin.Context, err int, msg interface{}) {
	c.JSON(http.StatusOK, gin.H{
		"err": err,
		"msg": msg,
	})
}

func (Base *Res) TABLE(c *gin.Context, err int, msg interface{}) {
	c.JSON(http.StatusOK, gin.H{
		"err": err,
		"msg": msg,
	})
}

func (Base *Res) CheckPostParam(c *gin.Context, v *string, n string) bool {
	*v = c.PostForm(n)
	if *v == "" {
		Base.JSON(c, ErrParam, "param(null):"+n)
		return false
	}
	return true
}

func (Base *Res) CheckPostAuthParam(c *gin.Context, v *string, n string) bool {
	*v = c.PostForm(n)
	if *v == "" {
		id, image := auth.CaptchaGenerate(50, 195, 5)
		Base.JSON(c, ErrParam, gin.H{"info": "param(null):" + n, "id": id, "image": image})
		return false
	}
	return true
}
