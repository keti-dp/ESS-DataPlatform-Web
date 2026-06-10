const currentScriptData = document.currentScript.dataset;
const apiDescription = currentScriptData.apiDescription;
const apiType = currentScriptData.apiType;
const apiVersion = currentScriptData.apiVersion;
const apiContext = currentScriptData.apiContext;
const apiUpdatedTime = currentScriptData.apiUpdatedTime;

const httpMethods = ['get', 'post', 'put', 'delete', 'options', 'head', 'patch', 'trace'];
// API 게이트웨이 URL을 입력하세요 (예: https://api.example.com)
const apiGatewayURL = "";

const apiDefinition = JSON.parse(document.getElementById('apiDefinition').textContent);

/**
 * Get api content
 * @param {string} httpMethod 
 * @param {object} apiOperationObject 
 * @param {string} apiPath 
 * @returns {object}
 */
function getAPIContent(httpMethod, apiOperationObject, apiPath) {
    let apiSummary = apiOperationObject['summary'];
    let apiURL = `${apiGatewayURL}${apiContext}/${apiVersion}${apiPath}`;
    let apiDescription = apiOperationObject['description'];

    // Get the apiParameter
    let apiParameters = apiOperationObject['parameters'];
    let apiParameter = apiParameters.map(apiParameterObject => {
        let name = apiParameterObject['name'];
        let parameterType = apiParameterObject['in'];
        let required = apiParameterObject['required'];
        let description = apiParameterObject['description'];
        let example = apiParameterObject['example'];

        return {
            name: name,
            parameterType: parameterType,
            required: required,
            description: description,
            example: example
        };
    });

    // Get the apiRequestSampleURL
    let apiRequestSampleURL = getAPIRequestSampleURL(apiURL, apiParameters);

    // Get the apiResponseSample
    let apiResponsesObject = apiOperationObject['responses'];
    let apiResponseSample = Object.keys(apiResponsesObject).map(httpStatus => {
        let apiResponseObject = apiResponsesObject[httpStatus];
        let description = apiResponseObject['description'];
        let apiMediaTypeObject = apiResponseObject['content'];
        let apiMediaType = Object.keys(apiMediaTypeObject)[0];
        let example = apiMediaTypeObject[apiMediaType]['example'];

        return {
            httpStatus: httpStatus,
            description: description,
            example: example
        }
    });

    let apiContent = {
        "apiHttpMethod": httpMethod,
        "apiSummary": apiSummary,
        "apiURL": apiURL,
        "apiDescription": apiDescription,
        "apiParameter": apiParameter,
        "apiRequestSampleURL": apiRequestSampleURL,
        "apiResponseSample": apiResponseSample
    };

    return apiContent;
}

/**
 * Get api request sample url
 * @param {string} apiURL Template API URL
 * @param {Array} apiParameters
 * @returns {string}
 */
function getAPIRequestSampleURL(apiURL, apiParameters) {
    let apiRequestSampleURL = apiURL;

    apiParameters.forEach(parameter => {
        let parameterName = parameter['name'];
        let parameterType = parameter['in'];
        let parameterExample = parameter['example'];

        if (parameterExample) {
            if (parameterType == "path") {
                apiRequestSampleURL = apiRequestSampleURL.replace(`{${parameterName}}`, parameterExample);
            }

            if (parameterType == "query") {
                if (apiRequestSampleURL.includes('?')) {
                    apiRequestSampleURL += `&${parameterName}=${parameterExample}`;
                } else {
                    apiRequestSampleURL += `?${parameterName}=${parameterExample}`;
                }
            }
        }
    });

    return apiRequestSampleURL;
}

let apiContents = [];
let apiPathsObject = apiDefinition['paths'];

for (const apiPath in apiPathsObject) {
    let apiPathItemObject = apiPathsObject[apiPath];

    for (const httpMethod of httpMethods) {
        let apiOperationObject = apiPathItemObject[httpMethod];

        if (apiOperationObject) {
            let newAPIPath = apiPath;

            if (apiPath.includes('?*')) {
                newAPIPath = apiPath.replace('?*', '');
            }

            let apiContent = getAPIContent(httpMethod, apiOperationObject, newAPIPath);

            apiContents.push(apiContent);
        }
    }
}

