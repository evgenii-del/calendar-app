import { isRadio, titleValidation, participantsValidation } from '../src/js/validation';

describe('test validation functions', () => {

  test('isRadio test', () => {
    const type = 'radio';
    const result = isRadio(type);
    expect(result).toEqual(true);
  });

  test('isRadio test wrong type', () => {
    const type = '';
    const result = isRadio(type);
    expect(result).toEqual(false);
  });

  test('titleValidation test', () => {
    const title = 'Long title';
    const result = titleValidation(title);
    expect(result).toEqual(true);
  });

  test('titleValidation test wrong title', () => {
    const title = 'sh';
    const result = titleValidation(title);
    expect(result).toEqual(false);
  });

  test('participantsValidation test', () => {
    const arr = ['John'];
    const result = participantsValidation(arr);
    expect(result).toEqual(1);
  });

  test('participantsValidation test wrong arr', () => {
    const arr = [];
    const result = participantsValidation(arr);
    expect(result).toEqual(0);
  });

});
