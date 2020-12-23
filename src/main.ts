import * as utils from "./utils/index2"
import loading from './utils/loading'
import toast from './utils/toast'
import api from "./api"
api.getUserInfo({needLoading:true}).then(()=>{
  console.log('end1')
})
api.getUserInfo({ needLoading: true }, {
  customInterceptors(response) {
    console.log(response)
  },
  commonData:{a:10}
}).then(()=>{
  console.log('end2')
})
export default { ...utils, loading, toast }
