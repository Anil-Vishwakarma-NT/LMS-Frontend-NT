import { createStore } from 'redux'
import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit'

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;


export const storeredux = configureStore({
    reducer: {},
});