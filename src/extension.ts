import * as vscode from 'vscode';
import * as path from 'path';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions
  } from 'vscode-languageclient';

export function activate(context: vscode.ExtensionContext) {

	const JAVA_HOME  = vscode.workspace.getConfiguration("Palladio").get("palladio.server.javaHome")

	if (JAVA_HOME == null) {
		vscode.window.showErrorMessage("Palladio Extension activation failed, since JAVA_HOME was not set.")
		return
	}

	let excecutable: string = path.join('JAVA_HOME', 'bin', 'java')

	let jar = "/home/dev/Projects/Palladio/Palladio-VSCode-Extension/server/org.palladiosimulator.textual.tpcm.ide-1.0.0-SNAPSHOT-ls.jar"
	const args: string[] = ['-jar', jar]

	let serverOptions: ServerOptions = {
		command: excecutable,
		args: args,
		options: {}
	};

	let clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'palladio' }]
	};

	let client = new LanguageClient(
		'Palladio', 
		'Palladio Language Server', 
		serverOptions, 
		clientOptions
	)

	let disposable = client.start()
	vscode.window.showInformationMessage("Palladio Extension is now active!")

	context.subscriptions.push(disposable);
}

export function deactivate() {}
