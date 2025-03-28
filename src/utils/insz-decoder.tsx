// ../../utils/insz-decoder.ts

// --- Type Definitions ---

export type InszAlgorithm = "auto" | "19xx" | "20xx";
export type ResultStatus = "valid" | "checksum_invalid" | "checksum_missing";

// DecodedInfoFatalError remains the same
export interface DecodedInfoFatalError {
    input: string;
    errorKey: "INVALID_INPUT_TYPE" | "INVALID_LENGTH" | "INVALID_FORMAT" | "INVALID_SEQUENCE" | "INVALID_DATE" | "DATE_IN_FUTURE";
    status: "error"; // <-- ADDED 'status' property here
    lengthFound?: number;
    invalidSequenceValue?: number;
    dateParts?: { yy: string; mm: string; dd: string; year?: number; };
    components?: { datePart?: string; sequencePart?: string; checksumPart?: string; };
}

export interface DecodedInfoResult {
    input: string;
    errorKey: undefined;
    status: ResultStatus;
    isValidFormat: true;
    simulatedBirthDate?: string;
    simulatedGenderKey?: "common.male" | "common.female";
    simulatedSequence?: number;
    simulatedChecksumValid?: boolean; // true | false | undefined
    calculatedChecksum?: number; // The expected checksum for the determined/assumed year
    // ADDED: Always include both calculated possibilities for context, especially on error
    expectedChecksum19xx?: number;
    expectedChecksum20xx?: number;
    birthYear?: number;
    birthOrder?: number;
    components: {
        datePart: string;
        sequencePart: string;
        checksumPart?: string;
    };
    algorithmUsed: InszAlgorithm;
    suggestedAlgorithm?: "19xx" | "20xx";
    guessedYear?: boolean;
}

export type DecodedInfo = DecodedInfoResult | DecodedInfoFatalError;

// --- Main Decoding Function ---

