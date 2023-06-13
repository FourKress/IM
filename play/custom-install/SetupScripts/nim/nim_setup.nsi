# ====================== 自定义宏 产品信息==============================
!define PRODUCT_NAME           		"蓝数"
!define PRODUCT_PATHNAME 			    "LanShu_PC"  #安装卸载项用到的KEY
!define INSTALL_APPEND_PATH       "LanShu"	  #安装路径追加的名称
!define INSTALL_DEFALT_SETUPPATH  ""       #默认生成的安装路径
!define EXE_NAME               		"蓝数IM.exe"
!define PRODUCT_VERSION        		"0.0.0.1"
!define PRODUCT_PUBLISHER      		"蓝数公司"
!define PRODUCT_LEGAL          		"蓝数公司 Copyright（c）2015"
!define INSTALL_OUTPUT_NAME    		"蓝数.exe"

# ====================== 自定义宏 安装信息==============================
!define INSTALL_7Z_PATH 	   		  "..\app.7z"
!define INSTALL_7Z_NAME 	   		  "app.7z"
!define INSTALL_RES_PATH       		"skin.zip"
!define INSTALL_LICENCE_FILENAME  "licence.rtf"
!define INSTALL_ICO 				      "logo.ico"
!define UNINSTALL_ICO 				    "uninst.ico"

#SetCompressor lzma

!include "ui_nim_setup.nsh"

# ==================== NSIS属性 ================================

# 针对Vista和win7 的UAC进行权限请求.
# RequestExecutionLevel none|user|highest|admin
RequestExecutionLevel admin


; 安装包名字.
Name "${PRODUCT_NAME}"

# 安装程序文件名.

OutFile "..\..\Output\${INSTALL_OUTPUT_NAME}"

;$PROGRAMFILES32\Netease\NIM\

InstallDir "1"

# 安装和卸载程序图标
Icon              "${INSTALL_ICO}"
UninstallIcon     "${UNINSTALL_ICO}"
