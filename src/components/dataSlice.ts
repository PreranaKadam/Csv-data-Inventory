import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [] as any[],
  filteredData: [],
  updatedValueData: [],
};

const DataSlice: any = createSlice({
  name: 'dataslice',
  initialState,
  reducers: {
    updateData: (state, action) => {
      state.data = action.payload;
    },
    filterData: (state: any, action:any) => {
      const userInput = typeof action.payload === 'string' ? action.payload.toLowerCase() : '';
      state.filteredData = state.data.filter(
        (item: any) =>
          (item[0] && item[0].toLowerCase().includes(userInput)) ||
          (item[1] && item[1].toLowerCase().includes(userInput))
      );
    },
    EditedData: (state, action) => {
      state.updatedValueData = action.payload;
    },
  },
});

export default DataSlice.reducer;
export const {
  updateData,
  filterData,
  EditedData,
  UpdateMainData,
} = DataSlice.actions;

