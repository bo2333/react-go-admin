package inet

// 网络相关
import (
	"fmt"
	"math/big"
	"net"
	"net/http"
)

// RemoteIp 获取请求中的IP
// 自定义请求头中设置的用户的真实Ip地址 router.TrustedPlatform = "Client-IP"
func RemoteIp(req *http.Request) string {
	var remoteAddr string
	// RemoteAddr
	remoteAddr = req.RemoteAddr
	if remoteAddr != "" {
		return remoteAddr
	}
	// ipv4
	remoteAddr = req.Header.Get("ipv4")
	if remoteAddr != "" {
		return remoteAddr
	}
	//
	remoteAddr = req.Header.Get("XForwardedFor")
	if remoteAddr != "" {
		return remoteAddr
	}
	// X-Forwarded-For
	remoteAddr = req.Header.Get("X-Forwarded-For")
	if remoteAddr != "" {
		return remoteAddr
	}
	// X-Real-Ip
	remoteAddr = req.Header.Get("X-Real-Ip")
	if remoteAddr != "" {
		return remoteAddr
	} else {
		remoteAddr = "127.0.0.1"
	}
	return remoteAddr
}

// NtoA 整形转字符串
func NtoA(ip uint64) string {
	return fmt.Sprintf("%d.%d.%d.%d", byte(ip>>24), byte(ip>>16), byte(ip>>8), byte(ip))
}

// AtoN ip字符串转整形
func AtoN(ip string) uint64 {
	if ip == "" {
		return 0
	}
	address := net.ParseIP(ip)
	if address == nil {
		return 0
	}
	ret := big.NewInt(0)
	ret.SetBytes(address.To4())
	return ret.Uint64()
}
