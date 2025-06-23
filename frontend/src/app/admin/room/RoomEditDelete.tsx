"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import type { AppDispatch,RootState } from "../../../redux/app/store";
import { 
    fetchRooms,
    editRoom,
    deleteRoom } from "../../../redux/rooms/roomSlice";
import { Modal } from "../../../components/ui/modal/modal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/form/InputField";
import Label from "../../../components/ui/form/Label";
import TextArea from "../../../components/ui/form/TextArea";
import {  message } from "antd";
import ComponentCard from "../../../components/common/ComponentCard";
import { LoadingOutlined } from "@ant-design/icons";
import RoomCard from "./RoomCard";
import Image from "next/image";

interface RoomType {
  id: number;
  title: string;
  heading: string;
  price: number;
  image: string | File;
}


export default function RoomEditDelete(){
    const dispatch = useDispatch<AppDispatch>();
    const rooms = useSelector((state:RootState)=> state.room.rooms);
    const [loading, setLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
      const [preview, setPreview] = useState<string | null>(null);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
      useEffect(() => {
        dispatch(fetchRooms());
      }, [dispatch]);

      const handleEditClick = (room:RoomType) => {
        setSelectedRoom(room);
        setPreview(typeof room.image === "string" ? room.image : null)
        setIsEditModalOpen(true)
      };

      const handleUpdate = async () => {
        if(selectedRoom) {
            setLoading(true);
            try{
                const formData = toFormData(selectedRoom);
                await dispatch(editRoom({id: selectedRoom.id, formData})).unwrap();

                await dispatch(fetchRooms());
                setIsEditModalOpen(false);
                setSelectedRoom(null)
                setPreview(null);
                message.success("Room updated successfully.")
            }catch {
                message.error("Failed to update room.");
            } finally {
                setLoading(false); // Stop spinner
            }
        }
      };

      const confirmDelete = async (room:RoomType) => {
        try{
            await dispatch(deleteRoom(room.id)).unwrap();
            message.success("Room deleted successfully.")
        }catch {
            message.error("Failed to delete room.")
        }
      };

      const toFormData = (room:RoomType) :FormData => {
        const formData = new FormData();
        formData.append("title", room.title);
        formData.append("heading", room.heading);
        formData.append("price", room.price.toString());
        if (room.image instanceof File) {
        formData.append("image", room.image);
        }
        return formData;
        };
        
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedRoom((prev) =>
          prev ? { ...prev, image: file } : prev
        );
        setPreview(URL.createObjectURL(file));
      }
    },
  });

   useEffect(() => {
  return () => {
    if (preview) URL.revokeObjectURL(preview);
  };
}, [preview]);


     return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Manage Room</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {rooms.map((room: RoomType) => (
  <div key={room.id}> {/* Fixed height container */}
    <RoomCard
      room={room}
      onEditAction={handleEditClick}
      onDeleteAction={confirmDelete}
    />
  </div>
))}

</div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedRoom && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-[700px]">
          <div className="w-full p-4 bg-white rounded-3xl overflow-y-auto">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Edit Room</h2>
            <form className="flex flex-col space-y-4">
              <div>
                <Label>Room Title</Label>
                <Input
                  type="text"
                  value={selectedRoom.title}
                  onChange={(e) =>
                    setSelectedRoom({ ...selectedRoom, title: e.target.value })
                  }
                  placeholder="Room Title"
                  className="border outline-none"
                />
              </div>

              <div>
                <Label>Description</Label>
                <TextArea
                  value={selectedRoom.heading}
                  onChange={(value: string) =>
                    setSelectedRoom({ ...selectedRoom, heading: value })
                  }
                  placeholder="Room Description"
                />
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={selectedRoom.price}
                  onChange={(e) =>
                    setSelectedRoom({
                      ...selectedRoom,
                      price: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Price"
                  className="border outline-none"
                />
              </div>

              <ComponentCard title="Update Image" className="flex-1 ">
  <div
    {...getRootProps()}
    className={`transition border border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-brand-500 p-2 text-center ${
      isDragActive ? "border-brand-500 bg-gray-100" : "bg-gray-50"
    }`}
  >
    <input {...getInputProps()} />
    <div className="flex flex-col items-center justify-center">
      {preview ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
          src={preview}
          alt="Preview"
          fill
          className=" object-contain rounded-lg"
        />
        </div>
        
      ) : (
        <>
          <div className="mb-4 flex justify-center">
            <div className="h-[68px] w-[68px] flex items-center justify-center rounded-full bg-gray-200 text-gray-700">
              <svg
                className="fill-current"
                width="29"
                height="28"
                viewBox="0 0 29 28"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                />
              </svg>
            </div>
          </div>
          <h4 className="mb-2 font-semibold text-gray-800">
            {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
          </h4>
          <p className="text-sm text-gray-700 mb-1">
            Drag and drop PNG, JPG, WebP, SVG images here or browse
          </p>
          <span className="font-medium underline text-theme-sm">
            Browse File
          </span>
        </>
      )}
    </div>
  </div>
</ComponentCard>


              <div className="flex justify-end gap-2 ">
                <Button
                  className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
  className="bg-[#465fff] px-4 py-2 rounded-md cursor-pointer text-white flex items-center justify-center"
  onClick={handleUpdate}
  disabled={loading}
>
  {loading ? <LoadingOutlined style={{ fontSize: 18 }} spin /> : "Update"}
</Button>


              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}