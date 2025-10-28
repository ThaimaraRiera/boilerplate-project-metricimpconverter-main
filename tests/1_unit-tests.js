
const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  test('should correctly read a whole number input', function() {
    assert.strictEqual(convertHandler.getNum('32L'), 32);
  });
  test('should correctly read a decimal number input', function() {
    assert.strictEqual(convertHandler.getNum('3.2kg'), 3.2);
  });
  test('should correctly read a fractional input', function() {
    assert.approximately(convertHandler.getNum('3/2mi'), 1.5, 1e-12);
  });
  test('should correctly read a fractional input with a decimal', function() {
    assert.approximately(convertHandler.getNum('5.4/3lbs'), 1.8, 1e-12);
  });
  test('should correctly return an error on a double-fraction', function() {
    assert.isNull(convertHandler.getNum('3/2/3km'));
  });
  test('should correctly default to 1 when no numerical input is provided', function() {
    assert.strictEqual(convertHandler.getNum('kg'), 1);
  });
  test('should correctly read each valid input unit', function() {
    const inputs = ['gal','L','mi','km','lbs','kg','l'];
    inputs.forEach(u => {
      assert.isNotNull(convertHandler.getUnit('3' + u));
    });
  });
  test('should correctly return an error for an invalid input unit', function() {
    assert.isNull(convertHandler.getUnit('32g'));
  });
  test('should return the correct return unit for each valid input unit', function() {
    const pairs = { gal: 'L', L: 'gal', mi: 'km', km: 'mi', lbs: 'kg', kg: 'lbs' };
    Object.entries(pairs).forEach(([from, to]) => {
      assert.strictEqual(convertHandler.getReturnUnit(from), to);
    });
  });
  test('should correctly return the spelled-out string unit for each valid input unit', function() {
    const spell = { gal:'gallons', L:'liters', mi:'miles', km:'kilometers', lbs:'pounds', kg:'kilograms' };
    Object.entries(spell).forEach(([u, s]) => {
      assert.strictEqual(convertHandler.spellOutUnit(u), s);
    });
  });
  test('should correctly convert gal to L', function() {
    assert.approximately(convertHandler.convert(1, 'gal'), 3.78541, 0.1);
  });
  test('should correctly convert L to gal', function() {
    assert.approximately(convertHandler.convert(3.78541, 'L'), 1, 0.1);
  });
  test('should correctly convert mi to km', function() {
    assert.approximately(convertHandler.convert(1, 'mi'), 1.60934, 0.1);
  });
  test('should correctly convert km to mi', function() {
    assert.approximately(convertHandler.convert(1.60934, 'km'), 1, 0.1);
  });
  test('should correctly convert lbs to kg', function() {
    assert.approximately(convertHandler.convert(1, 'lbs'), 0.453592, 0.1);
  });
  test('should correctly convert kg to lbs', function() {
    assert.approximately(convertHandler.convert(0.453592, 'kg'), 1, 0.1);
  });
});
