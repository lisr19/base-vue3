import axios from 'axios'
import { getToken } from '@/utils/getToken'
const FILE_TYPE_MAP = {
  jpg: 'image/jpeg',
  jpeg:'image/jpeg',
  png: 'image/png',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
}
export default {
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    // commonDownloadFile (fileId) {
    //   window.open(`https://qycj.dev.iot-cas.com/qycj-system/api/file/download?id=${fileId}`)
    //
    // },
    //下载文件
    commonDownloadFile({data = '', url, method = 'get'} = {}) {
      let token = getToken().token
      console.log('token',token)
      return new Promise((resolve, reject) => {

        axios({
          baseURL: process.env.VUE_APP_BASE_API,
          timeout: 0,
          // url:'/qycj-system/api/file/download',
          url,
          data,
          method,
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': token
          },
          transformRequest: [
            () => {
              return JSON.stringify(data)
            }
          ],
          params: data
        }).then(res => {
          console.log('res',res)
          const fileName = decodeURI(
            res.headers['content-disposition'].replace(/\"/g,"").substring(
              res.headers['content-disposition'].indexOf('=') + 1
            )
          )

          let arr = fileName.split('.')
          let fileType = arr[arr.length-1]

          const isIE = !!(!!window.ActiveXObject || 'ActiveXObject' in window)
          if (isIE) {
            const file = new Blob([res.data], {
              type: FILE_TYPE_MAP[fileType]
            })
            window.navigator.msSaveBlob(file, fileName)
            // 返回文件信息
            resolve({fileName: fileName})
          } else {
            const url = window.URL.createObjectURL(
              new Blob([res.data], {type: FILE_TYPE_MAP[fileType]})
            )
            // 下载
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            // 返回文件信息
            resolve({url, fileName: fileName})
          }


        }).catch(err=>{
          reject()
        })

      })
    }

  }
}
