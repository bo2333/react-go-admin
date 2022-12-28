package middleware

import (
	"game_manage/config"
	"game_manage/modules/inet"
	"game_manage/modules/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// 中间件验证sessions

// Session 登录验证
func Session() gin.HandlerFunc {
	return func(c *gin.Context) {
		sonsId, errSonsId := c.Cookie("sonsId")
		if errSonsId != nil {
			c.JSON(http.StatusOK, gin.H{
				"err": inet.ErrLogin,
				"msg": "not login",
			})
			c.Abort()
			return
		}
		sonsKey, errSonsKey := c.Cookie("sonsKey")
		if errSonsKey != nil {
			c.JSON(http.StatusOK, gin.H{
				"err": inet.ErrLogin,
				"msg": "not login",
			})
			c.Abort()
			return
		}
		id, errId := strconv.ParseUint(sonsId, 10, 32)
		if errId != nil {
			c.JSON(http.StatusOK, gin.H{
				"err": inet.ErrLogin,
				"msg": "error param",
			})
			c.Abort()
			return
		}
		fd := sessions.Check(id, sonsKey, config.Ini.SBase.SonsSalt, c.ClientIP(), 0)
		if fd <= 0 {
			if fd == -1 {
				c.JSON(http.StatusOK, gin.H{
					"err": inet.ErrLogin,
					"msg": "not login",
				})
			} else if fd == -2 {
				c.JSON(http.StatusOK, gin.H{
					"err": inet.ErrLogin,
					"msg": "fail",
				})
			} else {
				c.JSON(http.StatusOK, gin.H{
					"err": inet.ErrLogin,
					"msg": "error fd",
				})
			}
			return
		}

		c.Next()
	}
}
