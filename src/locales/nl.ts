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
        viewWebsiteIn: 'Bekijk deze website in het',
    },
    meta: {
        titleBase: 'Belgische INSZ Info', // Consistent title
        titleIntro: 'Introductie',
        titleDecode: 'Decodeer Simulatie',
        titleNotFound: 'Niet Gevonden',
    },
    home: {
        title: 'Het Belgische INSZ-nummer', // Consistent title
        subtitle: 'Begrijp het unieke nationale identificatienummer (INSZ / rijksregisternummer) dat in België wordt gebruikt voor sociale zekerheid en identificatiedoeleinden.', // Updated subtitle
        tryDecoder: 'Probeer de Decoder',
        whatIsTitle: 'Wat is het INSZ?', // Consistent title
        // Updated description, focus on INSZ/Rijksregisternummer
        whatIsP1: 'Het <strong class="font-semibold">INSZ</strong> (Identificatienummer van de Sociale Zekerheid), vaak <strong class="font-semibold">rijksregisternummer</strong> genoemd, is een uniek 11-cijferig nummer dat wordt toegekend aan elke persoon die in België is ingeschreven in het Rijksregister.',
        whatIsP2: 'Het is cruciaal voor interacties met socialezekerheidsinstellingen, zorgverleners, werkgevers en overheidsinstanties.',
        structureTitle: 'Structuur (JJMMDD-SSS-CC)',
        structureYYMMDD: '<strong class="font-semibold">JJMMDD:</strong> Vertegenwoordigt de geboortedatum (Jaar, Maand, Dag).',
        structureNote: 'Opmerking: Voor personen geboren vóór 2000, kan een \'bisnummer\' het toevoegen van 20 of 40 aan de maand inhouden voor uniciteit of specifieke gevallen (bv. buitenlandse werknemers).', // Clarified bis number
        structureSSS: '<strong class="font-semibold">SSS:</strong> Een volgnummer (reeksnummer). De pariteit (oneven/even) geeft het geslacht aan (Oneven voor Man, Even voor Vrouw) bij de geboorte/toekenning.',
        structureCC: '<strong class="font-semibold">CC:</strong> Een controlegetal van twee cijfers, berekend op basis van de voorgaande 9 cijfers (of 11 cijfers voor nummers toegekend na 2000 via modulo 97).', // Clarified checksum
        importanceTitle: 'Belang en Gebruik',
        importanceLi1: 'Identificatie voor socialezekerheidsuitkeringen (werkloosheid, pensioen, ziekteverzekering).',
        importanceLi2: 'Gebruikt door werkgevers voor loonadministratie en Dimona-aangifte.', // Added Dimona
        importanceLi3: 'Vereist voor gezondheidszorgdiensten (via de eID-kaart of ISI+-kaart).',
        importanceLi4: 'Primaire identificator op de Belgische elektronische identiteitskaart (eID).',
        importanceLi5: 'Gebruikt in de belastingadministratie (personenbelasting).', // Clarified tax
        privacyTitle: 'Privacy en Veiligheid',
        privacyWarning: 'Ga er voorzichtig mee om!',
        // Updated privacy text
        privacyP1: 'Het INSZ-nummer / rijksregisternummer zijn gevoelige persoonsgegevens. Het is direct gekoppeld aan de identiteit van een individu en bevat informatie zoals geboortedatum en geslachtsaanduiding.',
        privacyP2: 'Ongeautoriseerde verzameling, verwerking of deling van dit nummer is strikt gereguleerd door privacywetten zoals de GDPR/AVG (Algemene Verordening Gegevensbescherming).',
        privacyP3: '<strong class="block">Deel uw INSZ-nummer nooit onnodig of op onbetrouwbare websites of via onbeveiligde kanalen.</strong>', // Updated wording
    },
    decode: {
        title: 'INSZ Decoder', // Consistent title
        disclaimerTitle: 'Belangrijke Vrijwaring:',
        // Updated disclaimer text
        disclaimerP1: 'Deze pagina biedt een <strong class="underline">simulatie</strong> enkel voor educatieve doeleinden. Het demonstreert de *mogelijke* structuur van een INSZ-nummer.',
        disclaimerP2: 'Het maakt <strong class="uppercase">geen</strong> verbinding met een officiële database, voert <strong class="uppercase">geen</strong> echte validatie uit (inclusief controlegetal), en verwerkt <strong class="uppercase">geen</strong> echte persoonsgegevens. De weergegeven informatie (geboortedatum, geslacht) is <strong class="underline">algemeen en gesimuleerd</strong>, enkel gebaseerd op het invoerformaat, niet op werkelijke gegevens.',
        disclaimerP3: '<strong>Voer hier GEEN echte INSZ-nummers in als u bezorgd bent om privacy, hoewel er geen gegevens worden opgeslagen of verzonden door deze simulatie.</strong>',
        formLabel: 'Voer INSZ-nummer in', // Consistent label
        formPlaceholder: 'JJMMDD-SSS-CC',
        buttonText: 'Simuleer Decodering',
        resultsTitle: 'Gesimuleerde Resultaten',
        resultsInput: 'Invoerwaarde',
        resultsFormatCheck: 'Formaatcontrole',
        resultsBirthDate: 'Gesimuleerde Geboortedatum',
        resultsGender: 'Gesimuleerd Geslacht (uit reeks)',
        resultsSequence: 'Gesimuleerde Reeks',
        resultsChecksum: 'Gesimuleerd Controlegetal',
        resultsFormatOk: '<span class="text-green-600 font-semibold">Lijkt OK</span>',
        resultsFormatInvalid: '<span class="text-red-600 font-semibold">Ongeldig</span>',
        resultsChecksumValid: '<span class="text-green-600 font-semibold">Geldig (Gesimuleerd)</span>',
        resultsChecksumInvalid: '<span class="text-red-600 font-semibold">Ongeldig (Gesimuleerd)</span>',
        resultsReminder: 'Herinnering: Dit zijn illustratieve gegevens, enkel gebaseerd op formaat.',
        errorInvalidFormat: 'Ongeldig formaat. Moet 11 cijfers zijn (bv. JJMMDD-SSS-CC).',
    },
    footer: {
        copyright: '© {year} Belgische INSZ Info. Alle rechten voorbehouden.', // Consistent copyright
        informational: 'Deze website is enkel voor informatieve doeleinden.',
        simulationWarning: 'De \'Decoderen\' pagina is een simulatie en verwerkt geen echte INSZ-nummers.', // Consistent warning
    },
    notFound: {
        title: 'Pagina Niet Gevonden',
        subtitle: 'Sorry, de pagina die u zoekt bestaat niet.',
        goHome: 'Terug naar Startpagina',
    },
    common: {
        male: 'Man (Gesimuleerd)',
        female: 'Vrouw (Gesimuleerd)',
        notAvailable: 'N/B', // Niet beschikbaar
    }
};