import {Logger} from '../logger';

describe('logger', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let infoSpy: any;

    beforeEach(() => {
        infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {
            // do nothing
        });
    });

    afterEach(() => {
        infoSpy.mockRestore();
    });

    it('should call console.info when logger enabled', () => {
        const id = Math.random().toString();
        const logger = new Logger({id, enabled: true});
        logger.info('testing');
        expect(infoSpy).toHaveBeenLastCalledWith(id, expect.stringMatching(/\d+ms/), 'testing');
    });

    it("shouldn't call console.info when logger disabled", () => {
        const id = Math.random().toString();
        const logger = new Logger({id, enabled: false});
        logger.info('testing');
        expect(infoSpy).not.toHaveBeenCalled();
    });
});
