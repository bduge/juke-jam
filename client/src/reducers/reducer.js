import changeQueueReducer from './changeQueue';
import roomNameReducer from './roomNameReducer'
import {combineReducers} from 'redux';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage, 
    whitelist: ['queue', 'roomName']
}

const appReducer = combineReducers({
    queue: changeQueueReducer,
    roomName: roomNameReducer
})

const rootReducer = (state, action) => {
    if (action.type === "EXIT") {
        console.log("EXITING")
        state = undefined
        localStorage.clear()
    }
    return appReducer(state, action)
}

// const rootReducer = (state, action) => {
//     if(action.type === 'RESET'){
//         storage.removeItem('persist:root')
//         state = undefined
//     }

//     return appReducer; 
// }

// export default rootReducer
export default persistReducer(persistConfig, rootReducer)