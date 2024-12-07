"use client";
import React, { useEffect, useState } from 'react';
import { selectForm } from '@/assets/formData';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { formDataAtom } from '@/hooks/formData-provider';
import { themeAtom } from '@/hooks/theme-provider';
import Header from '@/components/Header';
import Frame from '@/components/Frame';

export default function TopicForm() {
    const [formData, setFormData] = useAtom(formDataAtom);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string[]>([]);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(formData.number_of_questions);
    const router = useRouter();

    useEffect(() => {
        if (formData.domain === "") {
            router.push('/');
        }
        setOptions(selectForm.find((data) => data.domain === formData.domain)?.topics || []);
    }, [formData.domain]);

    const [siteTheme] = useAtom(themeAtom)
    useEffect(() => {
        if (siteTheme === 'dark')
            document.body.classList.add("dark");
        else
            document.body.classList.remove('dark');
        return () => {
            document.body.classList.remove(siteTheme);
        }
    }, [siteTheme]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormData({ domain: formData.domain, topics: selectedOption, number_of_questions: numberOfQuestions });
        router.push('/test');
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedOption([...selectedOption, event.target.value]);
        } else {
            setSelectedOption(selectedOption.filter((topic) => topic !== event.target.value));
        }
    };

    return (
        <Frame>
            <div className="text-4xl font-bold text-center pb-6">Choose Your Quiz Topics</div>
            {options.length > 0 && (
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center text-gray-800 dark:text-gray-100">
                    <div className="w-4/5 flex flex-col items-center justify-center gap-4 py-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                        <div className="flex flex-wrap items-center justify-center gap-5 py-3">
                            {options.map((option) => (
                                <label key={option} className={`w-[28%] text-center text-2xl py-2 px-3 border-2 rounded-lg cursor-pointer transition duration-300 ${selectedOption.includes(option) ? "bg-blue-300 dark:bg-blue-700" : "bg-gray-200 dark:bg-gray-700"}`}>
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={selectedOption.includes(option)}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                        <div className="text-2xl flex gap-7 items-center">
                            <label>Number of questions: {numberOfQuestions}</label>
                            <input type="range" min={1} max={20} className="w-56" value={numberOfQuestions} onChange={(e) => { setNumberOfQuestions(parseInt(e.target.value)) }} />
                        </div>
                        <button type="submit" className="text-xl px-8 py-3 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-full shadow-lg transition duration-300">Next</button>
                    </div>
                </form>
            )}
        </Frame>
    );
}