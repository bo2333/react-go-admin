package auth

// 手机
import "regexp"

func IsPhone(countryCode string, phone string) bool {
	var result bool
	switch countryCode {
	case "1":
		result, _ = regexp.MatchString(`^(\d{10})$`, phone) // 美国10位
	case "81":
		result, _ = regexp.MatchString(`^(0[7,8,9]0\d{8})$`, phone) // 日本
	case "82":
		result, _ = regexp.MatchString(`^([0,1][0,1][1,6,7,8,9]\d{8,9})$`, phone) // 韩国10-11位
	case "86":
		result, _ = regexp.MatchString(`^(1[3456789]\d{9})$`, phone) // 中国11位
	case "852":
		result, _ = regexp.MatchString(`^([9,6]\d{7})$`, phone) // 香港8位
	case "853":
		result, _ = regexp.MatchString(`^(6\d{7})$`, phone) // 澳门8位
	case "886":
		result, _ = regexp.MatchString(`^(09\d{8})$`, phone) // 台湾10位
	default:
		return false
	}
	return result
}
