/* PawPrice engine - the true cost of a pet before you adopt. Pure math, no DOM. */
(function (root) {
  'use strict';

  const PRESETS = {
    dog: {
      small:  { lifespan: 14, foodPerMonth: 40, vetPerYear: 350, upfrontMedical: 400, gear: 250 },
      medium: { lifespan: 12, foodPerMonth: 60, vetPerYear: 400, upfrontMedical: 450, gear: 300 },
      large:  { lifespan: 10, foodPerMonth: 85, vetPerYear: 500, upfrontMedical: 500, gear: 350 }
    },
    cat: {
      any:    { lifespan: 15, foodPerMonth: 35, vetPerYear: 250, upfrontMedical: 350, gear: 200 }
    }
  };
  const AGE_YEARS = { puppy: 0, adult: 3, senior: 8 }; // typical adoption ages

  function num(v, name) {
    const n = typeof v === 'string' ? parseFloat(v) : v;
    if (typeof n !== 'number' || !isFinite(n) || isNaN(n)) throw new Error(name + ' must be a number');
    return n;
  }
  function round2(x) { return Math.round(x * 100) / 100; }

  function money(v, name, max) {
    const n = num(v, name);
    if (n < 0 || n > (max || 100000)) throw new Error(name + ' must be in [0, ' + (max || 100000) + ']');
    return n;
  }

  function price(o) {
    if (!o || typeof o !== 'object') throw new Error('options required');
    const species = o.species;
    if (species !== 'dog' && species !== 'cat') throw new Error('species must be dog or cat');
    const size = species === 'dog' ? o.size : 'any';
    if (species === 'dog' && !PRESETS.dog[size]) throw new Error('size must be small, medium or large');
    const ageGroup = o.ageGroup === undefined ? 'adult' : o.ageGroup;
    if (!AGE_YEARS.hasOwnProperty(ageGroup)) throw new Error('ageGroup must be puppy, adult or senior');

    const preset = species === 'dog' ? PRESETS.dog[size] : PRESETS.cat.any;
    const lifespan = preset.lifespan;
    const adoptionAge = AGE_YEARS[ageGroup];
    const remainingYears = Math.max(1, lifespan - adoptionAge);

    const adoptionFee = money(o.adoptionFee === undefined ? 200 : o.adoptionFee, 'adoptionFee');
    const upfrontMedical = money(o.upfrontMedical === undefined ? preset.upfrontMedical : o.upfrontMedical, 'upfrontMedical');
    const gear = money(o.gear === undefined ? preset.gear : o.gear, 'gear');
    const training = money(o.training === undefined ? (ageGroup === 'puppy' && species === 'dog' ? 300 : 0) : o.training, 'training');
    const foodPerMonth = money(o.foodPerMonth === undefined ? preset.foodPerMonth : o.foodPerMonth, 'foodPerMonth', 5000);
    const litterPerMonth = money(o.litterPerMonth === undefined ? (species === 'cat' ? 20 : 0) : o.litterPerMonth, 'litterPerMonth', 1000);
    const insurancePerMonth = money(o.insurancePerMonth === undefined ? 0 : o.insurancePerMonth, 'insurancePerMonth', 1000);
    const groomPerMonth = money(o.groomPerMonth === undefined ? 0 : o.groomPerMonth, 'groomPerMonth', 1000);
    const vetPerYear = money(o.vetPerYear === undefined ? preset.vetPerYear : o.vetPerYear, 'vetPerYear', 20000);

    const monthlyOngoing = foodPerMonth + litterPerMonth + insurancePerMonth + groomPerMonth;
    const annualOngoing = monthlyOngoing * 12 + vetPerYear;
    const upfrontTotal = adoptionFee + upfrontMedical + gear + training;
    const yearOne = upfrontTotal + annualOngoing;
    const lifetimeTotal = upfrontTotal + annualOngoing * remainingYears;
    const days = remainingYears * 365;

    return {
      species: species, size: size, ageGroup: ageGroup,
      lifespan: lifespan, adoptionAge: adoptionAge, remainingYears: remainingYears,
      upfrontTotal: round2(upfrontTotal),
      monthlyOngoing: round2(monthlyOngoing),
      annualOngoing: round2(annualOngoing),
      yearOne: round2(yearOne),
      lifetimeTotal: round2(lifetimeTotal),
      costPerDay: round2(lifetimeTotal / days),
      honestMonthly: round2(lifetimeTotal / (remainingYears * 12))
    };
  }

  const api = { price: price, PRESETS: PRESETS, AGE_YEARS: AGE_YEARS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PawPriceEngine = api;
})(typeof self !== 'undefined' ? self : this);
