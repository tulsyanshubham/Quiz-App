import { ResultData } from "@/hooks/result-provider";
import { Accordion, AccordionItem } from "@nextui-org/react";

interface AccordionViewerProps {
    data: ResultData[];
    ref?: React.Ref<HTMLDivElement>;
}

export default function AccordionViewer({ data,ref }: AccordionViewerProps) {

    const itemClasses = {
        base: "py-0 w-full bg-gray-900/10 p-3 rounded-lg",
        subtitle: "text-white font-semibold text-lg",
        indicator: "text-xl text-white",
        content: "px-2",
        trigger: "p-2 data-[hover=true]:bg-gray-800/10 rounded-lg flex items-center",
    };

    return (
        <div className="w-full max-w-5xl px-5" ref={ref}>
            <Accordion
                selectionMode="multiple"
                itemClasses={itemClasses}
            >
                {data.map((result, index) => (
                    <AccordionItem
                        key={index}
                        aria-label={`Accordion ${index}`}
                        title={
                            <div className="flex gap-2 font-semibold text-base md:text-lg xl:text-xl">
                                <span className="text-white">
                                    {`Q${index + 1}:`}
                                </span>
                                <span className="text-gray-200">
                                    {`${result.question}`}
                                </span>
                            </div>
                        }
                        // subtitle={
                        //     <div className="flex items-start justify-start gap-2 font-normal text-base md:text-lg xl:text-xl">
                        //         <span className="text-white text-center">
                        //             Your Answer:
                        //         </span>
                        //         <span className="text-gray-200">
                        //             {result.answer_by_user}
                        //         </span>
                        //     </div>
                        // }
                        startContent={
                            <div className="bg-gradient-to-r from-red-200 to-purple-400 dark:from-red-800 dark:to-purple-900 text-black dark:text-white text-xl font-bold w-20 h-10 flex items-center justify-center rounded-full">
                                {`${result.score / 10}`}/10
                            </div>
                        }
                    >
                        <div className="text-base md:text-lg">
                            <strong>Explanation: </strong> {result.explanation}
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
