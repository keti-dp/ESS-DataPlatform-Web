const APPLICATION_NAME_MIN_LENGTH = 3
const APPLICATION_NAME_MAX_LENGTH = 50

/**
 * Get data.
 * @param {string} requestUrl
 * @returns {object}
 */
async function loadData(requestUrl) {
    let response = await fetch(requestUrl);
    
    if (response.ok) {
        return await response.json();
    }

    throw new Error(response.status);
}

/**
 * Get info in cookie.
 * @param {string} name 
 * @returns {string}
 */
function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                
                break;
            }
        }
    }

    return cookieValue;
}

/**
 * Handling OpenAPI subscription.
 * @param {object} event 
 */
function openAPISubscriptionHandler(event) {
    let switchCheckbox = event.target;
    let applicationId = switchCheckbox.dataset.applicationId;
    let openapiId = switchCheckbox.dataset.openapiId;
    let subscriptionId = switchCheckbox.dataset.subscriptionId;

    if (switchCheckbox.checked) { // Create a new subscription.
        let data = {
            applicationId: applicationId,
            openapiId: openapiId
        };

        let requestUrl = new URL(`${window.location.origin}/api/openapi/subscriptions/`);

        fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN': csrftoken,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.status);
        }).then(newSubscription => {
            switchCheckbox.setAttribute('data-subscription-id', newSubscription.id);
        });
    } else { // Delete a subscription.
        let requestUrl = new URL(`${window.location.origin}/api/openapi/subscriptions/${subscriptionId}`);

        fetch(requestUrl, {
            method: 'DELETE',
            headers: {
                'X-CSRFTOKEN': csrftoken,
            },
        }).then(response => {
            if (response.ok) {
                switchCheckbox.removeAttribute('data-subscription-id');

                return response.ok;
            }

            throw new Error(response.status);
        });
    }
}

const csrftoken = getCookie('csrftoken');

let proRequestButtonElement = document.getElementById('proRequestButton');

if (proRequestButtonElement) {
    proRequestButtonElement.addEventListener('click', event => {
        event.preventDefault();

        let button = event.target;
        let requestUrlPath = button.getAttribute('href');

        let requestUrl = new URL(`${window.location.origin}${requestUrlPath}`);

        fetch(requestUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                'is_pro_request_status': true
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data['is_pro_request_status']) {
                location.reload();
            }
        }).catch(error => console.log(error));
    });
}

let deleteAccountButtonElement = document.getElementById('deleteAccountButton');
deleteAccountButtonElement.addEventListener('click', event => {
    let button = event.target;
    let requestUrlPath = button.dataset.urlpath;
    
    let reuqestUrl = new URL(`${window.location.origin}${requestUrlPath}`);

    fetch(reuqestUrl, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrftoken,
        }
    }).then(response => {
        if (response.ok) {
            window.location.replace('/');
        }
    }).catch(error => console.log(error));
});

let applicationListContainerElement = document.getElementById('applicationListContainer');
let applicationNames;
let applicationCreationFormValidatorRules = [
    {
        rule: 'required',
        errorMessage: '이름을 입력하세요.',
    },
    {
        rule: 'minLength',
        value: APPLICATION_NAME_MIN_LENGTH,
        errorMessage: `최대 글자 수는 ${APPLICATION_NAME_MIN_LENGTH}자 이상으로 입력하세요.`
    },
    {
        rule: 'maxLength',
        value: APPLICATION_NAME_MAX_LENGTH,
        errorMessage: `최대 글자 수는 ${APPLICATION_NAME_MAX_LENGTH}자 이하로 입력하세요.`
    },
    {
        validator: (value, context) => () => 
            new Promise((resolve) => {
                setTimeout(() => {
                    let applicationNames = [...applicationListContainerElement.querySelectorAll('h5')].map(element => element.textContent.toLowerCase());
    
                    resolve(applicationNames.includes(value.toLowerCase()) ? false : true);
                }, 500);
            }),
        errorMessage: '같은 이름의 Application이 존재합니다. 다른 이름을 입력하세요.'
    }
];

