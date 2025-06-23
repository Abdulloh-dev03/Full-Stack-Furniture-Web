
import type { Rooms } from "./roomType"
import { axiosInstance } from "../api/axiosInstance";

export const fetchRoomsApi = async (): Promise<Rooms[]> => {
  const response = await axiosInstance.get(`/room/getall`);
  return response.data.data;
};

export const createRoomApi = async (room: Rooms): Promise<Rooms> => {
  const response = await axiosInstance.post(`/room/create`, room);
  return response.data.data;
};

export const editRoomApi = async (
  id: number,
  formData: FormData
): Promise<Rooms> => {
  const response = await axiosInstance.put(`/room/edit/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deleteRoomApi = async (id: number): Promise<number> => {
  await axiosInstance.delete(`/room/delete/${id}`);
  return id;
};