let apiListGroupScript = '';
let apiContentScript = `
    <div class="row">
        <div class="col">
            <div class="mb-3 p-4 bg-secondary text-white text-break">
                <p><i class="bi bi-info-circle"></i> ${apiDescription}</p>
            </div>
        </div>
    </div>

    <!-- OpenAPI type, version & updated time -->
    <div class="row mb-5">
        <ul class="list-unstyled li-space-lg mb-4">
            <li class="d-flex py-2">
                <i class="fas fa-square"></i>
                <div class="flex-grow-1"><strong>타입:</strong> ${apiType}</div>
            </li>
            <li class="d-flex py-2">
                <i class="fas fa-square"></i>
                <div class="flex-grow-1"><strong>버전:</strong> ${apiVersion}</div>
            </li>
            <li class="d-flex py-2">
                <i class="fas fa-square"></i>
                <div class="flex-grow-1"><strong>업데이트 시간:</strong>
                    ${apiUpdatedTime}
                </div>
            </li>
            <li class="d-flex py-2">
                <i class="fas fa-square"></i>
                <div class="flex-grow-1"><strong>데이터셋:</strong>
                    <a href="#" class="link-primary" aria-current="true" data-bs-toggle="modal"
                     data-bs-target="#datasetListModal">
                        확인하기
                    </a>
                </div>
            </li>
        </ul>
    </div>
`;

apiContents.forEach((apiContent, index) => {
    let apiHttpMethod = apiContent['apiHttpMethod'];
    let apiSummary = apiContent['apiSummary'];
    let apiURL = apiContent['apiURL'];
    let apiDescription = apiContent['apiDescription'];
    let apiParameter = apiContent['apiParameter'];
    let apiRequestSampleURL = apiContent['apiRequestSampleURL'];
    let apiResponseSample = apiContent['apiResponseSample'];

    // Get the apiParameterScript;
    let apiParameterScript = '';

    if (apiParameter.length > 0) {
        let tbodyScript = '';

        apiParameter.forEach(parameter => {
            let name = parameter['name'];
            let parameterType = parameter['parameterType'];
            let required = parameter['required'];
            let description = parameter['description'];
            let example = parameter['example'];

            tbodyScript += `
                <tr>
                    <td>${name}</td>
                    <td>${parameterType}</td>
                    <td>${required}</td>
                    <td>${description}</td>
                    <td>${example ? example : ''}</td>
                </tr>
            `;
        });

        apiParameterScript = `
            <table class="table mb-5">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>파라미터 타입</th>
                        <th>필수</th>
                        <th>설명</th>
                        <th>예시</th>
                    </tr>
                </thead>
                <tbody>
                    ${tbodyScript}
                </tbody>
            </table>
        `;
    }

    // Get the apiResponseSampleScript;
    let apiResponseSampleScript = '';

    apiResponseSample.forEach(sample => {
        let httpStatus = sample['httpStatus'];
        let description = sample['description'];
        let example = sample['example'];

        apiResponseSampleScript += `
            <p>${httpStatus} ${description}</p>
            <pre>
                <code class="language-json">${JSON.stringify(example, null, 4)}</code>
            </pre>
        `
    });

    apiListGroupScript += `
        <small>
            <a class="list-group-item list-group-item-action" href="#list-item-${index + 1}">
                <strong class="text-success">${apiHttpMethod.toUpperCase()}</strong> ${apiSummary}
            </a>
        </small>
    `

    apiContentScript += `
        <div id="list-item-${index + 1}" class="row mb-5">
            <div class="col">
                <h3><strong class="text-success">${apiHttpMethod.toUpperCase()}</strong> ${apiSummary}</h3>
                <div class="text-box mb-3 p-4 text-break">
                    <p>${apiURL}</p>
                </div>
                <p class="mb-5">${apiDescription}</p>
                <h5>파라미터</h5>
                ${apiParameterScript ? apiParameterScript : '<p class="mb-5">없음</p>'}
                <h5>요청 샘플</h5>
                <div class="text-box mb-5 p-4 text-break" style="background: #f3f3f3;">
                    <p>${apiRequestSampleURL}</p>
                </div>
                <h5>응답 샘플</h5>
                ${apiResponseSampleScript}
            </div>
        </div>
    `;
});

let apiListGroupElement = document.getElementById('apiListGroup');
apiListGroupElement.innerHTML = apiListGroupScript;

let apiContentElement = document.getElementById('apiContent');
apiContentElement.innerHTML = apiContentScript;