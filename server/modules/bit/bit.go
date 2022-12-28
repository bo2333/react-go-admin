package bit

// Inter (交集)n有1位置上的1与v相同位置上全相等，就允许通过
//
// 通常用于某个权限检查 v:为已有权限 n:为权限需要值(针对特定的一个位置) if BitCheckVal(1035, 1<<0)
func Inter(v uint32, n uint32) bool {
	if n == 0 {
		return false
	}

	if v <= 0 {
		return false
	}

	return v&n != 0
}

// In (存在) n其中一位与v(主)的位相等就为真
func In(v uint32, n uint32) bool {
	if v <= 0 {
		return false
	}
	if !!((v & n) != 0) {
		return true
	}
	return false
}

// Check 检查指定p位置上的bit是否为1 return true
func Check(v uint32, p uint32) bool {
	return (v & (1 << p)) != 0
}

// Get 读取指定位置上的值
func Get(v uint32, p uint32) uint32 {
	if p > 31 {
		return 0
	}
	return (v >> p) & 1
}

// Set 设置指定p位置上的bit(true:1, false:0) return：修改后的值
func Set(v uint32, p uint32, s bool) uint32 {
	if p > 31 {
		return v
	}
	if s {
		v |= 1 << p
	} else {
		v &= ^(1 << p)
	}
	return v
}

// Flip 取反 原来是0的就设置为1
func Flip(v uint32, p uint32) uint32 {
	return v ^ (1 << p)
}
