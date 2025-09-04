'use client'

import { Category } from '@/types/category'
import { useState } from 'react'

interface CategoryCardProps {
    title: string
    icon?: string
    subcategories?: Category[]
}

export default function CategoryCard({ title, icon, subcategories }: CategoryCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Main category button */}
            <button
                className={`rounded-md px-6 py-3 min-w-[200px] text-left border transition-colors flex items-center space-x-2 ${isOpen
                    ? 'bg-yellow-400/60 text-white border-black'
                    : 'bg-white hover:bg-gray-50'
                    }`}
                style={{ fontWeight: 500 }}
            >
                {icon && <span className="text-xl">{icon}</span>}
                <span>{title}</span>
            </button>

            {/* Dropdown list: only show if there are subcategories and hovered */}
            {isOpen && subcategories && subcategories.length > 0 && (
                <div
                    className="absolute left-0 mt-0.5 w-64 bg-white border border-black-200 rounded-lg shadow-lg z-20 transition-all duration-200"
                    style={{ minHeight: 40 * subcategories.length }}
                >
                    <ul className="py-2">
                        {subcategories.map((sub) => (
                            <li
                                key={sub.id}
                                className="px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <span className="text-gray-400">{sub.icon ?? '-'}</span>
                                <span className="text-gray-700">{sub.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
