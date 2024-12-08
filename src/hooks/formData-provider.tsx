import { atom } from 'jotai';

interface FormData {
    domain: string;
    topics: string[];
    number_of_questions: number;
    difficulty?: string;
}

const defaultData : FormData = {
    domain: "",
    topics: [],
    number_of_questions: 5,
    difficulty: "medium"
};

export const formDataAtom = atom(defaultData);