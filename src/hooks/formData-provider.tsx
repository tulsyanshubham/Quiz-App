import { atom } from 'jotai';

interface FormData {
    domain: string;
    topics: string[];
    number_of_questions: number;
}

const defaultTheme : FormData = {
    domain: "",
    topics: [],
    number_of_questions: 5,
};

export const formDataAtom = atom(defaultTheme);