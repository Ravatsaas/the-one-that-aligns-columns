'use strict';

export class FormatUtil {

    public static alignTable(table: Array<Array<string>>): Array<Array<string>>{
        let columnWidths: number[] = [];

        // First pass: Find max widths
        table.forEach(row => {
            for(let n = 0; n < row.length; n++) {
                columnWidths[n] = Math.max(columnWidths[n] || 0, row[n].length);
            }
        });

        // Second pass: Expand all to max width
        table.forEach(row => {
            for(let n = 0; n < row.length; n++) {
                let isNumber = !isNaN(Number(row[n]));
                row[n] = this.pad(row[n], isNumber, columnWidths[n]);
            }
        });

        return table;
    }

    public static formatTableAsString(table: Array<Array<string>>, indentation: number, commasFirst: boolean): string{
        let result = '';
        let leadingWhitespace = ' '.repeat(indentation);

        for(let i = 0; i < table.length; i++) {
            result += 
                leadingWhitespace +
                (commasFirst ? (i === 0 ? ' (' : ',(') : '(') +
                table[i].join(', ') +
                (!commasFirst ? (i === table.length - 1 ? ')\n' : '),\n') : ')\n');
        }

        return result;
    }

    private static pad(input:string, alignLeft: boolean, length:number): string {
        let paddingNeeded = length - input.length;
        if(paddingNeeded <= 0){ return input; }

        let leftPadding  = alignLeft ? paddingNeeded : 0;
        let rightPadding = alignLeft ? 0 : paddingNeeded;
        return ' '.repeat(leftPadding) + input + ' '.repeat(rightPadding);
    }
}