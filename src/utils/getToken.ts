function getQueryStringByName (name:string):string {
  var result = location.search.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'))

  if (result == null || result.length < 1) {
    return ''
  }

  return result[1]
}

export function getToken(): any {
  let userName: string = getQueryStringByName('user');
  let token: string | null = localStorage.getItem('token_' + userName);
  sessionStorage.setItem('token', token || '');
  token = token ? JSON.parse(token) : {};
  return token;
}
export function setToken(data: any, refresh: boolean = false): void {
  let Token = {
    token: `${data.tokenType} ${data.value}`,
    expiration: data.expiration
  };
  let account = data.additionalInformation.userInfo.id;
  localStorage.setItem('token_' + account.trim(), JSON.stringify(Token));
  // 设置刷新token
  data.refreshToken.expiration = data.expiration;
  localStorage.setItem('refreshToken_' + account.trim(), JSON.stringify(data.refreshToken));
  if (!refresh) {
    location.href = './index.html?user=' + account.trim();
  }
}
export function setUserInfo (userInfo:Record<string,any>) {
  sessionStorage['userInfo'] = JSON.stringify(userInfo)
}

export function getUserInfo () {
  let userInfo:string = sessionStorage['userInfo']
  return userInfo ? JSON.parse(userInfo) : {}
}
let refreshTokenFunc = async () => {
  console.log('重新刷新TOKEN')
  let userName = getQueryStringByName('user')
  let refreshToken: string | null = localStorage['refreshToken_' + userName]
  let token:any= refreshToken ? JSON.parse(refreshToken) : {}
  let res = await (window as any).$Api().SecurityResourceController.get_token.request({
    params: {
      refreshToken: token.value
    },
    headers: {
      hideLoading: true
    }
  })
  setToken(res, true)
  setRefreshToken()
}

// 更新token
export function setRefreshToken(): void {
  let userName: string = getQueryStringByName('user');
  let refreshToken: string | null = localStorage.getItem('refreshToken_' + userName);
  let refreshTokenData: Record<string, any> = refreshToken ? JSON.parse(refreshToken) : {};
  if (refreshTokenData.expiration && refreshTokenData.expiration > new Date().getTime()) {
    let refreshTime: number = Math.max((refreshTokenData.expiration - new Date().getTime() - 3 * 10 * 1000), 0); // 提早3分钟重新刷新TOKEN
    console.log('重新刷新TOKEN延迟', refreshTime);
    setTimeout(refreshTokenFunc, refreshTime);
  }
}
