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
        <div id="simulationClear" class="tool">
            <i class="fas fa-tools"></i><span> ${i18next.t('resetOnlyNewPipeline')}</span>
        </div>
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
 * Get drawflow data
 * @param {object} simulationPipelinesSpec 
 * @returns {object}
 */
// function getDrawFlowData(simulationPipelinesSpec) {
//     // 'Home' module is required! - default
//     let drawFlowData = {
//         "Home": {
//             "data": {}
//         }
//     };

//     for (const [simulationPipelinesKey, simulationPipelinesValue] of Object.entries(simulationPipelinesSpec)) {
//         let simulationPipeline = simulationPipelinesValue['pipeline'];
//         let simulationPipelineKeys = Object.keys(simulationPipeline);
//         let pipelineData = {};

//         simulationPipelineKeys.forEach((key, index) => {
//             let data = simulationPipeline[key]["args"];
//             let newData = {};

//             for (const key in data) {
//                 let newKey = key.replace('--', '');
//                 newData[newKey] = data[key];
//             }

//             let id = index;
//             let name = simulationPipeline[key]["name"];
//             let html = getDrawFlowBoxScript(simulationPipeline[key]);
//             let inputs;
//             let outputs;
//             let pos_x = 100 + 400 * index;
//             let pos_y = 100;

//             if (index == 0) {
//                 inputs = {};
//                 outputs = {
//                     "output_1": {
//                         "connections": [
//                             {
//                                 "node": `${index + 1}`,
//                                 "output": "input_1"
//                             }
//                         ]
//                     }
//                 };
//             } else if (index == simulationPipelineKeys.length - 1) {
//                 inputs = {
//                     "input_1": {
//                         "connections": [
//                             {
//                                 "node": `${index - 1}`,
//                                 "input": "output_1"
//                             }
//                         ]
//                     }
//                 };
//                 outputs = {};
//             } else {
//                 inputs = {
//                     "input_1": {
//                         "connections": [
//                             {
//                                 "node": `${index - 1}`,
//                                 "input": "output_1"
//                             }
//                         ]
//                     }
//                 };
//                 outputs = {
//                     "output_1": {
//                         "connections": [
//                             {
//                                 "node": `${index + 1}`,
//                                 "output": "input_1"
//                             }
//                         ]
//                     }
//                 };
//             }

//             pipelineData[id] = {
//                 "id": id,
//                 "name": name,
//                 "data": newData,
//                 "class": name,
//                 "html": html,
//                 "inputs": inputs,
//                 "outputs": outputs,
//                 "pos_x": pos_x,
//                 "pos_y": pos_y,
//                 "typenode": false
//             };
//         });

//         drawFlowData[simulationPipelinesKey] = {
//             "data": pipelineData
//         };

//         return drawFlowData;
//     }
// }

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
// function changeModule(event) {
//     let pipelineButtons = document.querySelectorAll('.pipeline-drawflow');
//     pipelineButtons.forEach(pipelineButton => {
//         pipelineButton.classList.remove('bg-primary');
//     });

//     let button = event.currentTarget;
//     button.classList.add('bg-primary');

//     let buttonId = button.id;

