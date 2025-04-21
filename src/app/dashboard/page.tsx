'use client';

import {useState} from 'react';
import Link from 'next/link';
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { AiOutlineDesktop } from "react-icons/ai";
import { MdHome } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";
import SideBar from "@/components/SideBar";

export default function Dashboard() {
    const [users, setUsers] = useState(1);
    const [saved, setSaved] = useState(1);

    const staffList = [
        { name: "Jack", email: "name@example.com", createDate: "00000", role: "Ferry operator" },
        { name: "Jill", email: "name@example.com", createDate: "00000", role: "Theme park entrance" }
    ];

    return (
        <div className="relative w-full min-h-screen bg-gray-50">
            <div className='flex'>
                <SideBar />
                <div className='flex-1 p-8'>
                    <div className='flex justify-between items-center mb-4'>
                        <div>
                            <h1 className='text-xl font-semibold text-gray-800'>Hello, Admin</h1>
                            <p className='text-gray-600'>Have a nice day</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center gap-2'>
                                <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
                                <div className='text-right'>
                                    <p className='font-semibold text-black'>Admin-name</p>
                                    <p className='text-sm text-gray-600'>Admin</p>
                                </div>
                            </div>
                            <button className='p-2 text-black'><BsChevronDown /></button>
                        </div>
                    </div>

                    <h1 className='text-2xl font-bold text-gray-800 mb-6'>Admin Dashboard</h1>

                    <div className='bg-white rounded-lg p-6 shadow-sm'>
                        <div className='flex justify-between items-center mb-6'>
                            <div className='flex-1 max-w-xl'>
                                <div className='relative'>
                                    <input 
                                        type="text" 
                                        placeholder="Search" 
                                        className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#8B4513]'
                                    />
                                    <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                <button className='bg-[#8B4513] text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                                    Add Staff <span>+</span>
                                </button>
                                <button className='text-gray-600 px-4 py-2 border rounded-lg'>Sort by</button>
                                <button className='text-gray-600 px-4 py-2 border rounded-lg'>Saved search</button>
                                <button className='p-2 border rounded-lg text-black'><LuSettings2 /></button>
                            </div>
                        </div>

                        <div className='mt-6'>
                            <h2 className='text-lg font-semibold mb-4 text-black'>List Hotel staffs</h2>
                            <table className='w-full'>
                                <thead>
                                    <tr className='text-left text-gray-600 border-b'>
                                        <th className='pb-3'>Name</th>
                                        <th className='pb-3'>Email</th>
                                        <th className='pb-3'>Create Date</th>
                                        <th className='pb-3'>Role</th>
                                        <th className='pb-3'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffList.map((staff, index) => (
                                        <tr key={index} className='border-b'>
                                            <td className='py-4'>
                                                <div className='flex items-center gap-3 text-black'>
                                                    {staff.name}
                                                    <span className='px-3 py-1 bg-[#8B4513] text-white text-sm rounded-[15px]'>Staff</span>
                                                </div>
                                            </td>
                                            <td className='py-4 text-black'>{staff.email}</td>
                                            <td className='py-4 text-black'>{staff.createDate}</td>
                                            <td className='py-4 text-black'>{staff.role}</td>
                                            <td className='py-4 text-black'>
                                                <div className='flex gap-2'>
                                                    <button className='p-2 text-blue-600 hover:bg-blue-50 rounded'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button className='p-2 text-red-600 hover:bg-red-50 rounded'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}