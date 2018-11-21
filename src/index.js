import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import rootReducer from './store/reducers/rootReducer'
import { createStore, compose, applyMiddleware } from 'redux' // создание store, compose для redux-devtools
import { Provider } from 'react-redux' // для поддержки redux в приложении
import thunk from 'redux-thunk' // для асинхронного кода в actions

// подключаем возможность использовать redux-devtools (док. redux-devtools, 1.2 Advanced store setup)
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

// формирование store
// он определяетя функцией createStore, в кот. передаем rootReducer, в котором собраны все reducer
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk) // thunk передаем как middleware
  )
)

// обернем приложение в Provider, как параметр передадим store, который только что создали
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
