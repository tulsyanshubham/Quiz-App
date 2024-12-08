"use client";
import React, { Fragment, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import PieChartViewer from '@/components/PieChart';
import { useAtom } from 'jotai';
import { themeAtom } from '@/hooks/theme-provider';
import AccordionViewer from '@/components/Accordian';
import Frame from '@/components/Frame';
import { revealOptions } from "@/constants/scrollRevealOptions";
import { resultDataAtom } from '@/hooks/result-provider';

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

    const fromTop = useRef(null)
    const fromBottom = useRef(null)
    useEffect(() => {
        async function animate() {
            const sr = (await import("scrollreveal")).default
            if (fromTop.current) {
                sr(revealOptions).reveal(fromTop.current, { origin: 'top' })
            }
            if (fromBottom.current) {
                sr(revealOptions).reveal(fromBottom.current, { origin: 'bottom' })
            }
        }
        animate()
    }, [])

    const [results] = useAtom(resultDataAtom);

    const totalScore = results.reduce((acc, result) => acc + result.score, 0);
    const percentageScore = (totalScore / (results.length));

    return (
        <Frame className="justify-start">
            <PieChartViewer correct={percentageScore} heading={"Quiz Result"} />
            <AccordionViewer data={results} ref={fromBottom} />
        </Frame>
    );
}