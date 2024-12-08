import React from 'react';
import { GoMoon } from 'react-icons/go';
import { IoSunnyOutline } from 'react-icons/io5';
import { useAtom } from 'jotai';
import { themeAtom } from '@/hooks/theme-provider';
import Link from 'next/link';

export default function Header() {
    const [theme, setTheme] = useAtom(themeAtom);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <header className="w-full bg-gray-50 dark:bg-gray-950 shadow-md">
            <nav className="container mx-auto p-4 flex justify-between items-center">
                <Link href='/' className="text-2xl font-bold text-gray-800 dark:text-gray-200">Quiz App</Link>
                <button className={`p-1 dark:hover:bg-gray-700/70 hover:bg-gray-300 rounded-xl`} onClick={toggleTheme}>
                    {theme === "light" ? <GoMoon size={30} color='black' /> : <IoSunnyOutline size={30} color="white" />}
                </button>
            </nav>
        </header>
    );
}