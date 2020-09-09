import changeQueueReducer from './changeQueue';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    queue: changeQueueReducer
})

export default rootReducer