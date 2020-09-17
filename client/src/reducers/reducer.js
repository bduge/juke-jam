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
const rootReducer = combineReducers({
    queue: changeQueueReducer,
    roomName: roomNameReducer
})

export default persistReducer(persistConfig, rootReducer)