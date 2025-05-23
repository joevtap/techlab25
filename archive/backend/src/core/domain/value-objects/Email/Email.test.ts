import { ValidationError } from '../../errors';

import { Email } from './Email';

describe('Email', () => {
  it('should throw a ValidationError if email is invalid', () => {
    const t = () => {
      new Email('not-an-email');
    };

    expect(t).toThrow(ValidationError);
  });

  it('should throw a ValidationError if email is too short', () => {
    const t = () => {
      new Email('s@m.c');
    };

    expect(t).toThrow(ValidationError);
  });

  it('should return the Email object if email is valid', () => {
    const emailString = 'valid@email.com';
    const email = new Email(emailString);

    expect(email).toBeInstanceOf(Email);
    expect(email.toString()).toBe(emailString);
  });
});

describe('Email.equals()', () => {
  const email1 = new Email('email1@email.com');
  const email2 = new Email('email2@email.com');

  it('should return false if emails differ', () => {
    expect(email1.equals(email2)).toBe(false);
  });

  it('should return true if emails are equal', () => {
    expect(email1.equals(email1)).toBe(true);
  });
});
