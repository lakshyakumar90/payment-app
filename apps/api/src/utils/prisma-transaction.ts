/**
 * Neon / serverless pools and cold starts often exceed Prisma’s defaults
 * (`maxWait` ~2s), which surfaces as "Unable to start a transaction in the given time."
 */
export const interactiveTransactionDefaults = {
    maxWait: 20_000,
    timeout: 45_000,
} as const;