//     editor.changeModule(buttonId);
// }

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
    let simulationResourcePanelScript = getSimulationResourcePanelScript(responseData);

    let simulationResourcePanelElement = document.getElementById('simulationResourcePanel');
    simulationResourcePanelElement.innerHTML = simulationResourcePanelScript;

    let pipelineChangeArgsObject = {};
    let pipelineTemplates;
    let pipelineId;

    let pipelineRunButton = document.getElementById('pipelineRun');
    pipelineRunButton.addEventListener('click', event => {

        let exportedData = editor.export();
        let exportedDataObject = exportedData['drawflow']['Home']['data'];
        
        Object.entries(exportedDataObject).forEach(([exportedDataObjectKey, exportedDataObjectValue]) => {
            let pipelineTemplateName = exportedDataObjectValue['name'];
            let args = [];

            Object.entries(exportedDataObjectValue['data']).forEach(([dataKey, dataValue]) => {
                args.push(`--${dataKey}`);
                args.push(dataValue);
            });

            pipelineChangeArgsObject[pipelineTemplateName] = args;
        });

        pipelineTemplates.forEach((pipelineTemplate, index) => {
            let name = pipelineTemplate['name'];
            let args = pipelineChangeArgsObject[name];

            if (pipelineTemplates[index]['container']) {
                pipelineTemplates[index]['container']['args'] = args;
            }
        });

        console.log(pipelineTemplates);

        let requestUrl = new URL(`${window.location.origin}/api/simulation/pipelines/${pipelineId}/pipeline_run/`);

        fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pipelineTemplates)
        });
    });

    let pipelineElements = document.querySelectorAll('.pipeline-drawflow');
    pipelineElements.forEach(pipelineElement => {
        pipelineElement.addEventListener('click', (event) => {
            editor.clear();
            
            let button = event.currentTarget;
            pipelineId = button.id;
            let pipelineRequestUrl = new URL(`${window.location.origin}/api/simulation/pipelines/${pipelineId}`);

            fetch(pipelineRequestUrl).then(pipelineResponse => {
                return pipelineResponse.json()
            }).then(pipelineResponseData => {
                console.log(pipelineResponseData);

                let pipelineEntrypoint = pipelineResponseData['entrypoint'];
                let piplineTemplatesObject = {};
                pipelineTemplates = pipelineResponseData['templates'];

                function getPipelineDrawFlowBoxScript(pipelineTemplate) {
                    let name = pipelineTemplate['name'];
                    let inputScript = '';

                    let args = pipelineTemplate['container']['args'];
                    let argsObject = {};

                    for (let i = 0; i < args.length; i = i + 2) {
                        let key = args[i];
                        let value = args[i + 1]

                        argsObject[key] = value;
                    }

                    for (const [key, value] of Object.entries(argsObject)) {
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
                            <div class="box" style="max-height: 300px; overflow-y: auto;">
                                ${inputScript}
                            </div>
                        </div>
                    `;
                }

                pipelineTemplates.forEach((pipelineTemplate, index) => {
                    let pipelineTemplateName = pipelineTemplate['name'];

                    if (pipelineTemplateName !== pipelineEntrypoint) {
                        let pipelineHTML = getPipelineDrawFlowBoxScript(pipelineTemplate);

                        // for (const key in data) {
                        //     let newKey = key.replace('--', '');
                        //     newData[newKey] = data[key];
                        // }

                        let args = pipelineTemplate['container']['args'];
                        let newData = {};

                        for (let i = 0; i < args.length; i = i + 2) {
                            let key = args[i].replace('--', '');
                            let value = args[i + 1]

                            newData[key] = value;
                        }

                        let pos_x = 100 + 400 * index;
                        let pos_y = 100;

                        let nodeId = editor.addNode(pipelineTemplateName, 1, 1, pos_x, pos_y, pipelineTemplateName, newData, pipelineHTML);

                        piplineTemplatesObject[pipelineTemplateName] = nodeId;
                    }
                });

                let pipelineConnections = [];

                pipelineTemplates.forEach((pipelineTemplate, index) => {
                    let pipelineTemplateDag = pipelineTemplate['dag'];

                    if (pipelineTemplateDag) {
                        let pipelineTemplateDagTasks = pipelineTemplateDag['tasks'];
                        pipelineTemplateDagTasks.forEach(pipelineTemplateDagTask => {
                            let pipelineTemplateDagTaskName = pipelineTemplateDagTask['name'];
                            let pipelineTemplateDagTaskDependencies = pipelineTemplateDagTask['dependencies'];

                            if (pipelineTemplateDagTaskDependencies) {
                                pipelineTemplateDagTaskDependencies.forEach(pipelineTemplateDagTaskDependency => {
                                    let inputId = piplineTemplatesObject[pipelineTemplateDagTaskDependency];
                                    let outputId = piplineTemplatesObject[pipelineTemplateDagTaskName];
    
                                    pipelineConnections.push([inputId, outputId]);
    
                                    editor.addConnection(inputId, outputId, 'output_1','input_1');
                                });
                            }
                        });
                    }
                });

                // let pipelineDAG = pipelineTemplates.find(element => element['name'] == pipelineEntrypoint)['dag'];
                // console.log(pipelineDAG);

                // let pipelineDAGTasks = pipelineDAG['tasks'];

                // pipelineDAGTasks.forEach((pipelineDAGTasks, index) => {
                //     let name = pipelineDAGTasks['name'];

                //     const data = {
                //         name: ''
                //     };

                //     let pos_x = 100 + 400 * index;
                //     let pos_y = 100;

                //     editor.addNode(name, 1, 1, pos_x, pos_y, name, data, name);
                // });

                // pipelineDAGTasks.forEach((pipelineDAGTasks, index) => {
                //     let name = pipelineDAGTasks['name'];
                    
                //     editor.addConnection( 'output_1','input_1');
                // });
            });
            // changeModule(event);
        });
});
});



// let drawFlowData = getDrawFlowData(simulationPipelinesSpec);
// let drawflowElement = document.getElementById('drawflow');
// drawflowElement.addEventListener('dragover', (event) => {
//     allowDrop(event);
// });
// drawflowElement.addEventListener('drop', (event) => {
//     drop(event);
// });

// let editor = new Drawflow(drawflowElement);
// editor.reroute = true;
// editor.start();

// let drawFlowImportData = {
//     "drawflow": drawFlowData
// };

// editor.import(drawFlowImportData);

// let currentDrawFlowModuleName = 'Home';

// Events!
// editor.on('moduleChanged', function (name) {
//     currentDrawFlowModuleName = name;
// })

// let componentElements = document.getElementsByClassName('drag-drawflow');

// for (let index = 0; index < componentElements.length; index++) {
//     let componentElement = componentElements[index];
//     componentElement.addEventListener('touchend', drop, false);
//     componentElement.addEventListener('touchmove', positionMobile, false);
//     componentElement.addEventListener('touchstart', drag, false);
//     componentElement.addEventListener('dragstart', event => {
//         drag(event);
//     });
// }

// Clear event for simulation
// let simulationClearButton = document.getElementById('simulationClear');
// simulationClearButton.addEventListener('click', event => {
//     if (currentDrawFlowModuleName == 'Home') {
//         editor.clearModuleSelected();
//     } else {
//         alert(i18next.t('notResetPipelineMessage', { ns: 'message' }));
//     }
// });

// Run event for simulation

// let simulationRunButton = document.getElementById('simulationRun');
// simulationRunButton.addEventListener('click', event => {
//     let exportedData = editor.export();
//     let data = exportedData['drawflow'][currentDrawFlowModuleName]['data'];

//     // Check empty data
//     if (data.constructor === Object && Object.keys(data).length === 0) {
//         alert(i18next.t('choiceNewComponentOrPipelineMessage', { ns: 'message' }));

//         return false;
//     }

//     let pipelineName = currentDrawFlowModuleName;

//     if (pipelineName === "Home") {
//         pipelineName = 'dynamic_pipeline';
//     }

//     let result = {
//         'pipeline': pipelineName,
//         'parameter': [],
//     };

//     Object.keys(data).forEach((key, index) => {
//         let pipelineComponentName = `component${index + 1}`;
//         let parameter = data[key]['data'];
//         let newParameter = {};

//         for (const key in parameter) {
//             let newKey = `--${key}`;

//             newParameter[newKey] = parameter[key];
//         }

//         let item = [pipelineComponentName, newParameter];

//         result['parameter'].push(item);
//     });

//     let requestUrl = new URL(`${window.location.origin}/api/simulation/run/`);

//     fetch(requestUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(result),
//     }).then(response => {
//         if (response.ok) {
//             return response.json();
//         }

//         throw new Error(response.statusText);
//     }).then(data => {
//         console.log('data:', data);
//     }).catch(error => console.log(error));
// });