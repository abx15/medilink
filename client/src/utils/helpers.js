import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge tailwind classes safely
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to human readable string
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Get color based on severity
 */
export const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
        case 'critical': return 'bg-red-100 text-red-700 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'moderate': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'low': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};
