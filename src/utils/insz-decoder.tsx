// src/utils/inszDecoder.tsx

// Keep the DecodedInfo interface, but modify potential string types
export interface DecodedInfo {
    isValidFormat: boolean;
    simulatedBirthDate?: string; // Keep as string, constructed directly
    simulatedGenderKey?: 'common.male' | 'common.female'; // Use key
    simulatedSequence?: string; // Keep as string
    simulatedChecksumValid?: boolean;
    errorKey?: 'decode.errorInvalidFormat'; // Use key for errors
}

// --- VERY IMPORTANT DISCLAIMER ---
// This function is a *SIMULATION ONLY*. It does NOT accurately decode
// a real Belgian INSZ number (Rijksregisternummer) according to official algorithms.
// It performs basic format checks and returns *HARDCODED, GENERIC* examples.
// Do NOT use this for any real data processing.
// ---------------------------------
export const simulateDecodeINSZ = (insz: string): DecodedInfo => { // Renamed parameter
    const cleanedInsz = insz.replace(/[\s.-]/g, ''); // Renamed variable

    // Check if it looks like an 11-digit number
    if (!/^\d{11}$/.test(cleanedInsz)) {
        // Return the error key
        return { isValidFormat: false, errorKey: 'decode.errorInvalidFormat' };
    }

    const yearPart = cleanedInsz.substring(0, 2);
    const monthPart = cleanedInsz.substring(2, 4);
    const dayPart = cleanedInsz.substring(4, 6);
    const sequencePart = cleanedInsz.substring(6, 9);
    // const checksumPart = cleanedInsz.substring(9, 11); // Not used in simulation

    const month = parseInt(monthPart, 10);
    const day = parseInt(dayPart, 10);
    const sequence = parseInt(sequencePart, 10);

    // Basic sanity check for date components (allows BIS number months)
    if (month < 1 || (month > 12 && month < 21) || (month > 32 && month < 41) || month > 52 || day < 1 || day > 31) {
        // Lenient for simulation, no error thrown here
    }

    // --- SIMULATED DATA ---
    const currentYearLastTwoDigits = new Date().getFullYear() % 100;
    const inputYear = parseInt(yearPart, 10);
    // Simple guess for century - highly inaccurate but for simulation.
    const simulatedCentury = inputYear > currentYearLastTwoDigits ? '19' : '20';
    const simulatedFullYear = simulatedCentury + yearPart;

    // Use keys for gender based on sequence number parity
    const simulatedGenderKey: 'common.male' | 'common.female' =
        sequence % 2 !== 0 ? 'common.male' : 'common.female';

    // Checksum simulation - always true if format looks okay
    const simulatedChecksumValid = true;

    return {
        isValidFormat: true,
        // Construct date string directly
        simulatedBirthDate: `~ ${dayPart}/${monthPart}/${simulatedFullYear}`,
        simulatedGenderKey: simulatedGenderKey,
        simulatedSequence: `${sequencePart}`,
        simulatedChecksumValid: simulatedChecksumValid,
    };
};