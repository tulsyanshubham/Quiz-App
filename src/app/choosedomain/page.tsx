"use client";
import React, { use, useEffect, useState } from 'react';
import { selectForm } from '@/assets/formData';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { formDataAtom } from '@/hooks/formData-provider';
import Header from '@/components/Header';
import { themeAtom } from '@/hooks/theme-provider';
import Frame from '@/components/Frame';

export default function Page() {
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [formData, setFormData] = useAtom(formDataAtom);
    const router = useRouter();

    const [siteTheme] = useAtom(themeAtom)

    useEffect(() => {
        setOptions(selectForm.map((data) => data.domain));
    }, []);

    useEffect(() => {
        if (siteTheme === 'dark')
            document.body.classList.add("dark");
        else
            document.body.classList.remove('dark');
        return () => {
            document.body.classList.remove(siteTheme);
        }
    }, [siteTheme]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormData({ domain: selectedOption, topics: [], number_of_questions: formData.number_of_questions });
        router.push('/choosetopic');
    }

    return (
        <Frame className='justify-center'>
            <div className="text-4xl font-bold text-center pb-6">Select Your Quiz Domain</div>
            {options.length > 0 && (
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center text-gray-800 dark:text-gray-100">
                    <div className="w-2/3 flex flex-col items-center justify-center gap-4 py-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                        <div className="flex flex-wrap items-center justify-center gap-5 py-3">
                            {options.map((option) => (
                                <label key={option} className={`w-[80%] md:w-[40%] xl:w-[28%] text-center text-2xl py-2 px-3 border-2 rounded-lg cursor-pointer transition duration-300 ${selectedOption === option ? "bg-blue-300 dark:bg-blue-700" : "bg-gray-200 dark:bg-gray-700"}`}>
                                    <input
                                        type="radio"
                                        value={option}
                                        checked={selectedOption === option}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                        <button type="submit" className="text-xl px-8 py-3 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-full shadow-lg transition duration-300">Next</button>
                    </div>
                </form>
            )}
        </Frame>
    );
}