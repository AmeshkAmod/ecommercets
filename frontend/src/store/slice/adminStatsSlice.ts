import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

interface AdminStats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
}

interface AdminStatsState {
    stats: AdminStats | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AdminStatsState = {
    stats: null,
    status: "idle",
    error: null,
};

//Thunk
export const fetchAdminStats = createAsyncThunk(
    "adminStats/fetchStats",
    async (__dirname, { rejectWithValue }) => {
        try {
            const res = await API.get("orders/admin/stats");
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch stats"
            );
        }
    }
);

const adminStatsSlice = createSlice({
    name: "adminStats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStats.pending, (s) => {
                s.status = "loading";
            })
            .addCase(fetchAdminStats.fulfilled, (s, a) => {
                s.status = "succeeded";
                s.stats = a.payload;
            })
            .addCase(fetchAdminStats.rejected, (s, a) => {
                s.status = "failed";
                s.error = a.payload as string;
            });
    },
});

export default adminStatsSlice.reducer;