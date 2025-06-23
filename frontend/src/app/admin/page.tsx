"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import { fetchUsers } from "../../redux/users/userSlice";
import { fetchProducts } from "../../redux/product/productSlice";
import { fetchRooms } from "../../redux/rooms/roomSlice";

interface PricedItem {
  price: number;
}

const totalPrice = (items: PricedItem[]) =>
  items.reduce((acc, item) => acc + (item.price || 0), 0).toFixed(2);

interface CardProps {
  title: string;
  count: number;
  price?: string;
  loading: boolean;
  error: string | null;
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  count,
  price,
  loading,
  error,
  onClick,
}: CardProps) => (
  <div
    onClick={onClick}
    className={`bg-white shadow rounded-lg p-6 w-full max-w-md cursor-pointer transition hover:shadow-lg ${
      onClick ? "hover:bg-gray-50" : "cursor-default"
    }`}
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
    {loading ? (
      <p className="text-blue-500">Loading...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      <>
        <p className="text-4xl font-bold text-green-600">{count}</p>
        {price ? (
          <p className="text-sm text-gray-500 mt-1">Total Price: ${price}</p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">Users currently registered</p>
        )}
      </>
    )}
  </div>
);

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { users, loading: userLoading, error: userError } = useAppSelector(
    (state) => state.user
  );
  const {
    products,
    loading: productLoading,
    error: productError,
  } = useAppSelector((state) => state.product);
  const { rooms, loading: roomLoading, error: roomError } = useAppSelector(
    (state) => state.room
  );

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchRooms());

    const intervalId = setInterval(() => {
      dispatch(fetchUsers());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl  text-gray-800">
          Welcome to the Admin Panel
        </h1>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        <DashboardCard
          title="👥 Total Users"
          count={users.length}
          loading={userLoading}
          error={userError}
          onClick={() => router.push("/admin/users")}
        />

        <DashboardCard
          title="🛍️ Total Products"
          count={products.length}
          price={totalPrice(products)}
          loading={productLoading}
          error={productError}
          onClick={() => router.push("/admin/product")}
        />

        <DashboardCard
          title="🛏️ Total Rooms"
          count={rooms.length}
          price={totalPrice(rooms)}
          loading={roomLoading}
          error={roomError}
          onClick={() => router.push("/admin/room")}
        />

      </section>
    </div>
  );
}
