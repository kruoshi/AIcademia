"use client";

import { Book, Calendar, GraduationCap, X } from "lucide-react";
import { motion } from "framer-motion";

type CapstoneSidebarProps = {
    capstone: {
        id: string;
        slug: string;
        title: string;
        keywords: string[];
        specialization: string;
        abstract: string;
        authors: string;
        course: string;
        published_at?: string;
        created_at: string;
    };
    onClose: () => void;
};

const CapstoneSidebar: React.FC<CapstoneSidebarProps> = ({ capstone, onClose }) => {
    console.log("Capstone prop inside Sidebar:", capstone);  // Log the whole capstone object
    console.log("Capstone Abstract:", capstone.abstract);    // Log the abstract specifically

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
        >
            <div className="bg-secondary p-4 flex justify-between items-center">
                <span className="font-bold text-sm sm:text-base text-gray-900">
                    Academic Work Preview
                </span>
                <button onClick={onClose} aria-label="Close Sidebar">
                    <X className="w-5 h-5 text-gray-800 hover:text-red-600" />
                </button>
            </div>

            <div className="p-6 font-roboto text-sm text-gray-800">
                <h2 className="text-lg font-bold mb-1 leading-snug">
                    {capstone.title}
                </h2>
                <h4 className="text-xs font-medium mb-1 leading-snug">
                    {capstone.authors && Array.isArray(capstone.authors) && capstone.authors.length > 0 ? (
                        <div className="space-y-1">
                            <h3 className="font-semibold">Authors</h3>
                            <ul className="list-disc list-inside text-sm">
                            {capstone.authors.map((author: any, index: number) => (
                                <li key={index}>
                                {author.name} — {author.email}
                                </li>
                            ))}
                            </ul>
                        </div>
                        ) : (
                        <p className="text-sm italic text-gray-500">No authors listed.</p>
                        )}

                </h4>

                <div className="space-y-2 mt-3 text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">
                            BS {capstone.course}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Book className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">
                            {capstone.specialization}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">
                            {new Date(capstone.created_at).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                },
                            )}
                        </span>
                    </div>
                </div>

                <div className="border-t border-gray-300 my-5" />

                <h3 className="font-bold text-base mb-2">Abstract</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    {capstone.abstract}
                </p>

                <button className="mt-6 w-full bg-secondary text-gray py-2 rounded-md font-semibold hover:opacity-90 transition text-sm">
                    More Details
                </button>
            </div>
        </motion.div>
    );
};

export default CapstoneSidebar;
