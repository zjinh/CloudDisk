import * as types from './mutation-type'

export default {
    countname(context,num){
        context.commit(types.set_SelectTree,num)
    }
}
