# advertisement.sucks

**A vending machine that sells its own shelves.**

An interactive advertising experiment built by [0xDominoGirl](https://github.com/0xDominoGirl).

[Visit advertisement.sucks](https://advertisement.sucks)

## The idea

Instead of buying a conventional banner, a brand takes a position on a digital vending machine. Brand details become packaging inside the machine, and occupied positions can be challenged by a higher bid.

The machine gives the project a physical visual language: shelves, products, packaging and position all matter.

## What I built

- An interactive machine and slot-selection experience.
- Brand and logo customization with rendered packaging previews.
- 3D product viewing and a Blender-to-web asset workflow.
- Checkout, receipt and transactional-email flows in the application source.
- Regression checks for rendering, product previews, checkout behavior and release assets.

## Technical choices

The web app uses static pages and JavaScript, with Three.js for product viewing. It runs on Cloudflare Pages with Pages Functions for server endpoints and Supabase for persistence. Rendering and asset preparation include Blender tooling.

The project includes both visual engineering and application work: keeping packaging consistent across views, connecting the purchase flow to server-side state, and managing browser caching across releases.

## Source status

The private application's `main` branch was last updated on 8 October 2026. That release includes a fix for cached modules breaking the released machine. This repository does not claim that every payment method or business feature is currently available; the live site describes the current offering.

## A small piece of the implementation

[`lib/render-queue.js`](lib/render-queue.js) is the application's rendering queue. It processes one packaging render at a time, prioritizes visible work, skips queued previews that are no longer current, and yields to the browser between jobs.

[`tests/render-queue.test.mjs`](tests/render-queue.test.mjs) checks priority, skipped stale jobs, non-overlapping execution, and recovery after a failed render. This is one isolated utility, not the machine renderer or the payment backend.

```sh
# Node.js 24 or later; no dependencies to install
npm test
```

The utility is copied from the private application; only the test import path is adjusted for this repository.

## About this repository

This is a project overview containing a product description and one small source excerpt with tests. The full application source, operational tools and records are maintained privately. No customer data, transaction records, credentials or original private Git history are included.

This project is separate from Creator, the creator directory intended for creator.advertisement.sucks.
