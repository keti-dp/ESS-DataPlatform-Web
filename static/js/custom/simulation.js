let mobile_item_selec = '';
let mobile_last_move = null;
let transform = '';

/**
 * Get draw flow box script string
 * @param {object} componentObject
 * @returns {string}
 */
function getDrawFlowBoxScript(componentObject) {
    let name = componentObject['name'];
    let inputScript = '';

    for (const [key, value] of Object.entries(componentObject['args'])) {
        let newKey = key.replace('--', '');

        inputScript += `
            <p>${newKey}</p>
            <input type="text" df-${newKey} placeholder="${newKey}" value="${value}">
            <br>
            <br>
        `;
    }

    return `
        <div>
            <div class="title-box"><i class="fas fa-box"></i> ${name} </div>
            <div class="box">
                ${inputScript}
            </div>
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
        <div class="row my-3">
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
    event.target.closest(".drawflow-node").style.zIndex = "9999";
    event.target.children[0].style.display = "block";

    transform = editor.precanvas.style.transform;

    editor.precanvas.style.transform = '';
    editor.precanvas.style.left = editor.canvas_x + 'px';
    editor.precanvas.style.top = editor.canvas_y + 'px';
    editor.editor_mode = "fixed";

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
 * Change drawflow module
 * @param {object} event 
 */
function changeModule(event) {
    let runMenus = document.querySelectorAll('#simulationPipelineWorkflowPanel .menu ul li');
    runMenus.forEach(runMenu => {
        runMenu.classList.remove('text-primary');
    });

    let button = event.currentTarget;
    button.classList.add('text-primary');

    let buttonId = button.id;

    editor.changeModule(buttonId);
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
                        <div>
                            <div class="title-box"><i class="fas fa-box"></i> ${componentName} </div>
                            <div class="box" style="max-height: 300px; overflow-y: auto;">
                                ${inputScript}
                            </div>
                        </div>
                    `;
                }

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
            let simulationPipelineWorkflowPanelRunMenuElement = document.querySelector('#simulationPipelineWorkflowPanel .menu ul');
            simulationPipelineWorkflowPanelRunMenuElement.insertAdjacentHTML('beforeend', `
                <li id="${runId}">실행 결과 ${pipelineRunButtonClickCount++}</li>
            `);

            let runMenu = simulationPipelineWorkflowPanelRunMenuElement.lastElementChild;
            runMenu.addEventListener('click', async (event) => {
                changeModule(event);

                let requestUrl = new URL(`${window.location.origin}/api/simulation/runs/${runId}/`);
                let runInfo = await fetch(requestUrl);
            });

            let drawflowOriginExportedData = editor.export();
            drawflowOriginExportedData['drawflow'][runId] = drawflowOriginExportedData['drawflow']['Home'];
            editor.import(drawflowOriginExportedData);
            
        })
        .catch(error => console.log(error));
    });
});