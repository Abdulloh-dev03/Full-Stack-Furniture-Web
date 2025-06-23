"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./table";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../../redux/app/hook";
import { fetchUsers } from "../../../redux/users/userSlice";

export default function AdminUsersTable() {
  const dispatch = useAppDispatch();

  const { users, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-600 text-lg">
        Loading users...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-600 text-lg">
        Error: {error}
      </p>
    );
  }

  if (!users || users.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        No users found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm max-w-7xl mx-auto">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 bg-gray-50">
            <TableRow>
              <TableCell
                isHeader
                className="px-6 py-4 text-start text-gray-700 font-semibold text-sm uppercase tracking-wide"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-start text-gray-700 font-semibold text-sm uppercase tracking-wide"
              >
                Email
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {users.map(({ id, name, email, profilePic }) => (
              <TableRow
                key={id}
                className="hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <TableCell className="px-6 py-4 text-start">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
                      <Image
                        src={profilePic || "/images/default-avatar.png"}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        priority={true}
                      />
                    </div>
                    <span className="font-medium text-gray-900 text-base truncate max-w-xs">
                      {name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4 text-gray-600 text-sm truncate max-w-xs">
                  {email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
