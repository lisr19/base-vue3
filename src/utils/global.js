import {ElMessageBox} from 'element-plus'
import Reg from '@/config/reg'
/**
 *@Description: 判断对象是否为数组
 */
export function isArray(data) {
	if (!Array.isArray) {
		Array.isArray = function (data) {
			return Object.prototype.toString.call(data) === '[object Array]';
		};
	} else {
		return Array.isArray(data) ? data : [data];
	}
}

/**
 *@Description: 用于 在表格中新增或者双击编辑 页面，判断当前用户是否正在编辑或新增中
 * 适用规则：新增、编辑、删除三种操作只允许其一
 */
export function isOperatingFn(isOperating) {
	if (isOperating) {
		MessageBox.alert('当前操作未完成，请先保存或取消操作！', '提示', {
			confirmButtonText: '确定',
			showClose: false,
		});
		return true;
	}
}

/*eslint spaced-comment:0*/
/********************************************校验规则*****************************************************************/
/**
 *@Description:校验规则
 */
export const validateRule = {
	//账号 手机号或邮箱
	account: (rule, value, callback) => {
		if (Reg.mobile.test(value) || Reg.email.test(value)) {
			callback()
		} else {
			callback(new Error('请输入正确的手机号或邮箱地址'))
		}
	},
	//数字-非负浮点型
	onlyFloat: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^\d+(\.\d+)?$/.test(value)) {
			callback(new Error('非法格式'));
		} else {
			callback();
		}
	},
	//数字-整型
	onlyInt: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^-?\d+$/.test(value)) {
			callback(new Error('非法格式'));
		} else if (Number(value) < -2147483648) {
			callback(new Error('超出最小值范围'));
		} else if (Number(value) > 2147483647) {
			callback(new Error('超出最大值范围'));
		} else {
			callback();
		}
	},
	//仅限数字
	onlyNumber: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[0-9]*$/.test(value)) {
			callback(new Error('非法格式'));
		} else {
			callback();
		}
	},
	//非零正整数
	onlyPositiveNumber: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[1-9]\d*$/.test(value)) {
			callback(new Error('非法格式'));
		} else {
			callback();
		}
	},
	//英文
	onlyLetter: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[A-Za-z]+$/.test(value)) {
			callback(new Error('仅允许英文'));
		} else {
			callback();
		}
	},
	//英文加数字
	onlyLetterAndNumber: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[A-Za-z0-9]+$/.test(value)) {
			callback(new Error('仅允许英文、数字或组合'));
		} else {
			callback();
		}
	},
	//email
	onlyEmail: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入邮箱'));
		} else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
			callback(new Error('邮箱格式不正确'));
		} else {
			callback();
		}
	},
	//phone
	onlyPhone: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (
			!/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(value) ||
			value.length !== 11
		) {
			callback(new Error('手机号码格式不正确'));
		} else {
			callback();
		}
	},
	//只允许大小写中英文、数字、_、中英文括号
	validInput: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[\u4E00-\u9FA5A-Za-z0-9_（）()]+$/.test(value)) {
			callback(new Error('仅允许中英文、数字、_、()'));
		} else {
			callback();
		}
	},
	//只允许大小写中英文、数字、中英文括号、逗号句号\  (描述的校验)
	description: function (rule, value, callback) {
		if (value !== '' && !/^[\u4E00-\u9FA5A-Za-z0-9\\（）(),，。.]+$/.test(value)) {
			callback(new Error('存在非法输入'));
		} else {
			callback();
		}
	},
	// (参数模板的校验)
	paramTemplate: function (rule, value, callback) {
		if (value === '') {
			callback();
		}
		try {
			JSON.parse(value);
		} catch (e) {
			callback(new Error('存在非法输入'));
		}
		if (/^[@#$%^&*<>]+$/.test(value)) {
			callback(new Error('存在非法输入'));
		}
	},
	//仅允许中英文、数字、_、@、()、-、.,长度4-50位
	name: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[\u4E00-\u9FA5A-Za-z0-9_@()\-\.]{1,50}$/.test(value)) {
			callback(new Error('1-50位中英文、数字、_、@、()、-、.'));
		} else {
			callback();
		}
	},
	//仅允许英文、数字、_、@、()、.、-,长度4-50位
	uid: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[A-Za-z0-9_@()\-\.]{1,50}$/.test(value)) {
			callback(new Error('1-50位英文、数字、_、@、()、.、-'));
		} else {
			callback();
		}
	},
	//仅允许英文、数字、_、@、(),长度4-50位
	uKey: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[A-Za-z0-9_@()]{1,50}$/.test(value)) {
			callback(new Error('1-50位英文、数字、_、@、()'));
		} else {
			callback();
		}
	},
	// 只允许大小写中英文、数字、_
	userName: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
		} else if (!/^[A-Za-z0-9_]{4,16}$/.test(value)) {
			callback(new Error('4-16位大小写英文、数字、_'));
		} else {
			callback();
		}
	},
	// 只允许大小写中英文、数字、_
	password: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入'));
			// } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,16}$/.test(value)) {
		} else if (
			!/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,20}$/.test(
				value
			)
		) {
			callback(new Error('6-20位大小写英文数字及标点(不含空格)，至少包含两种'));
		} else {
			callback();
		}
	},
	/**
	 * 经纬度校验
	 */
	validateLon(rule, value, callback) {
		if (isNaN(value)) {
			callback(new Error('请输入经度'));
			return;
		}
		if (value * 1 < -180 || value * 1 > 180) {
			callback(new Error('经度数据错误'));
			return;
		}
		callback();
	},
	validateLat(rule, value, callback) {
		if (isNaN(value)) {
			callback(new Error('请输入纬度'));
			return;
		}
		if (value * 1 < -90 || value * 1 > 90) {
			callback(new Error('纬度数据错误'));
			return;
		}
		callback();
	},
	// 名称校验
	validFullName(rule, value, callback) {
		let reg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]{2,20})$/;
		if (value === '') {
			callback();
		} else if (!reg.test(value)) {
			callback(new Error('必须为2-20位字母、中文或数字的组合'));
		} else {
			callback();
		}
	},

	// 节目名称校验
	validProgramName(rule, value, callback) {
		let reg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]{2,30})$/;
		if (!reg.test(value)) {
			callback(new Error('必须为2-30位字母、中文或数字的组合'));
		} else {
			callback();
		}
	},
	// 账号校验
	validAccount(rule, value, callback) {
		let reg = /^[0-9a-zA-Z]{2,15}$/;
		if (!reg.test(value)) {
			callback(new Error('必须为2-15位字母或数字的组合'));
		} else {
			callback();
		}
	},
	validEmail: function (rule, value, callback) {
		if (value === '') {
			callback();
		} else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
			callback(new Error('邮箱格式不正确'));
		} else {
			callback();
		}
	},
	// 场景编号 1~255的数字
	validSceneIndex: function (rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入场景编号，范围在 1~255'));
		} else if (!/^-?\d+$/.test(value)) {
			callback(new Error('非法格式'));
		} else if (Number(value) < 1) {
			callback(new Error('请输入范围 1~255 的数字'));
		} else if (Number(value) > 255) {
			callback(new Error('请输入范围 1~255 的数字'));
		} else {
			callback();
		}
	},
};

