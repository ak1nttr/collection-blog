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
            <div className="flex items-center justify-center">
                <div
                    ref={modalRef}
                    className="bg-white rounded-xl shadow-xl p-1 flex items-center gap-1 w-80">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ara..."
                        className="flex-1  rounded-xl px-2 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-100 h-9"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
                    >
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
