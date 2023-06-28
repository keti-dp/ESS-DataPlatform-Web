let mobile_item_selec = '';
let mobile_last_move = null;
let transform = '';

/**
 * Get data with async
 * @param {object} requestUrl 
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
 * Get pipeline draflow box script
 * @param {object} component 
 * @param {string} componentName 
 * @returns {string}
 */
function getPipelineDrawFlowBoxScript(component, componentName) {
    let inputScript = '';
    let componentArgs = component['args'];

    for (const [componentArgName, componentArgValue] of Object.entries(componentArgs)) {
        let componentNewArgName = componentArgName.replace('--', '');

        inputScript += `
            <p>${componentNewArgName}</p>
            <input type="text" df-${componentNewArgName} placeholder="${componentNewArgName}" value="${componentArgValue}">
            <br>
            <br>
        `;
    }

    return `
        <div">
            <div class="title-box">
                <i class="fas fa-box"></i> ${componentName}
            </div>
            <div class="box" style="max-height: 300px; overflow-y: auto;">
                ${inputScript}
            </div>
            <div class="box-footer text-center"></div>
        </div>
    `;
}

function getSimulationResourcePanelScript(simulationPipelines) {
    let pipelineElementListScript = '';

    simulationPipelines.forEach(simulationPipeline => {
        let simulationPipelineId = simulationPipeline['id'];
        let simulationPipelineName = simulationPipeline['name'];

        pipelineElementListScript += `
            <div id="${simulationPipelineId}" class="pipeline-drawflow">
                <i class="fas fa-project-diagram"></i><span> ${simulationPipelineName}</span>
            </div>
        `;
    });

    let toolElementListScript = `
        <div id="pipelineRun" class="tool">
            <i class="fas fa-tools"></i><span> ${i18next.t('execution')}</span>
        </div>
    `;

    let simulationResourcePanelScript = `
        <div class="row my-3" style="white-space: nowrap;">
            <h3>${i18next.t('pipeline')}</h3>
            ${pipelineElementListScript}
        </div>
        <div class="row">
            <h3>${i18next.t('tool')}</h3>
            ${toolElementListScript}
        </div>
    `;

    return simulationResourcePanelScript;
};

/**
 * Set mobile_last_move
 * @param {object} event 
 */
function positionMobile(event) {
    mobile_last_move = event;
}

/**
 * Prevent event
 * @param {object} event 
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Drag event for simulation resource
 * @param {object} event 
 */
function drag(event) {
    if (currentDrawFlowModuleName == "Home") {
        if (event.type === "touchstart") {
            mobile_item_selec = event.target.closest(".drag-drawflow").getAttribute('data-node');
        } else {
            event.dataTransfer.setData("node", event.target.getAttribute('data-node'));
        }
    } else {
        event.preventDefault();

        alert(i18next.t('notAddingComponentMessage', { ns: 'message' }));
    }
}

/**
 * Drop event for simulation resource after drag
 * @param {object} event 
 */
function drop(event) {
    if (event.type === "touchend") {
        let parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");

        if (parentdrawflow != null) {
            addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
        }

        mobile_item_selec = '';
    } else {
        event.preventDefault();

        let data = event.dataTransfer.getData("node");

        addNodeToDrawFlow(data, event.clientX, event.clientY);
    }

}

/**
 * Add node to drawflow
 * @param {string} name node name
 * @param {number} pos_x position x
 * @param {number} pos_y position y 
 * @returns 
 */
function addNodeToDrawFlow(name, pos_x, pos_y) {
    if (editor.editor_mode === 'fixed') {
        return false;
    }
    pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

    let simulationComponent = simulationComponentsSpec[name.toLowerCase()];
    let simulationComponentInputScript = '';
    let simulationComponentArgsObject = {};

    for (const [key, value] of Object.entries(simulationComponent['args'])) {
        let newKey = key.replace('--', '');

        simulationComponentInputScript += `
            <p>${newKey}</p>
            <input type="text" df-${newKey} placeholder="${newKey}" value="${value}">
            <br>
            <br>
        `;

        simulationComponentArgsObject[newKey] = value;
    }

    let simulationComponentScript = `
        <div>
            <div class="title-box"><i class="fas fa-box"></i> ${name} </div>
            <div class="box">
                ${simulationComponentInputScript}
            </div>
        </div>
    `;

    editor.addNode(name, 1, 1, pos_x, pos_y, name, simulationComponentArgsObject, simulationComponentScript);
}

function showpopup(event) {
    let button = event.currentTarget;
    
    drawflowLogModal.show(button);
}

function closemodal(event) {
    event.target.closest(".drawflow-node").style.zIndex = "2";
    event.target.parentElement.parentElement.style.display = "none";
    editor.precanvas.style.transform = transform;
    editor.precanvas.style.left = '0px';
    editor.precanvas.style.top = '0px';
    editor.editor_mode = "edit";
}


/**
 * Change run result menu event
 * @param {object} event 
 * @returns
 */
