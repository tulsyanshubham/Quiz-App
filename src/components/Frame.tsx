import React, { ReactNode } from 'react';
import Header from './Header';

export default function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-700 dark:to-gray-900">
            <Header />
            <div className={`h-full flex flex-col items-center flex-grow text-white dark:text-gray-200 py-8 ${className}`}>
                {children}
            </div>
        </div>
    )
}
