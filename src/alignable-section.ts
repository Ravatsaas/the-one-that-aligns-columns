'use strict';

import * as vscode from "vscode";
import { AlignableLine } from "./alignable-line";

export class AlignableSection {
    private lines: AlignableLine[] = [];

    constructor(textEditor: vscode.TextEditor) {

        let activeLine = textEditor.selection.active.line;

        // Add the active line
        this.addLineIfValid(textEditor.document.lineAt(activeLine));

        // If we are not on an alignable line, give up.
        if(this.lines.length === 0) {
            vscode.window.showWarningMessage('All dressed up, but nothing to align. Try moving the cursor to a list of values!');
            return;
        }

        // Add any valid lines before it
        let l = activeLine - 1;
        while(l >= 0 && this.addLineIfValid(textEditor.document.lineAt(l), this.lines[0].fields.length)) {
            l--;
        }

        // Add any valid lines after it
        l = activeLine + 1;
        while(l < textEditor.document.lineCount && this.addLineIfValid(textEditor.document.lineAt(l), this.lines[0].fields.length)) {
            l++;
        }
    }

    public alignCommas(edit: vscode.TextEditorEdit) {
        if (this.lines.length === 0) { return; }

        let indentation = this.lines[0].openParenPosition;

        let columnWidths = new Array(this.lines[0].fields.length).fill(0);
        this.lines.forEach(line => {
            line.getColumnWidths().forEach((width, i) => {
                columnWidths[i] = Math.max(columnWidths[i], width);
            });
        });

        this.lines.forEach(line => {
            line.performCommaAlignEdits(edit, indentation, columnWidths);
        });
    }

    public compactColumns(edit: vscode.TextEditorEdit) {
        if (this.lines.length === 0) { return; }

        let indentation = this.lines[0].openParenPosition;

        this.lines.forEach(line => {
            line.performCommaAlignEdits(edit, indentation);
        });
    }

    public alignEqualsSigns(edit: vscode.TextEditorEdit) {
        if (this.lines.length === 0) { return; }

        let newLength = this.lines.reduce((prev, curr) => {
            let next = curr.fields[0].value.trimRight().length;

            if (next > prev) {
                return next;
            } else {
                return prev;
            }
        }, 0);

        this.lines.forEach(line => {
            line.performEqualsAlignEdits(edit, newLength);
        });
    }

    private addLineIfValid(textLine: vscode.TextLine, expectedFieldCount?: number) : boolean {
        let line = new AlignableLine(textLine);
        if (!line.isCommaAlignable && !line.isEqualsAlignable) { return false; }
        if (expectedFieldCount !== undefined && line.fields.length !== expectedFieldCount) { return false; }

        this.lines.push(line);
        return true;
    }
}