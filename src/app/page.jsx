"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { themeAtom } from '@/hooks/theme-provider';
import Frame from '@/components/Frame';

export default function Home() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push('/choosedomain');
  };

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


  return (
    <Frame className='justify-center'>
      <h1 className="text-6xl text-center font-bold mb-8 px-2">Welcome to the Quiz App</h1>
      <p className="text-2xl text-center mb-12 px-2">Test your knowledge with our fun and interactive quizzes!</p>
      <button
        onClick={handleStartQuiz}
        className="text-xl text-gray-800 px-8 py-4 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-full shadow-lg transition duration-300"
      >
        Take a Quiz
      </button>
    </Frame>
  );
}