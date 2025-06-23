"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Popconfirm } from "antd";
import Image from "next/image";
interface RoomType{
  id: number;
  title: string;
  heading: string;
  price: number;
  image: string | File;
}

interface Props {
  room: RoomType;
  onEditAction: (room:RoomType) => void;
  onDeleteAction: (room:RoomType) => void;
}

export default function RoomCard({room, onEditAction, onDeleteAction}:Props){
    const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);
    return(
        <div className="p-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition flex flex-col justify-between h-full">
          <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                <Image
                  src={typeof room.image === "string" ? room.image : ""}
                  fill
                  alt={room.title}
                  className="object-cover"
                />
          </div>
      

      <h2 className="text-lg font-semibold text-gray-800">{room.title}</h2>

      {/* Paragraph Container with fixed height */}
      <div className="relative mt-2 text-sm text-gray-600 h-16">
        <div
          className={`w-full h-full transition-all duration-300 ${
            isExpanded ? "overflow-y-auto pr-2" : "overflow-hidden"
          }`}
        >
          {room.heading}
        </div>

        {/* Fade effect when not expanded */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle Button */}
      {room.heading.length > 100 && (
        <button
          className="text-blue-600 text-xs underline mt-1 focus:outline-none cursor-pointer"
          onClick={toggleExpand}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3">
        <p className="font-mono text-brand-600 text-[20px]">${room.price}</p>

        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition cursor-pointer"
            onClick={() => onEditAction(room)}
          >
            <Pencil size={16} />
          </button>
          <Popconfirm
            title={`Delete ${room.title}?`}
            description="Are you sure you want to delete this product?"
            onConfirm={() => onDeleteAction(room)}
            okText="Yes"
            cancelText="No"
          >
            <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition cursor-pointer">
              <Trash2 size={16} />
            </button>
          </Popconfirm>
        </div>
      </div>
    </div>
    )
}