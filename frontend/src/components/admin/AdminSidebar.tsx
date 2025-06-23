'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaChair, FaDoorOpen, FaSignOutAlt, FaUsers  } from 'react-icons/fa';
 // adjust this path

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

const handleLogout = async () => {
  router.push('/');
};

  const isActive = (path: string) => pathname === `/admin${path}`;

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col p-4 h-screen">
      <h1 className="text-2xl font-bold text-[#455CE9] mb-6">Admin Panel</h1>
      <nav className="flex flex-col space-y-4 text-gray-700">
        <Link
          href="/admin"
          className={`flex items-center space-x-3 px-4 py-2 rounded-md transition ${
            isActive('') ? 'bg-[#455CE9] text-white' : 'hover:bg-[#afc5fc]'
          }`}
        >
          <FaHome /> <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/product"
          className={`flex items-center space-x-3 px-4 py-2 rounded-md transition ${
            isActive('/products') ? 'bg-[#455CE9] text-white' : 'hover:bg-[#afc5fc]'
          }`}
        >
          <FaChair /> <span>Products</span>
        </Link>
        <Link
          href="/admin/room"
          className={`flex items-center space-x-3 px-4 py-2 rounded-md transition ${
            isActive('/rooms') ? 'bg-[#455CE9] text-white' : 'hover:bg-[#afc5fc]'
          }`}
        >
          <FaDoorOpen /> <span>Rooms</span>
        </Link>
        <Link
          href="/admin/users"
          className={`flex items-center space-x-3 px-4 py-2 rounded-md transition ${
            isActive('/users') ? 'bg-[#455CE9] text-white' : 'hover:bg-[#afc5fc]'
          }`}
        >
          <FaUsers /> <span>Users</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
