/* eslint-disable*/
import { Modal } from 'view-design'
import store from '../store'

const beforeClose = {
    before_close_normal: (resolve) => {
        Modal.confirm({
            title: '确定要关闭这一页吗',
            onOk: () => {
                resolve(true)
            },
            onCancel: () => {
                resolve(false)
            }
        })
    },
    //创建岗位 
    before_close_creat_post: (resolve) => {
        Modal.confirm({
            title: '确认完成创建步骤，即可关闭本页',
            onOk: () => {
                //将视图更新为0
                store.commit('setCurrent', 0)
                resolve(true)
            },
            onCancel: () => {
                resolve(false)
            }
        })
    }
}

export default beforeClose