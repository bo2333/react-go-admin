package controller

import (
	"fmt"
	"game_manage/config"
	"game_manage/modules/account"
	"game_manage/modules/auth"
	"game_manage/modules/inet"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

type IndexRes struct {
	inet.Res
}

func (ret *IndexRes) ViewIndex() gin.HandlerFunc {
	return func(c *gin.Context) {
		ret.HTML(c, "index.html", gin.H{})
	}
}

func (ret *IndexRes) Redirect(r *gin.Engine) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.URL.Path = "/"
		r.HandleContext(c)
		// c.Redirect(http.StatusFound, "/")
	}
}

func (ret *IndexRes) AuthCode() gin.HandlerFunc {
	return func(c *gin.Context) {
		id, image := auth.CaptchaGenerate(50, 195, 5)
		ret.JSON(c, inet.ErrSuccess, gin.H{"id": id, "image": image})
	}
}

// Login 登录入口
func (ret *IndexRes) Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var phone string
		var pwd string
		var authCodeId string
		var authCodeVal string

		if !ret.CheckPostAuthParam(c, &phone, "user") {
			return
		}
		if !ret.CheckPostAuthParam(c, &pwd, "pwd") {
			return
		}
		if !ret.CheckPostAuthParam(c, &authCodeId, "authCodeId") {
			return
		}
		if !ret.CheckPostAuthParam(c, &authCodeVal, "authCodeVal") {
			return
		}

		if !auth.IsPhone("86", phone) {
			id, image := auth.CaptchaGenerate(50, 195, 5)
			ret.JSON(c, inet.ErrParam, gin.H{"info": "user(error):" + phone, "id": id, "image": image})
			return
		}

		if !auth.CaptchaVerify(authCodeId, authCodeVal) {
			id, image := auth.CaptchaGenerate(50, 195, 5)
			ret.JSON(c, inet.ErrParam, gin.H{"info": "authCodeVal(error):" + authCodeVal, "id": id, "image": image})
			return
		}
		var acct account.SAdmin
		nextTm, sonsKey := (&acct).Login(c.ClientIP(), 0, phone, pwd, config.Ini.SBase.PwdSalt, config.Ini.SBase.SonsSalt, config.Ini.SBase.SonsSec)
		if nextTm != 0 {
			id, image := auth.CaptchaGenerate(50, 195, 5)
			if nextTm == -1 {
				ret.JSON(c, inet.ErrAccount, gin.H{"info": sonsKey, "id": id, "image": image})
			} else if nextTm == -2 {
				ret.JSON(c, inet.ErrPass, gin.H{"info": sonsKey, "id": id, "image": image})
			} else if nextTm > 0 {
				ret.JSON(c, inet.ErrPass, gin.H{"info": sonsKey, "tmNext": nextTm, "tmCur": time.Now().Unix(), "id": id, "image": image})
			} else {
				ret.JSON(c, inet.ErrFail, gin.H{"info": "未配置的错误", "id": id, "image": image})
			}
			return
		}

		sonsId, ssidErr := c.Cookie("sonsId")
		if ssidErr == nil {
			fmt.Println(sonsId)
		}

		c.SetCookie("sonsId", strconv.FormatUint(acct.Aid, 10), int(config.Ini.SBase.SonsSec), "/", "", false, false)
		c.SetCookie("access", strconv.FormatUint(uint64(acct.Access), 10), int(config.Ini.SBase.SonsSec), "/", "", false, false)
		c.SetCookie("sonsKey", sonsKey, int(config.Ini.SBase.SonsSec), "/", "", false, true)
		c.SetCookie("userName", acct.Name, int(config.Ini.SBase.SonsSec), "/", "", false, false)
		c.SetCookie("userLoginTime", strconv.FormatUint(uint64(acct.Ltm), 10), int(config.Ini.SBase.SonsSec), "/", "", false, false)
		c.SetCookie("userHost", acct.Host, int(config.Ini.SBase.SonsSec), "/", "", false, false)

		ret.JSON(c, inet.ErrSuccess, gin.H{"sonsId": acct.Aid})
	}
}

/*func (ret *IndexRes) Robots() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Add("Content-Disposition", "attachment;filename=robots.txt")
		c.File("./view/robots.txt")
	}
}*/
