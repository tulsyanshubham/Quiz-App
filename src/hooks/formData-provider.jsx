import { atom } from 'jotai';

const defaultData = {
    domain: "",
    topics: [],
    number_of_questions: 5,
    difficulty: "medium"
};

export const formDataAtom = atom(defaultData);