"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Popconfirm } from "antd";
import Image from "next/image";
interface ProductType {
  id: number;
  title: string;
  paragraph: string;
  price: number;
  image: string | File;
}

interface Props {
  product: ProductType;
  onEdit: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition flex flex-col justify-between h-full">
   <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
  <Image
    src={typeof product.image === "string" ? product.image : ""}
    alt={product.title}
    fill
    className="object-cover"
  />
</div>



      <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>

      {/* Paragraph Container with fixed height */}
      <div className="relative mt-2 text-sm text-gray-600 h-16">
        <div
          className={`w-full h-full transition-all duration-300 ${
            isExpanded ? "overflow-y-auto pr-2" : "overflow-hidden"
          }`}
        >
          {product.paragraph}
        </div>

        {/* Fade effect when not expanded */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle Button */}
      {product.paragraph.length > 100 && (
        <button
          className="text-blue-600 text-xs underline mt-1 focus:outline-none cursor-pointer"
          onClick={toggleExpand}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3">
        <p className="font-mono text-brand-600 text-[20px]">${product.price}</p>

        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition cursor-pointer"
            onClick={() => onEdit(product)}
          >
            <Pencil size={16} />
          </button>
          <Popconfirm
            title={`Delete ${product.title}?`}
            description="Are you sure you want to delete this product?"
            onConfirm={() => onDelete(product)}
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
  );
};

export default ProductCard;