async function changeRunResultMenu(event, currentDrawFlowNodesObject) {
    let runResultMenus = document.querySelectorAll('#simulationPipelineWorkflowPanel .menu ul li');
    runResultMenus.forEach(runResultMenu => {
        runResultMenu.classList.remove('text-primary');
    });

    let button = event.currentTarget;
    button.classList.add('text-primary');

    let buttonId = button.id;

    // Change module process -> clear and new create UI
    editor.changeModule(buttonId);

    // Re set-up - run status of components
    let requestUrl = new URL(`${window.location.origin}/api/simulation/runs/${buttonId}/`);
    let runInfo = await loadData(requestUrl);
    let componentsRunStatus = runInfo['run_status']['components'];

    // Re set-up - run status of drawflow nodes
    createDrawflowNodesRunStatus(componentsRunStatus, currentDrawFlowNodesObject);

    // Re set-up - components modal
    let currentDrawFlowNodeElements = document.querySelectorAll(".drawflow-node ");
    currentDrawFlowNodeElements.forEach(currentDrawflowNodeElement => {
        currentDrawflowNodeElement.addEventListener('dblclick', currentDrawflowNodeElementEvent => {
            showpopup(currentDrawflowNodeElementEvent);
        });
    });
}

function changeMode(option) {
    if (option == 'lock') {
        lock.style.display = 'none';
        unlock.style.display = 'block';
    } else {
        lock.style.display = 'block';
        unlock.style.display = 'none';
    }

}

/**
 * Create run status of draflow nodes
 * @param {object} componentsRunStatus 
 * @param {object} currentDrawFlowNodesObject 
 */
function createDrawflowNodesRunStatus(componentsRunStatus, currentDrawFlowNodesObject) {
    Object.keys(componentsRunStatus).forEach(componentName => {
        let phase = componentsRunStatus[componentName]['phase'];
        let logPath = componentsRunStatus[componentName]['log_path'];
        let drawflowNodeElement = document.getElementById(currentDrawFlowNodesObject[componentName]);
        let drawflowNodeStatusElement = drawflowNodeElement.querySelector('.box-footer');
        
        switch (phase) {
            case 'Failed':
                drawflowNodeStatusElement.innerHTML = `
                    <i class="fas fa-ban" style="color: #DC4C64;"></i>
                `;

                break;
            case 'Pending':
                drawflowNodeStatusElement.innerHTML = `
                    <i class="fas fa-spinner"></i>
                `;

                break;
            case 'Running':
                drawflowNodeStatusElement.innerHTML = `
                    <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                `;

                break;
            case 'Succeeded':
                drawflowNodeStatusElement.innerHTML = `
                    <i class="fas fa-check" style="color: #14A44D;"></i>
                `;

                break;
            default:
                break;
        }

        if (logPath) {
            drawflowNodeElement.setAttribute('data-bs-log-path', logPath);
        }
    });
}

/**
 * Init tasks
 */
let drawflowElement = document.getElementById('drawflow');
let editor = new Drawflow(drawflowElement);
editor.reroute = true;
editor.start();

