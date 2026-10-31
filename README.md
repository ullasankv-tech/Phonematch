# PhoneMatch

A small smartphone recommendation app that helps users find the best phone based on their priorities and budget, then compares it against similar alternatives.

## Features

- Preference wizard (budget, priorities, deal-breakers)
- Weighted scoring engine
- Top recommendation with natural-language explanation
- Side-by-side comparison table
- Priority radar chart
- 12 current (2026) flagship / near-flagship phones

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state)
- Recharts (radar chart)

## Project Structure

```
src/
├── app/           # Pages (home, wizard, results)
├── components/    # UI components
├── data/          # phones.json
├── lib/           # scoring, explanations, types
└── store/         # Zustand preferences store
```

## How It Works

1. User sets budget + ranks priorities + optional deal-breakers
2. App filters phones and calculates a weighted match score
3. Top recommendation is shown with a clear reason
4. User can compare it against the closest alternatives

## Extending

- Add more phones to `src/data/phones.json`
- Adjust scoring weights or add new attributes in `src/lib/types.ts` and `scoring.ts`
- Improve the explanation generator in `src/lib/explanations.ts`
