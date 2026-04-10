const { body } = require('express-validator');
const { isValidUrl } = require('../utils/platformDetector');

const validateAnalyze = [
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required.')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please enter a valid URL.')
    .custom(url => {
      if (!isValidUrl(url)) throw new Error('Invalid or disallowed URL.');
      return true;
    }),
];

const validateDownload = [
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required.')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please enter a valid URL.')
    .custom(url => {
      if (!isValidUrl(url)) throw new Error('Invalid or disallowed URL.');
      return true;
    }),
  body('formatId')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Format ID too long.')
    .matches(/^[a-zA-Z0-9_+\-./]+$/).withMessage('Invalid format ID.'),
  body('filename')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Filename too long.'),
];

module.exports = { validateAnalyze, validateDownload };
