import * as assert from 'assert';
import { AlignableField } from '../alignable-field';

suite("Alignable Field Tests", function () {
    
    test("Constructor returns field with correct properties", function() {
        
        let runs = [
            {
                input : ' 1 ',
                rawLength : 3,
                trimmedLength : 1,
                leftPadding : 1,
                rightPadding : 1
            },
            {
                input : '"AA"',
                rawLength : 4,
                trimmedLength : 4,
                leftPadding : 0,
                rightPadding : 0
            },
            {
                input : '   "BBB" ',
                rawLength : 9,
                trimmedLength : 5,
                leftPadding : 3,
                rightPadding : 1
            },
            {
                input : '1.23 ',
                rawLength : 5,
                trimmedLength : 4,
                leftPadding : 0,
                rightPadding : 1
            }
        ];

        runs.forEach(run => {
            let field = new AlignableField(run.input);
            
            assert.equal(field.rawLength, run.rawLength, 'Raw length should match');
            assert.equal(field.trimmedLength, run.trimmedLength, 'Trimmed length should match');
            assert.equal(field.leftPadding, run.leftPadding, 'Left Padding should match');
            assert.equal(field.rightPadding, run.rightPadding, 'Right padding should match');          
        });
    });
});