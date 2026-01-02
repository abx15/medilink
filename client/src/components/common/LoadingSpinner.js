import React from 'react';
import { cn } from '../../utils/helpers';

const LoadingSpinner = ({ className, size = 'medium' }) => {
    const sizes = {
        small: 'h-4 w-4 border-2',
        medium: 'h-8 w-8 border-3',
        large: 'h-12 w-12 border-4'
    };

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <div
                className={cn(
                    "animate-spin rounded-full border-primary-500 border-t-transparent",
                    sizes[size]
                )}
            />
        </div>
    );
};

export default LoadingSpinner;
