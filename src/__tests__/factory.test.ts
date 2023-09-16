import { Err, Ok } from '../factory';
import type { Result } from '../types';

describe(`Test fn \`${Ok.name}\``, () => {
    it('should create `Ok` result', () => {
        const result1 = Ok(1);
        const result2 = Ok<number, string>(1);
        const result3: Result<number, string> = Ok(2);

        expect(result1).toMatchSnapshot();
        expect(result2).toMatchSnapshot();
        expect(result3).toMatchSnapshot();
    });
});

describe(`Test fn \`${Err.name}\``, () => {
    it('should create `Err` result', () => {
        const result1 = Err('Some error message');
        const result2 = Err<number, string>('Some error message');
        const result3: Result<number, string> = Err('Some error message');

        expect(result1).toMatchSnapshot();
        expect(result2).toMatchSnapshot();
        expect(result3).toMatchSnapshot();
    });
});
