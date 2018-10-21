'use strict';

import * as vscode from "vscode";
import { AlignableField } from "./alignable-field";

export class AlignableLine {

    public textBefore: string = '';
    public textAfter: string = '';
    public fields: AlignableField[] = [];
    public isAlignable: boolean;

    private textLine: vscode.TextLine;

    public get textBeforeLength(): number {
        return this.textBefore.length;
    }

    constructor(textLine: vscode.TextLine) {
        this.textLine = textLine;

        // TODO: Drop unnecessary captures
        let alignableRowPattern = /^(\s*),?\((.*)\),?(.*)$/i;
        let match = textLine.text.match(alignableRowPattern);

        if(!match) {
            this.isAlignable = false;
            return;
        }

        this.isAlignable = true;
        this.textBefore = match[1];
        this.fields = this.parseRow(match[2]);
        this.textAfter = match[3];
    }

    public getFieldCount() : number {
        if(!this.isAlignable) {
            return 0;
        }

        return this.fields.length;
    }

    public getColumnWidths() : number[] {
        return this.fields.map(f => f.trimmedLength);
    }

    public performRowEdits(edit: vscode.TextEditorEdit, newColumnWidths? : number[]) {
        let rowStartsAt = this.textLine.text.indexOf('(');
        let paddingBeforeStart = rowStartsAt - this.textBefore.length;

        if (paddingBeforeStart > 0) {
            edit.insert(new vscode.Position(this.textLine.lineNumber, this.textBefore.length), ' '.repeat(paddingBeforeStart));
        }

        let fieldStartsAt = rowStartsAt + 1;

        // For each field, insert or remove space before or after.
        this.fields.forEach((field, index) => {
            let spacesAfterComma = index === 0 ? 0 : 1;

            let paddingNeeded = 0;

            if(newColumnWidths) {
                paddingNeeded = (newColumnWidths[index] - field.trimmedLength);
            }

            let leftPaddingShouldBe = spacesAfterComma; 
            let rightPaddingShouldBe = 0;

            if (field.isNumber) {
                // Right align numbers
                leftPaddingShouldBe = paddingNeeded + spacesAfterComma;
            } else {
                // Left align everything else
                rightPaddingShouldBe = paddingNeeded;
            }

            if (field.leftPadding > leftPaddingShouldBe) {
                edit.delete(
                    new vscode.Range(
                        new vscode.Position(this.textLine.lineNumber, fieldStartsAt),
                        new vscode.Position(this.textLine.lineNumber, fieldStartsAt + field.leftPadding - leftPaddingShouldBe)
                    )
                );
            }
            else if (field.leftPadding < leftPaddingShouldBe) {
                edit.insert(
                    new vscode.Position(this.textLine.lineNumber, fieldStartsAt),
                    ' '.repeat(leftPaddingShouldBe - field.leftPadding)
                );
            }

            let fieldEndsAt = fieldStartsAt + field.leftPadding + field.trimmedLength;
            if (field.rightPadding > rightPaddingShouldBe) {
                edit.delete (
                    new vscode.Range (
                        new vscode.Position(this.textLine.lineNumber, fieldEndsAt),
                        new vscode.Position(this.textLine.lineNumber, fieldEndsAt + field.rightPadding - rightPaddingShouldBe)
                    )
                );
            }
            else if (field.rightPadding < rightPaddingShouldBe) {
                edit.insert(
                    new vscode.Position(this.textLine.lineNumber, fieldEndsAt),
                    ' '.repeat(rightPaddingShouldBe - field.rightPadding)
                );
            }

            // Move insert position
            fieldStartsAt += field.rawLength + 1;
        });
    }

    private parseRow(rowString: string) : AlignableField[] {
        let inSingleQuotes = false;
        let inDoubleQuotes = false;
        let nextValue = '';
        let fields : AlignableField[] = [];

        // Traverse the row character by character
        for (let c of rowString) {
            if(c === ',' && !inSingleQuotes && !inDoubleQuotes) {
                // If we have a comma not enclosed in quotes, this field is done
                try
                {
                    fields.push(new AlignableField(nextValue));
                }
                catch(ex){
                    console.log(ex.Message)
                }
                nextValue = '';
            } else {
                // Else, keep adding to the value
                nextValue += c;
            }

            // Toggle quotes on and off when encountering a quotation mark
            if(c === '\'') { inSingleQuotes = !inSingleQuotes; }
            if(c === '\"') { inDoubleQuotes = !inDoubleQuotes; }
        }
        // Finally, append the last field
        fields.push(new AlignableField(nextValue));

        return fields;
    }
}
