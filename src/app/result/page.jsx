"use client";
import React, { useEffect } from 'react';
import PieChartViewer from '@/components/PieChart';
import { useAtom } from 'jotai';
import { themeAtom } from '@/hooks/theme-provider';
import AccordionViewer from '@/components/Accordian';
import Frame from '@/components/Frame';
import { resultDataAtom } from '@/hooks/result-provider';
import { useRouter } from 'next/navigation';

export default function ResultPage() {

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
    
    const [results] = useAtom(resultDataAtom);
    const router = useRouter();
    useEffect(() => {
        if(results.length === 0){
            router.push('/');
        }
        console.log(results)
    }, [])


    const totalScore = results.reduce((acc, result) => acc + result.score, 0);
    const percentageScore = (totalScore / (results.length));

    return (
        <Frame className="justify-start">
            <PieChartViewer correct={percentageScore} heading={"Quiz Result"} />
            <AccordionViewer data={results} />
        </Frame>
    );
}