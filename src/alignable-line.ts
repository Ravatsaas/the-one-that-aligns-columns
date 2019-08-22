'use strict';

import * as vscode from "vscode";
import { AlignableField } from "./alignable-field";

export class AlignableLine {

    public fields: AlignableField[] = [];
    public isAlignable: boolean;

    get openParenPosition() : number {
        return this.textLine.text.indexOf('(');
    }

    private textLine: vscode.TextLine;

    constructor(textLine: vscode.TextLine) {
        this.textLine = textLine;

        // TODO: Remove unnecessary captures
        let alignableRowPattern = /^\s*,?\s*\((.*)\),?.*$/i;
        let match = textLine.text.match(alignableRowPattern);

        if(!match) {
            this.isAlignable = false;
            return;
        }

        this.isAlignable = true;
        this.fields = this.parseRow(match[1]);
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

    public performRowEdits(edit: vscode.TextEditorEdit, indentation: number, newColumnWidths? : number[]) {
        let commaPosition = this.textLine.text.indexOf(',');
        let indentationDiff = indentation - this.openParenPosition;

        // Align the indentation of each row
        if (this.openParenPosition - commaPosition > 1)
        {
            // Remove any spacing between the leading comma and the opening parenthesis
            edit.delete(
                new vscode.Range(
                    new vscode.Position(this.textLine.lineNumber, commaPosition + 1),
                    new vscode.Position(this.textLine.lineNumber, this.openParenPosition)
                )
            );

            indentationDiff -= commaPosition + 1 - this.openParenPosition;
        }
        if (indentationDiff > 0) {
            // Add spaces to align
            edit.insert(new vscode.Position(this.textLine.lineNumber, 0), ' '.repeat(indentationDiff));
        }
        else if (indentationDiff < 0) {
            //Remove spaces to align
            edit.delete(
                new vscode.Range(
                    new vscode.Position(this.textLine.lineNumber, 0),
                    new vscode.Position(this.textLine.lineNumber, Math.min(Math.abs(indentationDiff), commaPosition))
                )
            );
        }

        let fieldStartsAt = this.openParenPosition + 1;

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
                    console.log(ex.Message);
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
