'use strict';

import * as vscode from 'vscode';

import { FormatUtil } from './format-util';
import { FormatTarget } from './format-target';

export function activate(context: vscode.ExtensionContext) {
    console.log('The one that aligns columns is alive!');

    context.subscriptions.push(vscode.commands.registerTextEditorCommand(
        'alignColumns.Align', 
        (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {  
            console.log("Aligning columns");

            let conf = vscode.workspace.getConfiguration();
            let commasFirst = conf.get("mssql.format.placeCommasBeforeNextStatement", false);

            let formatTarget = new FormatTarget(textEditor);
            if (!formatTarget.isAlignable) { return; }

            let alignedTable = FormatUtil.alignTable(formatTarget.table);
            let tableString = FormatUtil.formatTableAsString(alignedTable, formatTarget.indentation, commasFirst);

            edit.replace(
                new vscode.Range(
                    new vscode.Position (formatTarget.startLineNum, 0),
                    new vscode.Position (formatTarget.endLineNum + 1 , 0)
                ),
                tableString
            );
        }  
    ));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand(
        'alignColumns.Compact', 
        (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {     
            console.log('Compacting columns');

            let conf = vscode.workspace.getConfiguration();
            let commasFirst = conf.get("mssql.format.placeCommasBeforeNextStatement", false);

            let formatTarget = new FormatTarget(textEditor);
            if (!formatTarget.isAlignable) { return; }
            
            let tableString = FormatUtil.formatTableAsString(formatTarget.table, formatTarget.indentation, commasFirst);
            
            edit.replace(
                new vscode.Range(
                    new vscode.Position (formatTarget.startLineNum, 0),
                    new vscode.Position (formatTarget.endLineNum + 1 , 0)
                ),
                tableString
            );
        }  
    ));
}

export function deactivate() {
    console.log("The one that aligns columns bids you fare-well until next time");
}