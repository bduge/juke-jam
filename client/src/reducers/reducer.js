import changeQueueReducer from './changeQueue';
import roomNameReducer from './roomNameReducer'
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    queue: changeQueueReducer,
    roomName: roomNameReducer
})

export default rootReducer