const applicationCreationFormValidator = new window.JustValidate('#applicationCreationForm');
applicationCreationFormValidator
    .addField('#applicationCreationFormControlInput', applicationCreationFormValidatorRules)
    .onSuccess(event => {
        let applicationName = applicationCreationFormControlInput.value;

        let requestUrl = new URL(`${window.location.origin}/api/openapi/applications/`);

        fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                name: applicationName
            })
        }).then(response => {
            if (response.status != 201) {
                throw new Error(response.json());
            }

            return response.json();
        }).then(responseData => {
            let newApplicationId = responseData['id'];
            let newApplicationName = responseData['name'];
            let newApplicationDescription = responseData['description'];
            let newApplicationOpenAPIKey = responseData['access_token'];

            let applicationListGroupElement = applicationListContainerElement.querySelector('.list-group');
            applicationListGroupElement.insertAdjacentHTML('beforeend', `
                <a href="#" class="list-group-item list-group-item-action" aria-current="true" data-bs-toggle="modal" data-bs-target="#applicationManagementModal"
                 data-application-id="${newApplicationId}" data-openapi-key="${newApplicationOpenAPIKey}">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${newApplicationName}</h5>
                    </div>
                    <p class="mb-1">${newApplicationDescription}</p>
                </a>
            `);

            alert(`${applicationName} 애플리케이션을 생성했습니다.`);
        }).catch(error => console.log(error));
    });

let applicationManagementModal = document.getElementById('applicationManagementModal');
applicationManagementModal.addEventListener('show.bs.modal', async function (event) {
    let buttonElement = event.relatedTarget;

    // Set title
    let applicationName = buttonElement.querySelector('h5').textContent;
    let modalTitleElement = applicationManagementModal.querySelector('.modal-title');
    modalTitleElement.textContent = `애플리케이션 관리 - ${applicationName}`;

    // Set OpenAPI key
    let openapiKey = buttonElement.dataset.openapiKey;
    let openapiKeyAccordionCollapseElement = document.getElementById('openapiKeyAccordionCollapse');
    openapiKeyAccordionCollapseElement.querySelector('.accordion-body p').textContent = openapiKey;

    // Set OpenAPI list
    let applicationId = buttonElement.dataset.applicationId;
    let requestUrl = new URL(`${window.location.origin}/api/openapi/subscriptions/`);
    requestUrl.searchParams.append('application-id', applicationId);

    let subscriptions = await loadData(requestUrl);
    let subscriptionOpenAPIIds = subscriptions.map(element => element.openapi.id);

    requestUrl = new URL(`${window.location.origin}/api/openapi/apis/`);
    openapis = await loadData(requestUrl);

    let openapiListTableElement = document.querySelector('#applicationManagementModal .modal-body .row.row table');
    openapiListTableElement.querySelector('tbody').innerHTML = openapis.map((element, index) => {
        let switchCheckboxElementStr = `
            <input class="form-check-input" type="checkbox" role="switch" data-application-id="${applicationId}" data-openapi-id="${element.id}"
             onclick="openAPISubscriptionHandler(event)" style="width: 4em;">
            </input>
        `;

        let subscriptionOpenAPIIdsIndex = subscriptionOpenAPIIds.indexOf(element.id);
        if (subscriptionOpenAPIIdsIndex != -1) {
            switchCheckboxElementStr = `
                <input class="form-check-input" type="checkbox" role="switch" data-application-id="${applicationId}" data-openapi-id="${element.id}"
                 data-subscription-id="${subscriptions[subscriptionOpenAPIIdsIndex].id} "onclick="openAPISubscriptionHandler(event)" style="width: 4em;" checked>
                </input>
            `;
        }

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${element.name}</td>
                <td>${element.version}</td>
                <td>
                    <div class="form-check form-switch">
                        ${switchCheckboxElementStr}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Set deleteApplicationButton
    let deleteApplicationButtonElement = document.getElementById('deleteApplication');
    deleteApplicationButtonElement.setAttribute('data-application-id', applicationId);
    deleteApplicationButtonElement.setAttribute('data-application-name', applicationName);
});

let deleteApplicationButtonElement = document.getElementById('deleteApplication');
deleteApplicationButtonElement.addEventListener('click', event => {
    let buttonElement = event.target;
    let applicationId = buttonElement.dataset.applicationId;
    let applicationName = buttonElement.dataset.applicationName;
    let requestUrl = new URL(`${window.location.origin}/api/openapi/applications/${applicationId}`);

    fetch(requestUrl, {
        method: 'DELETE',
        headers: {
            'X-CSRFTOKEN': csrftoken,
        }
    }).then(response => {
        if (response.ok) {
            alert(`'${applicationName}' 애플리케이션을 삭제했습니다.`);

            bootstrap.Modal.getInstance(applicationManagementModal).hide();

            let applicationListContainerElement = document.getElementById('applicationListContainer');
            let applicationElements = applicationListContainerElement.querySelectorAll('.list-group a');
            applicationElements.forEach(element => {
                if (element.dataset.applicationId == applicationId) {
                    element.remove();
                }
            });

            return response.ok;
        }

        throw new Error(response.status);
    });
});