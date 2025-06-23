import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { fetchRoomsApi,createRoomApi,editRoomApi,deleteRoomApi } from "./roomsApi"
import type { Rooms } from "./roomType";

interface RoomState {
    rooms:Rooms[];
    loading:boolean;
    error:string | null;
}

const initialState: RoomState = {
    rooms:[],
    loading:false,
    error:null,
}

// Fetch All rooms 
export const fetchRooms = createAsyncThunk(
    "rooms/fetchRooms",
    async (_,thunkAPI) => {
        try{
            return await fetchRoomsApi();
        }catch{
            return thunkAPI.rejectWithValue("Failed to fecth rooms")
        }
    }
);

// create 
export const createRoom = createAsyncThunk(
    "rooms/create",     
    async (room:Rooms,thunkAPI) =>{
        try{
            return await createRoomApi(room)
        }catch{
            return thunkAPI.rejectWithValue("Failed to create room");
        }
    }
)
// editRoom now accepts { id, formData }
export const editRoom = createAsyncThunk(
    "rooms/edit",
    async(
        payload:{id:number; formData :FormData},
        thunkAPI
    ) =>{
        try{
            const {id,formData} = payload;
            return await editRoomApi(id,formData )
        }catch{
            return thunkAPI.rejectWithValue("Failed to edit room");
        }
    }
);
// deleteProduct stays the same
export const deleteRoom = createAsyncThunk(
    "rooms/delete",
    async(id:number,thunkAPI) => {
        try{
            return await deleteRoomApi(id);
        }catch{
            return thunkAPI.rejectWithValue("Failed to delete room");
        }
    }
)

const roomSlice  = createSlice({
    name:"room",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        //Fecth
        .addCase(fetchRooms.pending, (state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchRooms.fulfilled, (state, action) =>{
            state.loading = false;
            state.rooms = action.payload;
        })
        .addCase(fetchRooms.rejected, (state,action) =>{
            state.loading = false;
            state.error = action.payload as string;
        });
        builder
        //create
        .addCase(createRoom.pending, state => {
            state.loading = true;
            state.error = null
        })
        .addCase(createRoom.fulfilled, (state, action) => {
            state.loading = false;
            state.rooms.push(action.payload);
        })
        .addCase(createRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        // edit
        builder
        .addCase(editRoom.pending, (state) => {
          state.loading = true;
            state.error = null;
        })
        .addCase(editRoom.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.rooms.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
              state.rooms[index] = action.payload; // ✅ update instead of push
            }
        })
        .addCase(editRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        //delete
        builder
        .addCase(deleteRoom.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteRoom.fulfilled, (state, action) => {
          state.loading = false;
          // Remove the deleted product from state by ID
          state.rooms = state.rooms.filter(
            (room) => room.id !== action.payload
          );
        })
        .addCase(deleteRoom.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    }
})


export default roomSlice.reducer;