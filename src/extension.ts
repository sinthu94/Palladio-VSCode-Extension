import * as vscode from 'vscode';
import * as path from 'path';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions
  } from 'vscode-languageclient';

function getConfigurationParams() {

	let javaHome  = vscode.workspace.getConfiguration("palladio").get("javaHome");
	let jar = vscode.workspace.getConfiguration("palladio").get("languageServer");
	
	if (javaHome === "") {
		javaHome = process.env["JAVA_HOME"];
	}

	if (jar === "") {
		jar = path.join(__dirname, '..', 'launcher', 'launcher.jar');
	}

	return {
        javaHome: javaHome,
        jar: jar
    };
}

function showErrorMsgCausedByEmptyFields(javaHome: String, jar: String): boolean {

	if (!javaHome) {
		vscode.window.showErrorMessage("Palladio Extension activation failed, since JAVA_HOME was not set.");
		return true;
	}

	if (!jar) {
		vscode.window.showErrorMessage("Palladio Extension activation failed, since path to language server was not set.");
		return true;
	}

	return false;
}

function buildServerOptions(javaHome: string, jar: string) : ServerOptions {
	let excecutable: string = path.join(javaHome, 'bin', 'java');
	const args: string[] = ['-jar', jar];
	let serverOptions: ServerOptions = {
		command: excecutable,
		args: args,
		options: {}
	};

	return serverOptions;
}

function buildClientOptions() : LanguageClientOptions {
	let clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'palladio' }]
	};

	return clientOptions;
}

function buildLangClient(serverOptions: ServerOptions, clientOptions: LanguageClientOptions) : LanguageClient {
	let client = new LanguageClient(
		'Palladio', 
		'Palladio Language Server', 
		serverOptions, 
		clientOptions
	);
	client.onReady().then(() => {
		vscode.window.showInformationMessage("Palladio Language Server is now active!");
	});
	return client;
}

export function activate(context: vscode.ExtensionContext) {
	
	const { javaHome, jar } = getConfigurationParams();
	let errorShowed = showErrorMsgCausedByEmptyFields(String(javaHome), String(jar));
	if (errorShowed) {
		return;
	}
	let serverOptions = buildServerOptions(String(javaHome), String(jar));
	let clientOptions = buildClientOptions();
	let client = buildLangClient(serverOptions, clientOptions);
	let disposable = client.start();
	context.subscriptions.push(disposable);	
}

export function deactivate() {}
