// rights
//  用于部门显示。没有部门-权限的不显示菜单
//  对应 account.go 的宏

export const RIGHT_TEAM = {
    HOME: 0,
    DEV_OPS: 1,
    OPERATE: 2,
    DEVELOP: 3,
    GAME_MANAGER: 4,
    CUSTOMER_SERVICE: 5,
}

export const RIGHT_BIT = {
    HOME_READ: 0,                                           // 账号可读
    HOME_WRITE: 1,                                          // 账号可改
    HOME_OPERATE: 2,                                        // 账号管控 (可添加|重置|賦权)
    HOME_REVIEW: 3,                                         // 账号审核 (可添加|重置|賦权)

    DEV_OPS_READ: 5,                                           // 运维可读
    DEV_OPS_WRITE: 6,                                          // 运维可写
    DEV_OPS_OPERATE: 7,                                        // 运维管控(可添加)
    DEV_OPS_REVIEW: 8,                                         // 运维审核(可审核-上面的账号管理的审查)

    OPERATE_READ: 10,                                          // 运营可读
    OPERATE_WRITE: 11,                                         // 运营可写
    OPERATE_OPERATE: 12,                                       // 运营管理(可添加)
    OPERATE_REVIEW: 13,                                        // 运营审核(可审核-上面的账号管理的审查)

    DEVELOP_CLIENT: 15,                                        // bug-前端
    DEVELOP_SERVER: 16,                                        // bug-后端

    GAME_MANAGER_READ: 20,                                     // GM可读
    GAME_MANAGER_WRITE: 21,                                    // GM可写
    GAME_MANAGER_OPERATE: 22,                                  // GM管控(可添加)
    GAME_MANAGER_REVIEW: 23,                                   // GM审核(可审核-上面的账号管理的审查)

    CUSTOMER_SERVICE_READ: 25,                                 // 客服可读
    CUSTOMER_SERVICE_WRITE: 26,                                // 客服可写
    CUSTOMER_SERVICE_OPERATE: 27,                              // 客服管控(可添加)
    CUSTOMER_SERVICE_REVIEW: 28                                // 客服审核(可审核-上面的账号管理的审查)

}

export const RIGHT_TEAM_INFO = {
    [RIGHT_TEAM.ACCOUNT]: {
        name: "账号",
        bits: {
            [RIGHT_BIT.HOME_READ]: "可读",
            [RIGHT_BIT.HOME_WRITE]: "可写",
            [RIGHT_BIT.HOME_OPERATE]: "管控",
            [RIGHT_BIT.HOME_REVIEW]: "审核",
        }
    },
    [RIGHT_TEAM.DEV_OPS]: {
        name: "运维",
        bits: {
            [RIGHT_BIT.DEV_OPS_READ]: "可读",
            [RIGHT_BIT.DEV_OPS_WRITE]: "可写",
            [RIGHT_BIT.DEV_OPS_OPERATE]: "管控",
            [RIGHT_BIT.DEV_OPS_REVIEW]: "审核",
        }
    },
    [RIGHT_TEAM.OPERATE]: {
        name: "运营",
        bits: {
            [RIGHT_BIT.OPERATE_READ]: "可读",
            [RIGHT_BIT.OPERATE_WRITE]: "可写",
            [RIGHT_BIT.OPERATE_OPERATE]: "管控",
            [RIGHT_BIT.OPERATE_REVIEW]: "审核",
        }
    },

    [RIGHT_TEAM.DEVELOP]: {
        name: "研发",
        bits: {
            [RIGHT_BIT.DEVELOP_CLIENT]: "前端",
            [RIGHT_BIT.DEVELOP_SERVER]: "后端",
        }
    },
    [RIGHT_TEAM.GAME_MANAGER]: {
        name: "GM.",
        bits: {
            [RIGHT_BIT.GAME_MANAGER_READ]: "可读",
            [RIGHT_BIT.GAME_MANAGER_WRITE]: "可写",
            [RIGHT_BIT.GAME_MANAGER_OPERATE]: "管控",
            [RIGHT_BIT.GAME_MANAGER_REVIEW]: "审核",
        }
    },
    [RIGHT_TEAM.CUSTOMER_SERVICE]: {
        name: "客服",
        bits: {
            [RIGHT_BIT.CUSTOMER_SERVICE_READ]: "可读",
            [RIGHT_BIT.CUSTOMER_SERVICE_WRITE]: "可写",
            [RIGHT_BIT.CUSTOMER_SERVICE_OPERATE]: "管控",
            [RIGHT_BIT.CUSTOMER_SERVICE_REVIEW]: "审核",
        }
    }
}

