import * as utils from "./utils/index"
import loading from './utils/loading'
import toast from './utils/toast'
// import api from "./api"
// api.getUserInfo({needLoading:true},{needLoading:true}).then(()=>{
//   console.log('end1')
// })
// api.getUserInfo({needLoading:true},{needLoading:true}).then(()=>{
//   console.log('end2')
// })
class A{
  a=10
  consoleA(){
    console.log(this.a,this.name)
  }
}
class B extends A{
  a=100
  consoleBA(){
    this.consoleA()
    console.log(this)
  }
}
const obj=new B
obj.consoleBA()

export default { ...utils, loading, toast }
