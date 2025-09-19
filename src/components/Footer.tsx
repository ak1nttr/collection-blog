import React from "react";

type FooterProps = {
    email: string;
    githubUrl: string;
};

export default function Footer({ email, githubUrl }: FooterProps) {
    return (
        <footer className="border-t border-yellow-200 bg-transparent">
            <div className="mx-auto max-w-6xl px-2 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Koleksiyon Galerim
                </p>

                <div className="flex items-center gap-6">
                    <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        aria-label="Send email"
                    >
                        {/* Email icon */}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 0 8 6 8-6"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>{email}</span>
                    </a>

                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        aria-label="Geliştirici"
                    >
                        {/* GitHub icon */}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.4 1.23-3.24-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.92 1.23 3.24 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5z" />
                        </svg>
                        <span>Geliştirici</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}