import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: PaginationLink[];
}

export default function Pagination({ links }: Props) {
    return (
        <div className="flex flex-wrap justify-center gap-2">
            {links.map((link, key) => {
                if (!link.url && link.label === '...') {
                    return (
                        <span
                            key={key}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-default leading-5 rounded-md"
                        >
                            ...
                        </span>
                    );
                }

                const className = `relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-success focus:border-success ${
                    link.active
                        ? 'z-10 bg-success border-success text-white hover:bg-success-dark'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`;

                if (!link.url) {
                    return (
                        <span
                            key={key}
                            className={className}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        className={className}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
