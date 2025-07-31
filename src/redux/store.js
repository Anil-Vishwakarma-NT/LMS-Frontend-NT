// store.js
import { createStore } from 'redux';
import rootReducer from './rootReducer';

const persistedAuth = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth'))
    : undefined;

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Subscribe to store updates and persist
store.subscribe(() => {
    const state = store.getState();
});

export default store;
