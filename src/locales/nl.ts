// src/locales/nl.ts
import type { AppTranslations } from './en'; // Import type from 'en'

export const nl: AppTranslations = {
    langCode: 'nl',
    langName: 'Nederlands',
    nav: {
        introduction: 'Introductie',
        decode: 'Decoderen',
    },
    language: {
        viewWebsiteIn: 'Bekijk deze website in',
    },
    meta: {
        titleBase: 'INSZ', // Changed
        titleIntro: 'Introductie',
        titleDecode: 'Decodeer Simulatie',
        titleNotFound: 'Niet Gevonden',
    },
    home: {
        title: 'Het Belgische INSZ-nummer', // Changed
        subtitle: 'Begrijp het unieke nationale identificatienummer (INSZ) dat in België wordt gebruikt voor sociale zekerheid en identificatiedoeleinden.', // Changed
        tryDecoder: 'Probeer de Decoder',
        whatIsTitle: 'Wat is het INSZ?', // Changed
        // Removed INSS mention, clarified INSZ meaning - translated
        whatIsP1: 'Het <strong class="font-semibold">INSZ</strong> (Identificatienummer van de Sociale Zekerheid / Numéro d\'identification de la sécurité sociale), vaak het Rijksregisternummer genoemd, is een uniek 11-cijferig nummer dat wordt toegekend aan elke persoon die is ingeschreven in het Belgische Rijksregister.',
        whatIsP2: 'Het is cruciaal voor interacties met socialezekerheidsinstellingen, zorgverleners, werkgevers en overheidsinstanties.',
        structureTitle: 'Structuur (JJMMDD-SSS-CC)', // Changed YY to JJ (Jaar)
        structureYYMMDD: '<strong class="font-semibold">JJMMDD:</strong> Vertegenwoordigt de geboortedatum (Jaar, Maand, Dag).', // Changed YY to JJ
        structureNote: 'Opmerking: Voor personen geboren vóór 2000 kan een \'bis\'-nummer inhouden dat 20 of 40 bij de maand wordt opgeteld voor uniciteit of specifieke gevallen (bv. buitenlandse werknemers).', // Clarified bis number context slightly - translated
        structureSSS: '<strong class="font-semibold">SSS:</strong> Een volgnummer. De pariteit (oneven/even) geeft het geslacht aan (Oneven voor Man, Even voor Vrouw) op het moment van toekenning.',
        structureCC: '<strong class="font-semibold">CC:</strong> Een controlegetal van twee cijfers, berekend op basis van de voorgaande 9 cijfers (of 11 cijfers voor nummers toegekend na 2000 via modulo 97).', // Clarified checksum calculation basis - translated
        importanceTitle: 'Belang en Gebruik',
        importanceLi1: 'Identificatie voor socialezekerheidsuitkeringen (werkloosheid, pensioen, ziekteverzekering).',
        importanceLi2: 'Gebruikt door werkgevers voor loonadministratie en aangiften (bv. Dimona-aangifte).', // Added Dimona example - translated
        importanceLi3: 'Vereist voor gezondheidszorgdiensten (via de eID-kaart of ISI+-kaart).',
        importanceLi4: 'Primaire identificator op de Belgische elektronische identiteitskaart (eID).',
        importanceLi5: 'Gebruikt bij de belastingadministratie (personenbelasting).', // Clarified tax context - translated
        privacyTitle: 'Privacy en Beveiliging',
        privacyWarning: 'Ga er zorgvuldig mee om!',
        // Removed INSS mention - translated
        privacyP1: 'Het INSZ-nummer (Rijksregisternummer) zijn gevoelige persoonsgegevens. Het is direct gekoppeld aan de identiteit van een individu en bevat informatie zoals geboortedatum en geslachtsaanduiding.',
        privacyP2: 'Ongeoorloofde verzameling, verwerking of deling van dit nummer is strikt gereguleerd door privacywetgeving (zoals GDPR/AVG).', // Added AVG
        privacyP3: '<strong class="block">Deel uw INSZ-nummer nooit onnodig, op onbetrouwbare websites of via onveilige kanalen.</strong>', // Updated wording - translated
    },
    decode: {
        title: 'INSZ Decoder',
        disclaimer: '<strong class="font-semibold">Waarschuwing:</strong> INSZ-nummers zijn gegevens die toegang kunnen geven tot persoonlijke informatie. Wees voorzichtig waar u ze invoert! Wij slaan geen nummers op, alle validatie en decodering gebeurt aan de client-zijde.', // Translated 'client side'
        formLabel: 'Voer INSZ-nummer in (bv. 930518-223-41)', // Used 'bv.' for 'e.g.'
        formPlaceholder: 'JJMMDD-SSS-CC', // Changed YY to JJ
        buttonText: 'Simuleer Decodering',
        resultsTitle: 'Gesimuleerde Resultaten:',
        resultsInput: 'Invoerwaarde',
        resultsFormatCheck: 'Formaatcontrole',
        resultsBirthDate: 'Gesimuleerde Geboortedatum',
        resultsGender: 'Gesimuleerd Geslacht (uit volgnummer)',
        resultsSequence: 'Gesimuleerd Volgnummer',
        resultsChecksum: 'Gesimuleerd Controlegetal',
        resultsFormatOk: '<span class="text-green-600 font-semibold">Lijkt OK</span>',
        resultsFormatInvalid: '<span class="text-red-600 font-semibold">Ongeldig</span>',
        resultsChecksumValid: '<span class="text-green-600 font-semibold">Geldig</span>',
        resultsChecksumInvalid: '<span class="text-red-600 font-semibold">Ongeldig</span>',
        resultsReminder: 'Herinnering: Dit zijn illustratieve gegevens, enkel gebaseerd op het formaat.',
        errorInvalidFormat: 'Ongeldig formaat. Moet 11 cijfers zijn (bv. JJMMDD-SSS-CC).', // Changed YY to JJ
    },
    footer: {
        copyright: '© {year} Alle Rechten Voorbehouden.', // Changed
        warning: 'Deze website is uitsluitend bedoeld voor informatieve doeleinden.<br><span class="text-pink-900">Deze website is niet gelieerd aan de Belgische overheid of enige officiële instantie.</span>',
    },
    notFound: {
        title: 'Pagina Niet Gevonden',
        subtitle: 'Sorry, de pagina die u zoekt bestaat niet.',
        goHome: 'Terug naar Startpagina',
    },
    common: {
        male: 'Man',
        female: 'Vrouw',
        notAvailable: 'N.v.t.', // Standard Dutch abbreviation for N/A
    },
    client: {
        decoder: {
            algorithm: "Algoritme Instelling:",
            algorithmAuto: "Automatisch (19xx/20xx)",
            algorithm19xx: "Forceer 19xx",
            algorithm20xx: "Forceer 20xx",
            checksumSuggestion: "Checksum Suggestie:",
            validFor: "Geldig voor",
            checksumStatus: "Controlegetal:",
            checksumCorrect: "Correct",
            checksumInvalid: "Ongeldig",
            checksumMissing: "Ontbreekt",
            checksumExpected: "Verwacht",
            checksumWouldBe: "Zou",
            checksumForYear: "zijn voor",
            birthDate: "Geboortedatum:",
            gender: "Geslacht:",
            birthOrder: "Geboortevolgorde:",
            theNth: "De",
            registeredThatDay: "geregistreerd op die dag",
            cautionChecksumInvalid: "LET OP: Controlegetal is ongeldig!",
            cautionChecksumMissing: "LET OP: Controlegetal ontbreekt! Validatie onmogelijk.",
            yearAssumed: "Jaar is aangenomen.",
            disclaimer: "Afleiding gebaseerd op standaard algoritmes, enkel ter informatie.",
            input: "Invoer:",
            datePart: "Datumdeel (JJMMDD):",
            sequencePart: "Reeksnummer (SSS):",
            checksumPart: "Controlegetal (CC):",
            errorInvalidType: "Ongeldig invoertype.",
            errorInvalidLength: "Ongeldige lengte. Verwacht 9 of 11 cijfers, maar",
            errorInvalidFormat: "Ongeldig formaat. Mag enkel cijfers bevatten.",
            errorInvalidSequence: "Ongeldig reeksnummer",
            errorInvalidSequenceRange: "Moet tussen 001 en 998 liggen.",
            errorInvalidDate: "Ongeldige datum",
            errorDateNotExist: "De datum bestaat niet in de kalender.",
            errorUnknown: "Onbekende validatiefout.",
            enterNumber: "Voer een 9- of 11-cijferig rijksregisternummer in.",
            decoderTitle: "Decoder Rijksregisternummer",
            selectAlgorithm: "Algoritme:",
            unknownCount: "onbekend aantal"
        }
    }
};
