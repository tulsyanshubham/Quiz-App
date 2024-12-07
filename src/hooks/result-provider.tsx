import { atom } from 'jotai';

interface FormData {
    question: string;
    answer_by_user: string;
    explanation: string;
    score: number;
}

export const formDataAtom = atom<FormData[]>([]);