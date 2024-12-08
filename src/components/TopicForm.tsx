"use client";
import React, { useEffect, useState } from 'react'
import { selectForm } from '@/assets/formData'
import { useFormData } from '@/context/formData-provider';

export default function TopicForm() {
    const { formData, setFormData } = useFormData();
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string[]>([]);

    useEffect(() => {
        setOptions(selectForm.find((data) => data.domain === formData.domain)?.topics || []);
    }, [formData.domain]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(formData);
        setFormData({ domain: formData.domain, topics: selectedOption });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedOption([...selectedOption, event.target.value]);
        } else {
            setSelectedOption(selectedOption.filter((topic) => topic !== event.target.value));
        }
    };

    return (
        <div>
            {options.length > 0 && (
                <form onSubmit={handleSubmit}>
                    {options.map((option) => (
                        <div key={option} className=''>
                            <label>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedOption.includes(option)}
                                    onChange={handleChange}
                                />
                                {option}
                            </label>
                        </div>
                    ))}
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    )
}
