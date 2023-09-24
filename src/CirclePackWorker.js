import { WorkerLogic } from './WorkerLogic.js';
import { sendWorkerMessage, processWorkerMessage } from './util.js';

/**
 * @type {WorkerLogic}
 */
const workerLogic = new WorkerLogic();

/**
 * Send message back to the main script
 *
 * @param {WorkerResponse} response
 */
function sendResponse(response) {
	sendWorkerMessage(self, response);
}

self.addEventListener('message', event => {
	const message = processWorkerMessage(event);
	workerLogic.handleWorkerMessage(message, sendResponse);
});
