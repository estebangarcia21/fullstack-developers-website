import { passwordValidator } from './passwordValidator';

describe('Password validator', () => {
  it('should accept the password 123456789!', async () => {
    const password = '123456789!';

    try {
      await passwordValidator(password);
    } catch (error) {
      expect(error).toBeUndefined();
    }

    it('should not accept the password 1', async () => {
      try {
        await passwordValidator('1');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
