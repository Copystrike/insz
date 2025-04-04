// src/locales/en.ts

export const en = {
    langCode: 'en',
    langName: 'English',
    nav: {
        introduction: 'Introduction',
        decode: 'Decode',
    },
    language: {
        viewWebsiteIn: 'View this website in',
    },
    meta: {
        titleBase: 'INSZ', // Changed
        titleIntro: 'Introduction',
        titleDecode: 'Decode Simulation',
        titleNotFound: 'Not Found',
    },
    home: {
        title: 'The Belgian INSZ Number', // Changed
        subtitle: 'Understanding the unique national identification number (INSZ) used in Belgium for social security and identification purposes.', // Changed
        tryDecoder: 'Try the Decoder',
        whatIsTitle: 'What is the INSZ?', // Changed
        // Removed INSS mention, clarified INSZ meaning
        whatIsP1: 'The <strong class="font-semibold">INSZ</strong> (Identificatienummer van de Sociale Zekerheid / Numéro d\'identification de la sécurité sociale), often called the National Register number, is a unique 11-digit number assigned to every person registered in Belgium\'s National Register.',
        whatIsP2: 'It\'s crucial for interactions with social security institutions, healthcare providers, employers, and government agencies.',
        structureTitle: 'Structure (YYMMDD-SSS-CC)',
        structureYYMMDD: '<strong class="font-semibold">YYMMDD:</strong> Represents the date of birth (Year, Month, Day).',
        structureNote: 'Note: For individuals born before 2000, a \'bis\' number might involve adding 20 or 40 to the month for uniqueness or specific cases (e.g., foreign workers).', // Clarified bis number context slightly
        structureSSS: '<strong class="font-semibold">SSS:</strong> A serial number. The parity (odd/even) indicates gender (Odd for Male, Even for Female) at the time of assignment.',
        structureCC: '<strong class="font-semibold">CC:</strong> A two-digit checksum, calculated based on the preceding 9 digits (or 11 digits for numbers assigned after 2000 using modulo 97).', // Clarified checksum calculation basis
        importanceTitle: 'Importance and Usage',
        importanceLi1: 'Identification for social security benefits (unemployment, pension, health insurance).',
        importanceLi2: 'Used by employers for payroll and reporting (e.g., Dimona declaration).', // Added Dimona example
        importanceLi3: 'Required for healthcare services (via the eID card or ISI+ card).',
        importanceLi4: 'Primary identifier on the Belgian electronic identity card (eID).',
        importanceLi5: 'Used in tax administration (personal income tax).', // Clarified tax context
        privacyTitle: 'Privacy and Security',
        privacyWarning: 'Handle with Care!',
        // Removed INSS mention
        privacyP1: 'The INSZ number (National Register number) is sensitive personal data. It directly links to an individual\'s identity and contains information like birth date and gender indicator.',
        privacyP2: 'Unauthorized collection, processing, or sharing of this number is strictly regulated by privacy laws (like GDPR).',
        privacyP3: '<strong class="block">Never share your INSZ number unnecessarily or on untrusted websites or via insecure channels.</strong>', // Updated wording
    },
    decode: {
        title: 'INSZ Decoder',
        disclaimer: '<strong class="font-semibold">Warning:</strong> INSZ numbers are credentials that can grant access to personal information. Be careful where you enter them! We do not store any numbers, all validation and decoding is done on the client side.',
        formLabel: 'Enter INSZ Number (e.g., 930518-223-41)',
        formPlaceholder: 'YYMMDD-SSS-CC',
        buttonText: 'Simulate Decode',
        resultsTitle: 'Simulated Results:',
        resultsInput: 'Input Value',
        resultsFormatCheck: 'Format Check',
        resultsBirthDate: 'Simulated Birth Date',
        resultsGender: 'Simulated Gender (from Seq.)',
        resultsSequence: 'Simulated Sequence',
        resultsChecksum: 'Simulated Checksum',
        resultsFormatOk: '<span class="text-green-600 font-semibold">Looks OK</span>',
        resultsFormatInvalid: '<span class="text-red-600 font-semibold">Invalid</span>',
        resultsChecksumValid: '<span class="text-green-600 font-semibold">Valid</span>',
        resultsChecksumInvalid: '<span class="text-red-600 font-semibold">Invalid</span>',
        resultsReminder: 'Reminder: This is illustrative data based on format only.',
        errorInvalidFormat: 'Invalid format. Must be 11 digits (e.g., YYMMDD-SSS-CC).',
    },
    footer: {
        copyright: '© {year} All Rights Reserved.', // Changed
        warning: 'This website is for informational purposes only.<br><span class="text-pink-900">This website is not affiliated with the Belgian government or any official entity.</span>',
    },
    notFound: {
        title: 'Page Not Found',
        subtitle: 'Sorry, the page you are looking for does not exist.',
        goHome: 'Go Back Home',
    },
    common: {
        male: 'Male',
        female: 'Female',
        notAvailable: 'N/A',
    },
    client: {
        decoder: {
            algorithm: "Algorithm Setting:",
            algorithmAuto: "Automatic (19xx/20xx)",
            algorithm19xx: "Force 19xx",
            algorithm20xx: "Force 20xx",
            checksumSuggestion: "Checksum Suggestion:",
            validFor: "Valid for",
            checksumStatus: "Checksum:",
            checksumCorrect: "Correct",
            checksumInvalid: "Invalid",
            checksumMissing: "Missing",
            checksumExpected: "Expected",
            checksumWouldBe: "Would be",
            checksumForYear: "for",
            birthDate: "Birth Date:",
            gender: "Gender:",
            birthOrder: "Birth Order:",
            theNth: "The",
            registeredThatDay: "registered that day",
            cautionChecksumInvalid: "CAUTION: Checksum is invalid!",
            cautionChecksumMissing: "CAUTION: Checksum is missing! Validation impossible.",
            yearAssumed: "Year is assumed.",
            disclaimer: "Derivation based on standard algorithms, for informational purposes only.",
            input: "Input:",
            datePart: "Date Part (YYMMDD):",
            sequencePart: "Sequence Number (SSS):",
            checksumPart: "Checksum (CC):",
            errorInvalidType: "Invalid input type.",
            errorInvalidLength: "Invalid length. Expected 9 or 11 digits, but received",
            errorInvalidFormat: "Invalid format. Must contain only digits.",
            errorInvalidSequence: "Invalid sequence number",
            errorInvalidSequenceRange: "Must be between 001 and 998.",
            errorInvalidDate: "Invalid date",
            errorDateNotExist: "The date does not exist in the calendar.",
            errorUnknown: "Unknown validation error.",
            enterNumber: "Enter a 9 or 11-digit national register number.",
            decoderTitle: "Decoder National Register Number",
            selectAlgorithm: "Algorithm:",
            unknownCount: "unknown count"
        }
    }
};

export type AppTranslations = typeof en; // Keep type export