/**
 * Normalizes a phone number to E.164 format
 * @param {string} mobile - The raw mobile number string
 * @param {string} defaultCountryCode - Default country code if not present (default: '+91')
 * @returns {string} - The normalized phone number in E.164 format
 */
const normalizePhoneNumber = (mobile, defaultCountryCode = '+91') => {
    if (!mobile) return '';

    // Remove all non-numeric characters except +
    let cleaned = mobile.replace(/[^\d+]/g, '');

    // If it starts with +, return as is (assuming E.164)
    if (cleaned.startsWith('+')) {
        return cleaned;
    }

    // If it doesn't start with +, add default country code
    // Special handling for common Indian format (10 digits)
    if (cleaned.length === 10 && defaultCountryCode === '+91') {
        return `+91${cleaned}`;
    }

    // Fallback: just prepend + if not there, or assume default country code
    return `${defaultCountryCode}${cleaned.replace(/^0+/, '')}`;
};

module.exports = {
    normalizePhoneNumber
};
