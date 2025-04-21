import {useState} from 'react';
import Link from 'next/link';
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { AiOutlineDesktop } from "react-icons/ai";
import { MdHome } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { FaSearch, FaUserFriends, FaHotel } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";


export default function SideBar(){
    const [open, setOpen] = useState(true);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const Menus = [
        {title: "Dashboard"},
        {
            title: "Users",
            submenu: true,
            submenuItems: [
                {title: 'Themepark Owners'},
                {title: 'Ferry Operators'},
                {title: 'Beach Owners'},
                {title: 'Customers'},
            ]
        },
        {title: "Hotel Owners"},
        {title: "Booking Details"},
        {title: "Refunds"},

        {title: "Messages", spacing: true},
        {title: "Help"},
        {title: "Settings"},
    ]

    const [users, setUsers] = useState(1);
    const [saved, setSaved] = useState(1);

return (
    
        <div className='flex'>

            {/* Sidebar section start*/}
            <section className={`bg-white text-black h-screen p-5 pt-8 ${open ? "w-72" : "w-20" } duration-300 relative`}>
                <BsArrowLeftShort className={`bg-green-700 text-white text-3xl rounded-full absolute -right-3 top-9 border border-blue-400 cursor-pointer ${!open && "rotate-180"}`} onClick={() => setOpen(!open)} />
                <div className='inline-flex'>
                    {/* <h1 className='bg-green-600 text-4xl rounded font-bold'>JoaliStay</h1> */}

                    <Link href= "/">
                    <MdHome className={`text-4xl cursor-pointer block float-left mr-2 duration-500 ${open && "rotate-[360deg]"}`} />
                    </Link>
                    <Link  href="/" className={`hover:text-opacity-80  text-4xl rounded font-bold block float-left duration-300 ${!open && "scale-0"}`}>JoaliStay</Link>
                </div>


                {/* <ul className='pt-10'>
                    {Menus.map((menu, index) => (
                        <>
                            <li key = {index} className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
                                
                                <span className='text-2xl block float-left'>
                                    <RxDashboard />
                                </span>

                                <span className={`text-base font-medium flex-1 duration-200 ${!open && "hidden"}`}>
                                    {menu.title}
                                </span>
                                    {menu.submenu && open && (
                                        <BsChevronDown className={`${submenuOpen && "rotate-180"}`} onClick={()=>
                                            setSubmenuOpen(!submenuOpen)} />
                                    )}
                            </li>
                            {menu.submenu && submenuOpen && open && (
                                <ul>
                                    {menu.submenuItems.map((submenuItem, index)=>(
                                        <li key={index} className={`text-gray-700 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-gray-200 rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
                                            {submenuItem.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ))}
                </ul> */}


                <ul className='pt-10'>
                    <Link href="/dashboard">
                    <li className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}> <RxDashboard className='text-2xl block float-left mt-2' /> 
                                <span className={`text-base font-medium mt-2  flex-1 duration-200 ${!open && "hidden"}`}>
                                    Dashboard
                                </span>
                    </li>
                    </Link>

                    <Link href="/users">
                    <li className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}> <FaUserFriends  className='text-2xl block float-left mt-3' /> 
                                <span className={`text-base font-medium mt-3  flex-1 duration-200 ${!open && "hidden"}`}>
                                    Users
                                </span>
                    </li>
                    </Link>

                    <li className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}> <FaHotel className='text-2xl block float-left mt-3' /> 
                                <span className={`text-base font-medium mt-3  flex-1 duration-200 ${!open && "hidden"}`}>
                                    Hotel Owners
                                </span>
                    </li>
                </ul>
            </section>
            {/* Sidebar section end*/}
        </div>
    
)
}; 
    