export function simulateDecodeINSZ(insz: string, algorithm: InszAlgorithm = "auto"): DecodedInfo {
    const originalInput = insz;

    // --- Input validation (unchanged) ---
    if (typeof insz !== "string") {
        return { input: originalInput, errorKey: "INVALID_INPUT_TYPE", status: "error" };
    }
    const cleanedInsz = insz.replace(/[.\s-]/g, "");
    const inputLength = cleanedInsz.length;
    if (inputLength !== 9 && inputLength !== 11) {
        return { input: originalInput, errorKey: "INVALID_LENGTH", status: "error", lengthFound: inputLength };
    }
    const requiredLengthForRegex = inputLength === 9 ? 9 : 11;
    const formatRegex = new RegExp(`^\\d{${requiredLengthForRegex}}$`);
    if (!formatRegex.test(cleanedInsz)) {
        return { input: originalInput, errorKey: "INVALID_FORMAT", status: "error" };
    }

    // --- Extract parts (unchanged) ---
    const datePart = cleanedInsz.substring(0, 6);
    const sequencePart = cleanedInsz.substring(6, 9);
    const checksumPart = inputLength === 11 ? cleanedInsz.substring(9, 11) : undefined;
    const components = { datePart, sequencePart, checksumPart };
    const yy = datePart.substring(0, 2);
    const mm = datePart.substring(2, 4);
    const dd = datePart.substring(4, 6);
    const sequence = parseInt(sequencePart, 10);
    const checksum = checksumPart ? parseInt(checksumPart, 10) : undefined;
    const moduloCheckString = datePart + sequencePart;

    // --- Sequence validity check (unchanged) ---
    if (isNaN(sequence) || sequence < 1 || sequence > 998) {
        return { input: originalInput, errorKey: "INVALID_SEQUENCE", status: "error", invalidSequenceValue: sequence, components: components };
    }

    // --- Always calculate both expected checksums ---
    const baseNum19xx = parseInt(moduloCheckString, 10);
    const expectedChecksum19xx = 97 - (baseNum19xx % 97);
    const baseNum20xx = parseInt("2" + moduloCheckString, 10);
    const expectedChecksum20xx = 97 - (baseNum20xx % 97);

    // --- Determine Year and Checksum Status based on Algorithm ---
    let birthYear: number;
    let isValidChecksum: boolean | undefined = checksum !== undefined ? false : undefined;
    let status: ResultStatus = checksum !== undefined ? "checksum_invalid" : "checksum_missing";
    let calculatedChecksumForYear: number | undefined = undefined; // Expected for the final selected/guessed year
    let guessedYear = false;
    let suggestedAlgorithm: "19xx" | "20xx" | undefined = undefined;

    const currentYearLastTwo = new Date().getFullYear() % 100;
    const inputYearNum = parseInt(yy, 10);
    const canGuessYear = !isNaN(inputYearNum);
    const guessBirthYear = (): number => {
        guessedYear = true;
        if (canGuessYear) {
            return inputYearNum <= currentYearLastTwo + 5 ? parseInt("20" + yy, 10) : parseInt("19" + yy, 10);
        }
        return parseInt("19" + yy, 10); // Default guess
    };

    // --- Strict Algorithm Enforcement Logic ---
    if (algorithm === "19xx") {
        birthYear = parseInt("19" + yy, 10);
        calculatedChecksumForYear = expectedChecksum19xx;
        if (checksum !== undefined && checksum === expectedChecksum19xx) {
            isValidChecksum = true;
            status = "valid";
        }
    } else if (algorithm === "20xx") {
        birthYear = parseInt("20" + yy, 10);
        calculatedChecksumForYear = expectedChecksum20xx;
        if (checksum !== undefined && checksum === expectedChecksum20xx) {
            isValidChecksum = true;
            status = "valid";
        }
    } else {
        // algorithm === 'auto'
        if (checksum !== undefined) {
            const match19xx = expectedChecksum19xx === checksum;
            const match20xx = expectedChecksum20xx === checksum;

            if (match19xx) {
                isValidChecksum = true;
                status = "valid";
                birthYear = parseInt("19" + yy, 10);
                calculatedChecksumForYear = expectedChecksum19xx;
                suggestedAlgorithm = "19xx";
                if (match20xx) {
                    suggestedAlgorithm = undefined;
                } // Handle rare dual match case
            } else if (match20xx) {
                isValidChecksum = true;
                status = "valid";
                birthYear = parseInt("20" + yy, 10);
                calculatedChecksumForYear = expectedChecksum20xx;
                suggestedAlgorithm = "20xx";
            } else {
                // Auto failed, checksum invalid. Guess year.
                birthYear = guessBirthYear();
                status = "checksum_invalid";
                calculatedChecksumForYear = birthYear >= 2000 ? expectedChecksum20xx : expectedChecksum19xx;
            }
        } else {
            // Checksum missing ('auto' mode). Guess year.
            birthYear = guessBirthYear();
            status = "checksum_missing";
            calculatedChecksumForYear = birthYear >= 2000 ? expectedChecksum20xx : expectedChecksum19xx;
        }
    }

    // --- Date Validation (Fatal) (unchanged) ---
    const monthIndex = parseInt(mm, 10) - 1;

    const day = parseInt(dd, 10);

    const dateObj = new Date(Date.UTC(birthYear, monthIndex, day));
    
    if (isNaN(dateObj.getTime()) || dateObj.getUTCFullYear() !== birthYear || dateObj.getUTCMonth() !== monthIndex || dateObj.getUTCDate() !== day) {
        const dateParts = { yy, mm, dd, year: birthYear };
        return { input: originalInput, errorKey: "INVALID_DATE", status: "error", dateParts: dateParts, components: components };
    }

    const formattedBirthDate = `${String(day).padStart(2, "0")}/${String(monthIndex + 1).padStart(2, "0")}/${birthYear}`;

    // --- Gender Determination (unchanged) ---
    const isMale = sequence % 2 !== 0;
    const genderKey = isMale ? "common.male" : "common.female";

    // --- Birth Order Calculation (unchanged) ---
    const birthOrder = isMale ? (sequence + 1) / 2 : sequence / 2;

    if (birthOrder <= 0 || !Number.isInteger(birthOrder)) {
        return { input: originalInput, errorKey: "INVALID_SEQUENCE", status: "error", invalidSequenceValue: sequence, components: components };
    }

    // --- Return DecodedInfoResult ---
    return {
        input: originalInput,
        errorKey: undefined,
        status: status, // status is 'valid', 'checksum_invalid', or 'checksum_missing'
        isValidFormat: true,
        simulatedBirthDate: formattedBirthDate,
        simulatedGenderKey: genderKey,
        simulatedSequence: sequence,
        simulatedChecksumValid: isValidChecksum,
        calculatedChecksum: calculatedChecksumForYear,
        expectedChecksum19xx: expectedChecksum19xx,
        expectedChecksum20xx: expectedChecksum20xx,
        birthYear: birthYear,
        birthOrder: birthOrder,
        components: components,
        algorithmUsed: algorithm,
        suggestedAlgorithm: suggestedAlgorithm,
        guessedYear: guessedYear,
    };
}
