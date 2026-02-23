import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "users",
  initialState: [
    {
      id: 1,
      name: "Anshul",
      email: "anshul@gmail.com",
      role: "CEO",
      department: "Management",
      city: "Ahmedabad",
      status: "Active",
    },
    {
      id: 2,
      name: "Divy",
      email: "divy@gmail.com",
      role: "CO-Founder",
      department: "Management",
      city: "Surat",
      status: "Active",
    },
    {
      id: 3,
      name: "Denish",
      email: "denish@gmail.com",
      role: "CTO",
      department: "Tech",
      city: "Rajkot",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Harshal",
      email: "harshal@gmail.com",
      role: "Manager",
      department: "Tech",
      city: "Vadodara",
      status: "Active",
    },
    {
      id: 5,
      name: "Dhruv",
      email: "dhruv@gmail.com",
      role: "Developer",
      department: "Tech",
      city: "Mumbai",
      status: "Active",
    },
    {
      id: 6,
      name: "Virat",
      email: "virat@gmail.com",
      role: "Designer",
      department: "Creative",
      city: "Delhi",
      status: "Inactive",
    },
    {
      id: 7,
      name: "Rohit",
      email: "rohit@gmail.com",
      role: "Admin",
      department: "Management",
      city: "Mumbai",
      status: "Active",
    },
    {
      id: 8,
      name: "Ishan",
      email: "ishan@gmail.com",
      role: "HR",
      department: "HR",
      city: "Pune",
      status: "Active",
    },
    {
      id: 9,
      name: "Siddh",
      email: "siddh@gmail.com",
      role: "Sales",
      department: "Sales",
      city: "Ahmedabad",
      status: "Inactive",
    },
    {
      id: 10,
      name: "Gourav",
      email: "gourav@gmail.com",
      role: "Finance",
      department: "Finance",
      city: "Kolkata",
      status: "Active",
    },
  ],
  reducers: {
    deleteUser: (state, action) =>
      state.filter((user) => user.id !== action.payload),
  },
});

export const { deleteUser } = userSlice.actions;
export default userSlice.reducer;
