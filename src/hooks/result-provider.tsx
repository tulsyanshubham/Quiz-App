import { atom } from 'jotai';

export interface ResultData {
    question: string;
    answer_by_user: string;
    explanation: string;
    score: number;
}

export const resultDataAtom = atom<ResultData[]>([]);