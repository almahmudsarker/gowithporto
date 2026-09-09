// Orders created before this date are pre-launch test activity (manual
// checkout/Stripe Connect testing done directly against production before
// go-live) and are excluded from admin financial reporting so revenue/order
// totals reflect actual production activity. Update this constant if the
// launch date changes.
export const PLATFORM_LAUNCH_DATE = new Date("2026-09-01T00:00:00.000Z");
