SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `mir5_admin.account`  (
    `aid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'acct id',
    `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '名字',
    `access` int(11) UNSIGNED NULL DEFAULT 0 COMMENT '权限 bit',
    `valid` tinyint(8) UNSIGNED NULL DEFAULT 0 COMMENT '是否有效 0.无效 1有效',
    `ltm` bigint(20) UNSIGNED NULL DEFAULT 0 COMMENT '最后登录时间',
    `host` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '最后登录ip',
    `ctm` bigint(20) UNSIGNED NULL DEFAULT 0 COMMENT '创建时间',
    `acct` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '帐号',
    `pwd` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT ' 密码',
    PRIMARY KEY (`aid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理人员帐户表' ROW_FORMAT = Dynamic;


CREATE TABLE IF NOT EXISTS `mir5_admin.account_log`  (
    `lid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '序号',
    `aid` bigint(20) NULL DEFAULT NULL COMMENT 'acct id',
    `op` int(11) UNSIGNED NULL DEFAULT 0 COMMENT '操作主节点',
    `p0` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '参数0',
    `p1` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '参数1',
    `p2` bigint(20) NULL DEFAULT NULL COMMENT '参数2',
    `p3` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '参数3',
    `ctm` bigint(20) NULL DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`lid`) USING BTREE,
    INDEX `opm`(`op`) USING BTREE,
    INDEX `ctm`(`ctm`) USING BTREE,
    INDEX `aid`(`aid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;


SET FOREIGN_KEY_CHECKS = 1;


-- ----------------------------
-- Records of account  对应 pwd_salt=sdkfjse,.$5dksdf
-- ----------------------------
REPLACE INTO account (`name`, `access`, `valid`, `ltm`, `host`, `ctm`, `acct`, `pwd`)
VALUES ('超级管理员', 4294967295, 1, UNIX_TIMESTAMP(NOW()), '127.0.0.1', UNIX_TIMESTAMP(NOW()), '13500050006', MD5(CONCAT('13500050006', 'aA525252', 'sdkfjse,.$5dksdf')));