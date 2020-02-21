import ow from 'ow';

import {validators} from './validator-builders';
import {Validator, isValidator} from './validator';

export function normalizeValidator(validator, options = {}) {
  ow(options, 'options', ow.object.exactShape({field: ow.object}));

  const {field} = options;

  if (isValidator(validator)) {
    return validator;
  }

  if (typeof validator !== 'function') {
    throw new Error(`The specified validator is not a function (field name: '${field.getName()}')`);
  }

  if (Object.values(validators).includes(validator)) {
    throw new Error(
      `The specified validator is a validator builder that has not been called (field name: '${field.getName()}')`
    );
  }

  const normalizedValidator = new Validator(validator);

  return normalizedValidator;
}
