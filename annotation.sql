/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 50638
 Source Host           : localhost:3306
 Source Schema         : annotation

 Target Server Type    : MySQL
 Target Server Version : 50638
 File Encoding         : 65001

 Date: 19/03/2018 14:50:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for annotation
-- ----------------------------
DROP TABLE IF EXISTS `annotation`;
CREATE TABLE `annotation`  (
  `id` int(255) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `x` float(255, 0) NULL DEFAULT NULL,
  `y` float(255, 0) NULL DEFAULT NULL,
  `z` float(255, 0) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of annotation
-- ----------------------------
INSERT INTO `annotation` VALUES (1, '8', '8', 23, -38, 180);
INSERT INTO `annotation` VALUES (3, '2', '1', 61, 31, 6);
INSERT INTO `annotation` VALUES (5, '5', '5', -237, 13, 249);

SET FOREIGN_KEY_CHECKS = 1;
