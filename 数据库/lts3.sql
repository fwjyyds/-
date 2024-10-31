/*
 Navicat Premium Data Transfer

 Source Server         : root2
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40)
 Source Host           : localhost:3307
 Source Schema         : lts3

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40)
 File Encoding         : 65001

 Date: 31/10/2024 15:45:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for lts
-- ----------------------------
DROP TABLE IF EXISTS `lts`;
CREATE TABLE `lts`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '群聊id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '聊天室名字',
  `num` int NOT NULL DEFAULT 0 COMMENT '群聊人数',
  `face` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '封面',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '聊天室内容',
  `order1` int NOT NULL COMMENT '群主',
  PRIMARY KEY (`id`, `order1`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lts
-- ----------------------------
INSERT INTO `lts` VALUES (1, '湖北日报', 2, 'www', '[]', 1);
INSERT INTO `lts` VALUES (2, '瑟瑟1群', 3, 'a.png', '[]', 2);
INSERT INTO `lts` VALUES (3, 'sad', 3, 'www', '[{\"name\":\"1234\",\"time\":\"2024-10-31 15:40:13\",\"content\":\"你们好\"}]', 3);

-- ----------------------------
-- Table structure for ptp1
-- ----------------------------
DROP TABLE IF EXISTS `ptp1`;
CREATE TABLE `ptp1`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `ltsid` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ptp1
-- ----------------------------
INSERT INTO `ptp1` VALUES (2, 3, 1);
INSERT INTO `ptp1` VALUES (4, 3, 3);
INSERT INTO `ptp1` VALUES (5, 2, 2);
INSERT INTO `ptp1` VALUES (6, 3, 2);
INSERT INTO `ptp1` VALUES (19, 4, 3);
INSERT INTO `ptp1` VALUES (24, 1, 3);
INSERT INTO `ptp1` VALUES (25, 4, 1);
INSERT INTO `ptp1` VALUES (26, 4, 2);

-- ----------------------------
-- Table structure for ptp2
-- ----------------------------
DROP TABLE IF EXISTS `ptp2`;
CREATE TABLE `ptp2`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid1` int NOT NULL,
  `userid2` int NOT NULL,
  PRIMARY KEY (`id`, `userid1`, `userid2`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ptp2
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `des` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '个人描述',
  PRIMARY KEY (`id`, `username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '1234', '1234', '放荡不可');
INSERT INTO `user` VALUES (2, '1111', '1111', '1234');
INSERT INTO `user` VALUES (3, '999', '999', '继续xx永不投降');
INSERT INTO `user` VALUES (4, 'admin', 'admin', '管理员');

SET FOREIGN_KEY_CHECKS = 1;
