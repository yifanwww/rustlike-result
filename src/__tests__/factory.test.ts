import { Err, Ok } from '../factory';

describe(`Test fn \`${Ok.name}\``, () => {
    it('should create `Ok` result', () => {
        expect(Ok(1)).toMatchSnapshot();
    });
});

describe(`Test fn \`${Err.name}\``, () => {
    it('should create `Err` result', () => {
        expect(Err('Some error message')).toMatchSnapshot();
    });
});
