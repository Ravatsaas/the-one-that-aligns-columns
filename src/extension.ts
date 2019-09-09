'use strict';

import * as vscode from 'vscode';

import { AlignableSection } from './alignable-section';

export function activate(context: vscode.ExtensionContext) {
    console.log('The one that aligns columns is alive!');

    context.subscriptions.push(vscode.commands.registerTextEditorCommand(
        'alignColumns.Align',
        (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
            console.log("Aligning columns");

            let alignableSection = new AlignableSection(textEditor);
            alignableSection.alignColumns(edit);
        }
    ));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand(
        'alignColumns.Compact',
        (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
            console.log("Compacting columns");

            let alignableSection = new AlignableSection(textEditor);
            alignableSection.compactColumns(edit);
        }
    ));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand(
        'alignColumns.AlignEquals',
        (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
            console.log("Aligning equals signs");

            let alignableSection = new AlignableSection(textEditor);
            alignableSection.alignEqualsSigns(edit);
        }
    ));
}

export function deactivate() {
    console.log("The one that aligns columns bids you fare-well until next time");
}