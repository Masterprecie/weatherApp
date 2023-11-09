import { createSlice } from '@reduxjs/toolkit';

export const weatherSlice = createSlice({
	name: 'weather',
	initialState: {
		searchResults: [],
	},
	reducers: {
		addSearchResult: (state, action) => {
			// Only add the result if it's not already in the search results.
			if (!state.searchResults.some(result => result.name === action.payload.name)) {
				state.searchResults.push(action.payload);
			}
		},
		deleteSearchResult: (state, action) => {
			state.searchResults = state.searchResults.filter(result => result.name !== action.payload);
		},
	},
});

export const { addSearchResult, deleteSearchResult } = weatherSlice.actions;

export default weatherSlice.reducer;