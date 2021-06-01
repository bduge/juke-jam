import changeQueueReducer from './changeQueue';
import {roomNameReducer, isHostReducer} from './roomNameReducer'
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
    roomName: roomNameReducer,
    isHost: isHostReducer
})

const rootReducer = (state, action) => {
    if (action.type === "EXIT") {
        state = undefined
        localStorage.clear()
    }
    return appReducer(state, action)
}

export default persistReducer(persistConfig, rootReducer)