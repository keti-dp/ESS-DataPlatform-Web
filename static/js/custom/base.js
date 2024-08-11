import commonEN from '../../resources/locales/en/common.json' with { type: "json" };
import messageEN from '../../resources/locales/en/message.json' with { type: "json" };
import validationEN from '../../resources/locales/en/validation.json' with { type: "json" };
import commonKO from '../../resources/locales/ko/common.json' with { type: "json" };
import messageKO from '../../resources/locales/ko/message.json' with { type: "json" };
import validationKO from '../../resources/locales/ko/validation.json' with { type: "json" };

let token = Cookies.get('access_token');
let decoded = jwt_decode(token);

if (decoded['name']) {
    let headerElement = document.querySelector('header');
    let userNameElement = headerElement.querySelector('.user-name');
    userNameElement.textContent = decoded['name'];
}

// Set i18next
let currentUrlPath = window.location.pathname;
let i18nextOption = {
    lng: 'ko',
    ns: ['common', 'validation', 'message'],
    // debug: true,
    defaultNS: 'common',
    resources: {
        en: {
            common: commonEN,
            message: messageEN,
            validation: validationEN
        },
        ko: {
            common: commonKO,
            message: messageKO,
            validation: validationKO
        }
    }
};

if (currentUrlPath.includes('/en/')) {
    i18nextOption['lng'] = 'en';
}

await i18next.init(i18nextOption);