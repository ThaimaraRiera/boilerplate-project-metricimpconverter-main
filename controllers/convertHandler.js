
function ConvertHandler() {
  const unitMap = {
    'gal': { returnUnit: 'L', spell: 'gallons', toReturn: (n) => n * 3.78541 },
    'L':   { returnUnit: 'gal', spell: 'liters',  toReturn: (n) => n / 3.78541 },
    'mi':  { returnUnit: 'km', spell: 'miles',   toReturn: (n) => n * 1.60934 },
    'km':  { returnUnit: 'mi', spell: 'kilometers', toReturn: (n) => n / 1.60934 },
    'lbs': { returnUnit: 'kg', spell: 'pounds',  toReturn: (n) => n * 0.453592 },
    'kg':  { returnUnit: 'lbs', spell: 'kilograms', toReturn: (n) => n / 0.453592 }
  };

  const validUnits = Object.keys(unitMap).concat(['l']).sort(); // include lowercase l for parsing

  function parseNumber(input) {
    // extract numeric prefix; default to 1 if none
    const match = input.trim().match(/^[\s]*([.\d\/]+)?\s*[a-zA-Z].*$/);
    let numStr = match && match[1] !== undefined ? match[1] : null;
    if (!numStr || numStr === '') return 1;

    // Detect multiple slashes (double-fraction)
    const slashCount = (numStr.match(/\//g) || []).length;
    if (slashCount > 1) return null; // invalid number

    if (slashCount === 1) {
      const [a, b] = numStr.split('/');
      if (a === '' || b === '' || isNaN(a) || isNaN(b)) return null;
      return parseFloat(a) / parseFloat(b);
    }

    // simple decimal
    if (isNaN(numStr)) return null;
    return parseFloat(numStr);
  }

  function parseUnit(input) {
    const match = input.trim().match(/[a-zA-Z]+$/);
    if (!match) return null;
    let unit = match[0];

    // Normalize
    unit = unit === 'l' ? 'L' : unit.toLowerCase() === 'l' ? 'L' : unit;
    // Accept case-insensitive for others but keep 'L' uppercase.
    const lower = unit.toLowerCase();
    if (lower === 'l') unit = 'L';
    else unit = lower;

    if (!unitMap[unit]) return null;
    return unit;
  }

  this.getNum = function(input) {
    const n = parseNumber(input);
    return n;
  };
  
  this.getUnit = function(input) {
    const u = parseUnit(input);
    return u;
  };
  
  this.getReturnUnit = function(initUnit) {
    if (!unitMap[initUnit]) return null;
    return unitMap[initUnit].returnUnit;
  };

  this.spellOutUnit = function(unit) {
    if (!unitMap[unit]) return null;
    return unitMap[unit].spell;
  };
  
  this.convert = function(initNum, initUnit) {
    if (typeof initNum !== 'number' || !unitMap[initUnit]) return null;
    const raw = unitMap[initUnit].toReturn(initNum);
    return parseFloat(raw.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    const initSpell = this.spellOutUnit(initUnit);
    const returnSpell = this.spellOutUnit(returnUnit);
    return `${initNum} ${initSpell} converts to ${returnNum} ${returnSpell}`;
  };
}

module.exports = ConvertHandler;
