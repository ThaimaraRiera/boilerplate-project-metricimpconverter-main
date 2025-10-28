
'use strict';

const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  const convertHandler = new ConvertHandler();

  app.get('/api/convert', (req, res) => {
    const input = req.query.input || '';
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);

    const numInvalid = initNum === null;
    const unitInvalid = initUnit === null;

    if (numInvalid && unitInvalid) return res.status(200).send('invalid number and unit');
    if (numInvalid) return res.status(200).send('invalid number');
    if (unitInvalid) return res.status(200).send('invalid unit');

    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const returnNum = convertHandler.convert(initNum, initUnit);
    const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    res.json({
      initNum, initUnit, returnNum, returnUnit, string
    });
  });
};
