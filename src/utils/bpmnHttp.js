module.exports = function(url,type) {
  return new Promise(function(resolve, reject) {
    // 需要在这里处理异步任务
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    //设置请求头参数的方式,如果没有可忽略此行代码
    xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`)
    xhr.withCredentials = true
    xhr.send()
    xhr.onreadystatechange = function() {
      // 当readyState值不为0的时候直接返回
      if (xhr.readyState != 4) return
      if (xhr.readyState == 4 && xhr.status == 200) {
        // 获取后台数据
        const data = JSON.parse(this.response).data
        console.log(JSON.parse(this.response))
        const dataSouce = [{ name: '请选择', value: '' }]
        JSON.parse(this.response).length > 0 &&
          JSON.parse(this.response).map(item => {
            dataSouce.push({ name: item.name, value: item.key })
          })
        resolve(dataSouce)
      } else {
        // 失败的情况
        reject('服务器错误')
      }
    }
  })
}
