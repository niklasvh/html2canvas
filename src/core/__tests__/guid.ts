import {Guid} from '../guid';

describe('uuid', () => {
    it("validate the string is valid GUID", () => {
        const regex = RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(regex.test(Guid.generate())).toBeTruthy();
    });
});
