
let urls = [
    'https://island-dev2.iot-cas.com/island-intelligent/v2/api-docs',
    'https://island-dev2.iot-cas.com/island-assets/v2/api-docs',
    'https://island-dev2.iot-cas.com/system/v2/api-docs?group=s-media',
    'https://island-dev2.iot-cas.com/system/v2/api-docs?group=system',
    'https://island-dev2.iot-cas.com/system/v2/api-docs?group=s-global',
    'https://island-dev2.iot-cas.com/island-business/v2/api-docs',
    'https://island-dev2.iot-cas.com/island-streaming/v2/api-docs',
    'https://island-dev2.iot-cas.com/island-ams/v2/api-docs',
    'https://island-dev2.iot-cas.com/chart/v2/api-docs',
    'https://island-dev2.iot-cas.com/island-display/v2/api-docs',
    'https://island-dev2.iot-cas.com/workflow/v2/api-docs',
    'https://island-dev2.iot-cas.com/island-miniapp/v2/api-docs'
    // 'http://192.168.3.37:9700/island-ams/v2/api-docs',
    // 'http://192.168.3.110:9700/island-ams/v2/api-docs',
]
import axios from 'axios';
import fs from 'fs';


let jsons = []
let run = async () => {
    for (let i in urls) {
        let res = await axios.get(urls[i])
        // console.log(res.data)
        jsons.push(res.data)
    }
    jsons.forEach(swagger => {
        delete swagger.info
        delete swagger.swagger
        delete swagger.securityDefinitions
        delete swagger.definitions

        for (let i in swagger.paths) {
            let path = swagger.paths[i]
            for (let j in path) {
                let method = path[j]
                delete method.responses
                delete method.security
                delete method.deprecated
                delete method.operationId
                delete method.produces
                if (method.parameters) {
                    method.parameters.forEach(param => {
                        delete param.schema
                    })
                }
            }
        }
    })
    console.log(jsons)

    //   console.log(jsons)
    fs.writeFileSync('./src/api/api-docs.json', JSON.stringify(jsons))
    fs.writeFileSync('./src/utils/dgySdk/api/api-docs.json', JSON.stringify(jsons))

    console.log('api-docs.json 更新成功')
}
run()
