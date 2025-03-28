// src/locales/fr.ts
import type { AppTranslations } from './en'; // Import type from 'en'

export const fr: AppTranslations = {
    langCode: 'fr',
    langName: 'Français',
    nav: {
        introduction: 'Introduction',
        decode: 'Décoder',
    },
    language: {
        viewWebsiteIn: 'Voir ce site web en',
    },
    meta: {
        titleBase: 'INSZ', // Changed
        titleIntro: 'Introduction',
        titleDecode: 'Simulation de Décodage',
        titleNotFound: 'Non Trouvé',
    },
    home: {
        title: 'Le Numéro INSZ Belge', // Changed
        subtitle: 'Comprendre le numéro d\'identification national unique (INSZ) utilisé en Belgique pour la sécurité sociale et l\'identification.', // Changed
        tryDecoder: 'Essayez le Décodeur',
        whatIsTitle: 'Qu\'est-ce que l\'INSZ ?', // Changed
        // Removed INSS mention, clarified INSZ meaning - translated
        whatIsP1: 'L\'<strong class="font-semibold">INSZ</strong> (Identificatienummer van de Sociale Zekerheid / Numéro d\'identification de la sécurité sociale), souvent appelé numéro de Registre national, est un numéro unique à 11 chiffres attribué à chaque personne inscrite au Registre national belge.',
        whatIsP2: 'Il est crucial pour les interactions avec les institutions de sécurité sociale, les prestataires de soins de santé, les employeurs et les agences gouvernementales.',
        structureTitle: 'Structure (AAMMJJ-SSS-CC)', // Changed YY to AA (Année)
        structureYYMMDD: '<strong class="font-semibold">AAMMJJ :</strong> Représente la date de naissance (Année, Mois, Jour).', // Changed YY to AA
        structureNote: 'Note : Pour les personnes nées avant 2000, un numéro \'bis\' peut impliquer l\'ajout de 20 ou 40 au mois pour l\'unicité ou des cas spécifiques (par ex., travailleurs étrangers).', // Clarified bis number context slightly - translated
        structureSSS: '<strong class="font-semibold">SSS :</strong> Un numéro de série. La parité (impair/pair) indique le sexe (Impair pour Homme, Pair pour Femme) au moment de l\'attribution.',
        structureCC: '<strong class="font-semibold">CC :</strong> Un numéro de contrôle à deux chiffres, calculé sur la base des 9 chiffres précédents (ou 11 chiffres pour les numéros attribués après 2000 en utilisant le modulo 97).', // Clarified checksum calculation basis - translated
        importanceTitle: 'Importance et Utilisation',
        importanceLi1: 'Identification pour les prestations de sécurité sociale (chômage, pension, assurance maladie).',
        importanceLi2: 'Utilisé par les employeurs pour la paie et les déclarations (par ex., déclaration Dimona).', // Added Dimona example - translated
        importanceLi3: 'Requis pour les services de soins de santé (via la carte eID ou la carte ISI+).',
        importanceLi4: 'Identifiant principal sur la carte d\'identité électronique belge (eID).',
        importanceLi5: 'Utilisé dans l\'administration fiscale (impôt des personnes physiques).', // Clarified tax context - translated
        privacyTitle: 'Confidentialité et Sécurité',
        privacyWarning: 'Manipuler avec soin !',
        // Removed INSS mention - translated
        privacyP1: 'Le numéro INSZ (Numéro de Registre national) est une donnée personnelle sensible. Il est directement lié à l\'identité d\'un individu et contient des informations telles que la date de naissance et l\'indicateur de sexe.',
        privacyP2: 'La collecte, le traitement ou le partage non autorisé de ce numéro sont strictement réglementés par les lois sur la protection de la vie privée (comme le RGPD).', // Added RGPD
        privacyP3: '<strong class="block">Ne partagez jamais votre numéro INSZ inutilement, sur des sites web non fiables ou via des canaux non sécurisés.</strong>', // Updated wording - translated
    },
    decode: {
        title: 'Décodeur INSZ',
        disclaimer: '<strong class="font-semibold">Avertissement :</strong> Les numéros INSZ sont des identifiants qui peuvent donner accès à des informations personnelles. Soyez prudent où vous les saisissez ! Nous ne stockons aucun numéro, toute la validation et le décodage sont effectués côté client.', // Translated 'client side'
        formLabel: 'Entrez le numéro INSZ (par ex., 930518-223-41)', // Used 'par ex.' for 'e.g.'
        formPlaceholder: 'AAMMJJ-SSS-CC', // Changed YY to AA
        buttonText: 'Simuler le Décodage',
        resultsTitle: 'Résultats Simulés :',
        resultsInput: 'Valeur d\'Entrée',
        resultsFormatCheck: 'Vérification du Format',
        resultsBirthDate: 'Date de Naissance Simulée',
        resultsGender: 'Sexe Simulé (d\'après SSS)',
        resultsSequence: 'Séquence Simulée',
        resultsChecksum: 'Numéro de Contrôle Simulé',
        resultsFormatOk: '<span class="text-green-600 font-semibold">Semble OK</span>',
        resultsFormatInvalid: '<span class="text-red-600 font-semibold">Invalide</span>',
        resultsChecksumValid: '<span class="text-green-600 font-semibold">Valide (Simulé)</span>',
        resultsChecksumInvalid: '<span class="text-red-600 font-semibold">Invalide (Simulé)</span>',
        resultsReminder: 'Rappel : Ce sont des données illustratives basées uniquement sur le format.',
        errorInvalidFormat: 'Format invalide. Doit contenir 11 chiffres (par ex., AAMMJJ-SSS-CC).', // Changed YY to AA
    },
    footer: {
        copyright: '© {year} Tous Droits Réservés.', // Changed
        warning: 'Ce site web est uniquement à des fins d\'information.<br><span class="text-pink-900">Ce site web n\'est pas affilié au gouvernement belge ni à aucune entité officielle.</span>',
    },
    notFound: {
        title: 'Page Non Trouvée',
        subtitle: 'Désolé, la page que vous recherchez n\'existe pas.',
        goHome: 'Retour à l\'Accueil',
    },
    common: {
        male: 'Homme (Simulé)',
        female: 'Femme (Simulé)',
        notAvailable: 'N/D', // Standard French abbreviation for Not Available/Non Disponible
    }
};