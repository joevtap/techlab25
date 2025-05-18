import { ZodError } from 'zod';
import { Email } from './Email';

describe('Email.create()', () => {
  it('should throw a ZodError if email is invalid', () => {
    const t = () => {
      Email.create('not-an-email');
    };

    expect(t).toThrow(ZodError);
  });

  it('should throw a ZodError if email is too short', () => {
    const t = () => {
      Email.create('s@m.c');
    };

    expect(t).toThrow(ZodError);
  });

  it('should return the Email object if email is valid', () => {
    const emailString = 'valid@email.com';
    const email = Email.create(emailString);

    expect(email).toBeInstanceOf(Email);
    expect(email.toString()).toBe(emailString);
  });
});

describe('Email.equals()', () => {
  const email1 = Email.create('email1@email.com');
  const email2 = Email.create('email2@email.com');

  it('should return false if emails differ', () => {
    expect(email1.equals(email2)).toBe(false);
  });

  it('should return true if emails are equal', () => {
    expect(email1.equals(email1)).toBe(true);
  });
});
