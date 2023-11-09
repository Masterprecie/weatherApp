import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const persistConfig = {
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, weatherReducer);

const store = configureStore({
	reducer: {
		weather: persistedReducer,
	},
});

export default store