let requestUrl = new URL(`${window.location.origin}/api/simulation/pipelines/`);

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    // Create simulation resource panel
    let simulationResourcePanelElement = document.getElementById('simulationResourcePanel');
    simulationResourcePanelElement.innerHTML = getSimulationResourcePanelScript(responseData);

    // Create pipeline and event in drawflow
    let pipelineId;
    let pipelineElements = document.querySelectorAll('.pipeline-drawflow');
    pipelineElements.forEach(pipelineElement => {
        pipelineElement.addEventListener('click', (event) => {
            editor.changeModule('Home');
            editor.clearModuleSelected();
            
            let button = event.currentTarget;
            pipelineId = button.id;
            let pipelineRequestUrl = new URL(`${window.location.origin}/api/simulation/pipelines/${pipelineId}`);

            fetch(pipelineRequestUrl).then(pipelineResponse => {
                return pipelineResponse.json();
            }).then(pipelineResponseData => {
                let entrypoint = pipelineResponseData['entrypoint'];
                let pipelineInfo = pipelineResponseData['pipeline_info'];
                let componentNodeIdObject = {};
                let componentLevelCountObject = {};
                let componentLevelObject = {};

                Object.keys(pipelineInfo).forEach(componentName => {
                    if (componentName !== entrypoint) {
                        let component = pipelineInfo[componentName];
                        let pipelineDrawFlowBoxScript = getPipelineDrawFlowBoxScript(component, componentName);

                        let componentArgs = component['args'];
                        let componentArgsData = {};

                        Object.keys(componentArgs).forEach(componentArgName => {
                            let componentArgNewName = componentArgName.replace('--', '');
                            let componentArgValue = componentArgs[componentArgName];

                            componentArgsData[componentArgNewName] = componentArgValue
                        });

                        let componentLevel = component['level'];

                        componentLevelObject[componentLevel] = componentLevel;

                        if (componentLevelCountObject.hasOwnProperty(componentLevel)) {
                            componentLevelCountObject[componentLevel] += 1;
                        } else {
                            componentLevelCountObject[componentLevel] = 0;
                        }

                        let pos_x = 100 + 400 * componentLevel;
                        let pos_y = 100 + 400 * componentLevelCountObject[componentLevel];

                        let nodeInputCount;
                        let nodeOutputCount = 1

                        if (componentLevel == 0) {
                            nodeInputCount = 0;
                        } else {
                            nodeInputCount = 1;
                        }

                        let nodeId = editor.addNode(componentName, nodeInputCount, nodeOutputCount, pos_x, pos_y, componentName, componentArgsData, pipelineDrawFlowBoxScript);

                        componentNodeIdObject[componentName] = nodeId;
                    }
                });

                Object.keys(pipelineInfo).forEach(componentName => {
                    let component = pipelineInfo[componentName];
                    let componentDependencies = component['dependencies'];

                    if (componentDependencies) {
                        componentDependencies.forEach(componentDependency => {
                            let inputId = componentNodeIdObject[componentDependency];
                            let outputId = componentNodeIdObject[componentName];

                            editor.addConnection(inputId, outputId, 'output_1','input_1');
                        });
                    }
                });
            });
        });
    });

    // Create pipeline run event
    let componentChangeArgsObject = {};
    let pipelineRunButtonClickCount = 1;

    let pipelineRunButton = document.getElementById('pipelineRun');
    pipelineRunButton.addEventListener('click', event => {
        let exportedData = editor.export();
        let exportedDataObject = exportedData['drawflow']['Home']['data'];
        
        Object.entries(exportedDataObject).forEach(([exportedDataObjectKey, exportedDataObjectValue]) => {
            let componentName = exportedDataObjectValue['name'];
            let componentArgs = [];

            Object.entries(exportedDataObjectValue['data']).forEach(([dataKey, dataValue]) => {
                componentArgs.push(`--${dataKey}`);
                componentArgs.push(dataValue);
            });

            componentChangeArgsObject[componentName] = componentArgs;
        });

        let requestUrl = new URL(`${window.location.origin}/api/simulation/pipelines/${pipelineId}/pipeline_run/`);

        fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(componentChangeArgsObject)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            let runId = data['id'];
            let simulationPipelineWorkflowPanelRunResultMenuElement = document.querySelector('#simulationPipelineWorkflowPanel .menu ul');
            simulationPipelineWorkflowPanelRunResultMenuElement.insertAdjacentHTML('beforeend', `
                <li id="${runId}">${i18next.t('execution')} ${i18next.t('result')} ${pipelineRunButtonClickCount++}</li>
            `);

            let drawflowOriginExportedData = editor.export();
            drawflowOriginExportedData['drawflow'][runId] = drawflowOriginExportedData['drawflow']['Home'];
            editor.import(drawflowOriginExportedData);

            let currentDrawFlowNodesObject = {};
            let currentDrawFlowNodeElements = document.querySelectorAll(".drawflow-node ");
            currentDrawFlowNodeElements.forEach(currentDrawflowNodeElement => {
                let nodeId = currentDrawflowNodeElement.id;
                let nodeName = currentDrawflowNodeElement.classList[1];

                currentDrawFlowNodesObject[nodeName] = nodeId;

                currentDrawflowNodeElement.addEventListener('dblclick', event => {
                    showpopup(event);
                });
            });

            let runResultMenu = simulationPipelineWorkflowPanelRunResultMenuElement.lastElementChild;
            runResultMenu.addEventListener('click', async (event) => {
                await changeRunResultMenu(event, currentDrawFlowNodesObject);
            });

            let runInterval = setInterval(async () => {
                let requestUrl = new URL(`${window.location.origin}/api/simulation/runs/${runId}/`);
                let runInfo = await loadData(requestUrl);
                let pipelineRunStatus = runInfo['run_status']['pipeline'];
                let componentsRunStatus = runInfo['run_status']['components'];

                createDrawflowNodesRunStatus(componentsRunStatus, currentDrawFlowNodesObject);

                if (pipelineRunStatus != 'Running') {
                    clearInterval(runInterval);
                }
            }, 2000);
            
        })
        .catch(error => console.log(error));
    });
});

// Modal event
let drawflowLogModalElement = document.getElementById('drawflowLogModal');
drawflowLogModalElement.addEventListener('show.bs.modal', function (event) {
    let button = event.relatedTarget;
    let nodeName = button.classList[1];
    let logPath = button.getAttribute('data-bs-log-path');

    if (logPath) {
        let requestUrl = new URL(`${window.location.origin}/api/simulation/get-log/`);
        requestUrl.searchParams.append('log-path', logPath);

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(responseData => {
            let logData = responseData['data'];

            let modalTitle = drawflowLogModalElement.querySelector('.modal-title');
            let modalBody = drawflowLogModalElement.querySelector('.modal-body');

            modalTitle.textContent = nodeName;
            modalBody.innerHTML = logData;
        }).catch(error => console.log(error));
    }
});

let drawflowLogModal = new bootstrap.Modal(drawflowLogModalElement);