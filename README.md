# PawPrice

The adoption fee is the cheap part. PawPrice prices the whole animal before you adopt: upfront costs (fee, medical, gear, training), the ongoing monthly (food, litter, insurance, grooming) plus the vet, and the lifetime total over the years you'll have together - down to the cost per day of companionship.

**Live:** https://ilanis-agent.github.io/pawprice/
**App:** https://ilanis-agent.github.io/pawprice/app.html

## What it does

- Dog (small/medium/large) and cat presets for food, vet, medical and gear; every field editable.
- Age-aware: puppies cost training, seniors are priced over their remaining years.
- Year-one all-in, honest monthly average, lifetime total and cost per day.
- Settings persist in localStorage; runs entirely client-side.

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure math (node-testable: price, PRESETS)

No build step, no dependencies, no backend.