export const RIGHTS = {
    NONE:   0,                                                                  // 没有权限
    HOME_READ: 1 << RIGHT_BIT.HOME_READ,                                        // home可读
    HOME_WRITE: 1 << RIGHT_BIT.HOME_WRITE,                                      // home可改
    HOME_OPERATE: 1 << RIGHT_BIT.HOME_OPERATE,                                  // home管控 (添加|重置|賦权)
    HOME_REVIEW: 1 << RIGHT_BIT.HOME_REVIEW,                                    // home审核 (管控)
    HOME_ALL: (1 << RIGHT_BIT.HOME_READ) | (1 << RIGHT_BIT.HOME_WRITE) | (1 << RIGHT_BIT.HOME_OPERATE) | (1 << RIGHT_BIT.HOME_REVIEW),                 // 账号所有权限

    DEV_OPS_READ: 1 << RIGHT_BIT.DEV_OPS_READ,                                  // 运维可读
    DEV_OPS_WRITE: 1 << RIGHT_BIT.DEV_OPS_WRITE,                                // 运维可写
    DEV_OPS_OPERATE: 1 << RIGHT_BIT.DEV_OPS_OPERATE,                            // 运维管控(添加|重置|賦权)
    DEV_OPS_REVIEW: 1 << RIGHT_BIT.DEV_OPS_REVIEW,                              // 运维审核(管控)
    DEV_OPS_ALL: (1 << RIGHT_BIT.DEV_OPS_READ) | (1 << RIGHT_BIT.DEV_OPS_WRITE) | (1 << RIGHT_BIT.DEV_OPS_OPERATE) | (1 << RIGHT_BIT.DEV_OPS_REVIEW),                 // 运维所有权限

    OPERATE_READ: 1 << RIGHT_BIT.OPERATE_READ,                                  // 运营可读
    OPERATE_WRITE: 1 << RIGHT_BIT.OPERATE_WRITE,                                // 运营可写
    OPERATE_OPERATE: 1 << RIGHT_BIT.OPERATE_OPERATE,                            // 运营管控(添加|重置|賦权)
    OPERATE_REVIEW: 1 << RIGHT_BIT.OPERATE_REVIEW,                              // 运营审核(可审核-上面的账号管理的审查)
    OPERATE_ALL: (1 << RIGHT_BIT.OPERATE_READ) | (1 << RIGHT_BIT.OPERATE_WRITE) | (1 << RIGHT_BIT.OPERATE_OPERATE) | (1 << RIGHT_BIT.OPERATE_REVIEW),             // 运营总管

    DEVELOP_CLIENT: 1 << RIGHT_BIT.DEVELOP_CLIENT,                              // 研发-前端
    DEVELOP_SERVER: 1 << RIGHT_BIT.DEVELOP_SERVER,                              // 研发-后端
    DEVELOP_ALL: (1 << RIGHT_BIT.DEVELOP_CLIENT) | (1 << RIGHT_BIT.DEVELOP_SERVER),                                 // 研发-所有权限

    GAME_MANAGER_READ: 1 << RIGHT_BIT.GAME_MANAGER_READ,                        // GM可读
    GAME_MANAGER_WRITE: 1 << RIGHT_BIT.GAME_MANAGER_WRITE,                      // GM可写
    GAME_MANAGER_OPERATE: 1 << RIGHT_BIT.GAME_MANAGER_OPERATE,                  // GM管控(添加|重置|賦权)
    GAME_MANAGER_REVIEW: 1 << RIGHT_BIT.GAME_MANAGER_REVIEW,                    // GM审核(可审核-上面的账号管理的审查)
    GAME_MANAGER_ALL: (1 << RIGHT_BIT.GAME_MANAGER_READ) | (1 << RIGHT_BIT.GAME_MANAGER_WRITE) | (1 << RIGHT_BIT.GAME_MANAGER_OPERATE) | (1 << RIGHT_BIT.GAME_MANAGER_REVIEW),        // GM所有权限

    CUSTOMER_SERVICE_READ: 1 << RIGHT_BIT.CUSTOMER_SERVICE_READ,                // 客服可读
    CUSTOMER_SERVICE_WRITE: 1 << RIGHT_BIT.CUSTOMER_SERVICE_WRITE,              // 客服可写
    CUSTOMER_SERVICE_OPERATE: 1 << RIGHT_BIT.CUSTOMER_SERVICE_OPERATE,          // 客服管控(添加|重置|賦权)
    CUSTOMER_SERVICE_REVIEW: 1 << RIGHT_BIT.CUSTOMER_SERVICE_REVIEW,            // 客服审核(管控)
    CUSTOMER_SERVICE_ALL: (1 << RIGHT_BIT.CUSTOMER_SERVICE_READ) | (1 << RIGHT_BIT.CUSTOMER_SERVICE_WRITE) | (1 << RIGHT_BIT.CUSTOMER_SERVICE_OPERATE) | (1 << RIGHT_BIT.CUSTOMER_SERVICE_REVIEW),    // 客服所有权限
}