/**
 * 将传入数组中的key值获取name值
 * @param key
 * @param arr
 */
export function translateArrayName(key, arr) {
	let obj = arr.find(item => {
		return item.key === key;
	});
	if (!obj) {
		return '';
	}
	return obj.name;
}

/**
 * @Description:将map转为数组，用于接收后端传的map对象
 * @param ：map 数据
 */
export function formatMaptoArr(mapData) {
	let data = mapData;
	let arr = [];
	for (let item in data) {
		arr.push(data[item]);
	}
	return arr;
}

/**
 * @Description:将map转为数组，用于接收后端传的map对象
 * @param ：map 数据
 */
export function formatMaptoArr2(mapData) {
	let data = mapData;
	let arr = [];
	for (let item in data) {
		arr.push({
			id: item,
			name: data[item],
		});
	}
	return arr;
}

/**
 * @Description:格式化日期数据
 * @param ：Date对象
 * @param： 日期格式 string 例如 'Y-M-D h:i:s'
 */
export function formatDate(d, str) {
	function replaceStr(Ostr, ReplaceStr, InsertStr) {
		var strArray = Ostr.split(ReplaceStr);
		Ostr = '';
		if (strArray.length > 0) {
			for (var i in strArray) {
				if (i > 0) {
					Ostr += InsertStr;
				}
				Ostr += strArray[i];
			}
		}
		return Ostr;
	}

	str = replaceStr(str, 'Y', d.getFullYear());
	str = replaceStr(
		str,
		'M',
		d.getMonth() * 1 + 1 > 9
			? d.getMonth() * 1 + 1
			: '0' + (d.getMonth() * 1 + 1)
	);
	str = replaceStr(
		str,
		'D',
		d.getDate() > 9 ? d.getDate() : '0' + d.getDate()
	);
	str = replaceStr(
		str,
		'h',
		d.getHours() > 9 ? d.getHours() : '0' + d.getHours()
	);
	str = replaceStr(
		str,
		'i',
		d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()
	);
	str = replaceStr(
		str,
		's',
		d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds()
	);

	return str;
}

export function getLastMonthAndDay() {
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth();
	if (month === 0) {
		month = 12;
		year = year - 1;
	}
	var lastDay = new Date(year, month, 0);
	var yyyyMMdd = year + '-' + month + '-' + lastDay.getDate();
	return yyyyMMdd;
}

export function tabelDateFormatter(row, column) {
	return formatDate(new Date(row[column.property]), 'Y-M-D h:i:s');
}

export function getQueryParam(key) {
	if (!key) {
		return false;
	}

	var value = '';
	var paramStr = window.location.search
		? window.location.search.substr(1)
		: '';

	if (paramStr) {
		paramStr.split('&').forEach(function (param) {
			var arr = param.split('=');
			if (arr[0] == key) {
				value = arr[1];
			}
		});
	}

	return value;
}

/**
 * 获取数据类型
 */
export function getDataType(data) {
	return Object.prototype.toString.call(data).slice(8, -1);
}

/**
 * 深拷贝
 */
export function deepClone(target) {
	let targetType = getDataType(target);
	let result;
	if (targetType === 'Object') {
		result = {};
	} else if (targetType === 'Array') {
		result = [];
	} else {
		return target;
	}
	for (let i in target) {
		let value = target[i];
		let valueType = getDataType(value);
		if (valueType === 'Object' || valueType === 'Array') {
			result[i] = deepClone(value);
		} else {
			result[i] = value;
		}
	}
	return result;
}
