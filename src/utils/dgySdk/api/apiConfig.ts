// 免token 白名单
export const whiteList = ['themeSettings', 'login', 'weChatCode', 'phone/phoneAndMail/verifyCode', 'phoneVerifyCode', 'phoneVerifyCod', 'captcha', 'verifyResetPwd', 'phoneAndMailVerifyCode', 'isIntranet']

// 加密接口名单
export const secretList = [
	// 个人中心
	'/system/api/personalCenter/email/verifyAndBind',
	'/system/api/personalCenter/email/verifyCode',
	'/system/api/personalCenter/phone/verifyAndBind',
	'/system/api/personalCenter/phone/verifyCode',
	'/system/api/personalCenter/phoneAndMail/verifyCode',
	'/system/api/personalCenter/we_chat/bind',
	'/system/api/personalCenter/we_chat/unbind',
	// 手机登录
	'/system/api/phone/checkPhoneFuncVerifyCode',
	'/system/api/phone/check',
	'/system/api/phone/phoneAndMail/verifyCode',
	'/system/api/phone/phoneAndMail/verifyResetPwd',
	'/system/api/phone/login',
	// 用户管理
	'/system/api/user/batchOpt/verify',
	'/system/api/user/changeBatchOptPassword',
	'/system/api/user/changeBatchOptPassword/direct',
	'/system/api/user/changePassword',
	'/system/api/user/changePassword/direct',
	'/system/api/user/resetBatchOptPassword',
	'/system/api/user/resetPassword',
	// 租户管理
	'/system/api/tenantInfos/adminUser/resetPassword'
]

export const PUBLICKEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKItRC9UxSGISc6PxQiukXZ3BOQHNxTtW67HXrGbXt2l0d2Cp6tVP3nIAnVsKICkza8yxaOGAASlzIHp1BehTPUv1GaBJwknVmnxVrcXkxPxdTeSTYGIREWoy35cpNvyJq1unQiQcAU4Wog1/wIxlEzFlW8gurrfPJuaNfTisNfwIDAQAB'
