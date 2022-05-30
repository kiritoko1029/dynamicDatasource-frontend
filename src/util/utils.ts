export const copy = (data:any) => {
    return new Promise((resolve, reject) => {
        const url = data
        const oInput = document.createElement('input')
        oInput.value = url
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        oInput.remove()
        resolve(`复制成功`)
    });
}
