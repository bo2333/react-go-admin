package auth

// 2维码
import (
	"github.com/mojocn/base64Captcha"
	"image/color"
)

type configJsonBody struct {
	Id            string
	CaptchaType   string
	VerifyValue   string
	DriverAudio   *base64Captcha.DriverAudio
	DriverString  *base64Captcha.DriverString
	DriverChinese *base64Captcha.DriverChinese
	DriverMath    *base64Captcha.DriverMath
	DriverDigit   *base64Captcha.DriverDigit
}

var store = base64Captcha.DefaultMemStore

// CaptchaGenerate 生成验证码 40, 110, 5
func CaptchaGenerate(height int, width int, noiseCount int) (string, string) {
	// 生成默认数字
	// driver = base64Captcha.DefaultDriverDigit

	rgbaColor := color.RGBA{}
	fonts := []string{"wqy-microhei.ttc"}
	driver := base64Captcha.NewDriverMath(height, width, noiseCount, 0, &rgbaColor, nil, fonts)
	// 生成base64图片
	c := base64Captcha.NewCaptcha(driver, store)
	id, b64s, err := c.Generate()
	if err != nil {
		return "", ""
	}
	return id, b64s
}

// CaptchaVerify 较验验证码并删除
func CaptchaVerify(id string, val string) bool {
	if id == "" || val == "" {
		return false
	}
	// 同时在内存清理掉这个图片
	return store.Verify(id, val, true)
}
