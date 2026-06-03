import { createSlice } from "@reduxjs/toolkit";

const OwnerSlice = createSlice({
    name: "owner",
    initialState: {
        MyshopData: null,
        MyshopItems:null
        
    },
    reducers: {
        setMyShopData: (state, action) => {
            state.MyshopData = action.payload
        },
        setMyShopItems: (state, action) => {
            state.MyshopItems = action.payload
        }
    }
})

export const { setMyShopData, setMyShopItems } = OwnerSlice.actions
export default OwnerSlice.reducer