import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import path = require('path');

suite('Extension Test Suite - Start Language Server', () => {
	
	test("Staring server", async function() { 

		console.info("Staring server...");

		//let language server start and run for 3000ms 
		this.timeout(5000);

		let javaHome  = process.env["JAVA_HOME"];
		let jar = path.join(__dirname, '..', '..', '..', 'launcher', 'tpcm-language-server.jar');

		let excecutable: string = path.join(String(javaHome), 'bin', 'java');
		
		let command = excecutable + " -jar " +  jar;
	
		let serverStartedSuccessfully = await startServer(command);

		assert.equal(serverStartedSuccessfully, true);

	});

});

function startServer(cmd: string) {
	const exec = require('child_process').exec;
	return new Promise((resolve, reject) => {
		exec(cmd, { timeout: 3000 }, (error: string, stdout: string, stderr: string) => {
			resolve(stderr ? false : true);
		});
	});
}
