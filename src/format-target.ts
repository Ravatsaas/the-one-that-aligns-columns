'use strict';

import * as vscode from 'vscode';

export class FormatTarget {

    public startLineNum : number = -1;
    public endLineNum : number = -1;
    public indentation : number;
    public isAlignable : boolean = false;
    public table : Array<Array<string>> = [];

    constructor(editor : vscode.TextEditor) {
        let activeLineNum = editor.selection.active.line;
        let activeLine = editor.document.lineAt(activeLineNum);
        this.indentation = activeLine.firstNonWhitespaceCharacterIndex;
            
        let row = this.getColumns(activeLine.text);
        if(row.length === 0){
            vscode. window.showWarningMessage('All dressed up, but nothing to align. Try moving the cursor to a list of values!');
            return;
        }

        this.isAlignable = true;

        let columnCount = row.length;
        this.table = [row];

        // Get lines before cursor:            
        this.startLineNum = activeLineNum;       
        while(true){
            let prevLineNum = this.startLineNum - 1;
            if(prevLineNum <= 0) { 
                break; 
            }
       
            let prevRow = this.getColumns(editor.document.lineAt(prevLineNum).text);
            if(prevRow.length !== columnCount) {
                break;
            }
       
            this.table.unshift(prevRow);
            this.startLineNum --;
        }
       
        // Get lines after cursor
        this.endLineNum = activeLineNum;
        while (true) {
            let nextLineNum = this.endLineNum + 1;
            if (nextLineNum >= editor.document.lineCount) {
                break;
            }
       
            let nextRow = this.getColumns(editor.document.lineAt(nextLineNum).text);
            if(nextRow.length !== columnCount) {
                break;
            }
       
            this.table.push(nextRow);
            this.endLineNum ++;
        }
    }

    private getColumns(row: string): string[] {
        let alignableRowPattern = /,?\((.*)\),?/i;
        
        var matches = row.match(alignableRowPattern);
        if(!matches) {
            return [];
        }
        
        return this.splitIntoColumns(matches[1]);
    }

    private splitIntoColumns(row: string) : string[] {
        let inQuotes = false;
        let columns = [];
        let nextColumn = '';

        for (let c of row){
            if(c === ',' && !inQuotes) {
                columns.push(nextColumn.trim());
                nextColumn = '';
            } else {        
                nextColumn += c;
            }
            
            if(c === '\'') { inQuotes = !inQuotes; }
        }
        columns.push(nextColumn.trim());

        return columns;
    }
}
