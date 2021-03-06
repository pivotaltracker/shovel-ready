import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import * as React from 'react';
import { render }  from 'react-dom';
import AppContainer from './containers/app';
import { Provider } from 'react-redux'
import { Store } from 'redux';

import * as serverSync from './server_sync';

import * as appActions from './actions/app';
import { rootReducer } from './reducers/root';
import { StoreState } from 'app';

const url = window.location.href;
const lastSlashIndex = url.lastIndexOf('/');
const retroId = url.substring(lastSlashIndex + 1);

function loadRetroEvents(retroId, fromVersion = 1, toVersion = 'latest') {
    return fetch(`/${retroId}/events?fromVersion=${fromVersion}&toVersion=${toVersion}`).then((res) => res.json())
}

loadRetroEvents(retroId, 1, 'latest').then((eventRecords) => {
    const store: Store<StoreState> = createStore(
        rootReducer,
        {
            serverSync: serverSync.init(
                [],
                eventRecords.map(eventRecord => eventRecord.eventData),
                eventRecords[eventRecords.length - 1].retroVersion
            ),
            draft: {
                newItemNames: {},
                newColumnName: '',
            }
        },
        applyMiddleware(
            thunkMiddleware,
        )
    ) as Store<StoreState>;

    render(
        <Provider store={store}>
          <AppContainer />
        </Provider>,
        document.getElementById('root')
      )
      
    serverSync.syncWithServer(retroId, store, (store) => store.getState().serverSync, loadRetroEvents);
    window.store = store;
});

declare global {
    interface Window { store: Store<StoreState>; } // TODO: Figure out type of store
}
  