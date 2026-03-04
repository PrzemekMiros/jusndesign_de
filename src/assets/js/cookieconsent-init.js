const ccLang = "de";
const contactLink = "/kontakt";
const revisionLabel = "Cookie-Einstellungen";

document.documentElement.classList.add("cc--darkmode");
document.documentElement.lang = ccLang;

CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "cloud",
            position: "unten rechts",
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            readOnly: true
        },
        functionality: {},
        analytics: {},
        marketing: {}
    },
    revisionButton: {
        enabled: true,
        position: "left",
        label: revisionLabel
    },
    language: {
        default: ccLang,
        autoDetect: "document",
        translations: {
            de: {
                consentModal: {
                    title: "Diese Website verwendet Cookies",
                    description: "Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren, Social-Media-Funktionen bereitzustellen und den Website-Verkehr zu analysieren.",
                    acceptAllBtn: "Akzeptieren",
                    showPreferencesBtn: "Einstellungen"
                },
                preferencesModal: {
                    title: "Cookie-Einstellungen",
                    acceptAllBtn: "Akzeptieren",
                    acceptNecessaryBtn: "Ablehnen",
                    savePreferencesBtn: "Speichern Sie Ihre Einstellungen",
                    closeIconLabel: "Schließen",
                    serviceCounterLabel: "Service|Dienstleistungen",
                    sections: [
                        {
                            title: "Verwendung von Cookies",
                            description: "Da wir Ihr Recht auf Privatsphäre respektieren, können Sie sich dafür entscheiden, bestimmte Arten von Cookies nicht zuzulassen. Klicken Sie auf die verschiedenen Kategorieüberschriften, um mehr zu erfahren und die Standardeinstellungen zu ändern."
                        },
                        {
                            title: "Notwendige Cookies<span class=\"pm__badge\">Immer aktiv</span>",
                            description: "Diese Cookies sind für das Funktionieren der Website unerlässlich und können in unseren Systemen nicht deaktiviert werden. Sie werden in der Regel nur als Reaktion auf von Ihnen durchgeführte Aktionen festgelegt, die einer Anforderung von Diensten gleichkommen, z. B. das Festlegen Ihrer Datenschutzeinstellungen, das Anmelden oder das Ausfüllen von Formularen. Diese Cookies speichern keine personenbezogenen Daten.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Funktionelle Cookies",
                            description: "Funktionale Cookies helfen dabei, bestimmte Funktionen auszuführen, z. B. das Teilen von Website-Inhalten auf Social-Media-Plattformen, das Sammeln von Feedback und andere Funktionen Dritter.",
                            linkedCategory: "functionality"
                        },
                        {
                            title: "Analytische Cookies",
                            description: "Analytische Cookies helfen uns zu verstehen, wie Benutzer die Website nutzen, Fehler zu erkennen und das Besuchererlebnis zu verbessern.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Werbe-Cookies",
                            description: "Werbe-Cookies werden verwendet, um für Sie relevante Werbung auszuliefern. Sie helfen dabei, die Wirksamkeit von Werbung zu messen, beispielsweise die Anzahl der Besuche und Klicks.",
                            linkedCategory: "marketing"
                        },
                        {
                            title: "Weitere Informationen",
                            description: `Wenn Sie Fragen zu unserer Cookie-Richtlinie haben, kontaktieren Sie uns bitte über <a class="cc__link" href="${contactLink}">Kontakt</a>.`
                        }
                    ]
                }
            }
        }
    }
});
