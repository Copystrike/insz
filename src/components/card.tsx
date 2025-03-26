import type { PropsWithChildren } from 'hono/jsx';
import { create } from 'twind';
import { twindVirtualSheet } from '..';

interface CardProps {
    title?: string;
    className?: string;
}
function Card({ title, children, className = '' }: PropsWithChildren<CardProps>) {
    const { tw } = create({ sheet: twindVirtualSheet });

    return (
        <div className={tw`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
            {title && (
                <div className={tw`bg-gray-50 p-4 sm:p-5 border-b border-gray-200`}>
                    <h3 className={tw`text-lg font-semibold text-gray-800`}>{title}</h3>
                </div>
            )}
            <div className={tw`p-4 sm:p-6`}>
                {children}
            </div>
        </div>
    );
};

export default Card;