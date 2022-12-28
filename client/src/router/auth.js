import cookie from "react-cookies";
import {COOKIE_KEYS} from "../cookieKeys";
import {redirect} from "react-router-dom";


function isLogin(sonsId) {
    return !(!sonsId || sonsId <= 0);
}

function isRight(right, access) {
    return !(right && right > 0 && (!access || (right & access) === 0));
}



// 验证是否要登录，或需要的权限
export function RequireAuth(login, right) {
    if (login) {
        if (!isLogin(cookie.load(COOKIE_KEYS.sonsId))) {
            return redirect("/login")
        }
    }
    if (right > 0) {
        if (!isRight(right, cookie.load(COOKIE_KEYS.access))) {
            return redirect("/")
        }
    }
    return {}
}

// 需要权限 right=配置的权限 access=角色身上的使用权
export function RequireRight(right, access) {
    return isRight(right, access)
}