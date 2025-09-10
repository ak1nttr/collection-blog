'use client'

import { Category } from '@/types/category'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface CategoryCardProps {
    title: string
    icon?: string
    subcategories?: Category[]
}

export default function CategoryCard({ title, icon, subcategories }: CategoryCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleDropdown = () => setIsOpen((prev) => !prev)

    const forwardToSearchPage = (category?: string) => {
        router.push(`/search?q=${encodeURIComponent(category || title)}`)
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => !isMobile && setIsOpen(true)}
            onMouseLeave={() => !isMobile && setIsOpen(false)}
        >
            {/* Main category button */}
            <button
                className={`rounded-md px-6 py-3 min-w-[150px] h-10 text-left cursor-pointer border transition-colors flex items-center space-x-2 ${isOpen
                    ? 'bg-yellow-400/60 text-white border-black'
                    : 'bg-white hover:bg-gray-50'
                    }`}
                style={{ fontWeight: 500 }}
                onClick={() => forwardToSearchPage()}
            >
                {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
                <span className="whitespace-nowrap">{title}</span>
                {(isMobile && subcategories && subcategories.length > 0) && (
                    <span 
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleDropdown()
                        }} 
                        className="ml-auto">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                        </svg>
                    </span>
                )}
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
                                onClick={() => forwardToSearchPage(sub.title)}
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