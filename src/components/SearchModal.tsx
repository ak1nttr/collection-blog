"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
    isOpen: boolean;
    onClose?: () => void;
    buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function SearchModal({ isOpen, onClose, buttonRef }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();
    const modalRef = useRef<HTMLDivElement>(null);

    const handleSearch = () => {
        if (query.trim()) {
            onClose && onClose();
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                buttonRef?.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                onClose && onClose();
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;

    return (
        <div>
            <div className="flex items-center justify-center pr-15">
                <div
                    ref={modalRef}
                    className="bg-white rounded-xl shadow-xl px-1 flex flex-row items-center gap-1 w-48 sm:w-56">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ara..."
                        className="bg-transparent px-2 py-2 focus:outline-none focus:ring-0 h-9 w-28 sm:w-40 md:w-56 lg:w-72"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
                    >
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
