# Platform Payment Analytics — Design Doc

**Date:** 2026-02-24
**Status:** Approved
**Feature:** Track which platform (iOS / Android / Desktop) pays the most

---

## Problem

The admin analytics page shows device breakdown for all users (login activity), but there is no way to see which platform contributes most to paid conversions and revenue.

## Goal

Add a "Nền tảng thanh toán" (Platform Payment) section to `/admin/analytics` showing the percentage of paying users and total Xu purchased per platform.

---

## Data Sources

Both datasets are already fetched by the analytics page — no new Supabase queries needed.

| Table | Fields used |
|-------|------------|
| `payment_requests` | `user_id`, `status`, `amount`, `amount_vnd` |
| `login_logs` | `user_id`, `os_name`, `device_type` |

---

## Computation Logic (`analytics.ts`)

New function: `computePlatformPaymentBreakdown(paymentRequests, loginLogs)`

1. Filter `payment_requests` where `status = 'paid'`
2. Group by `user_id`, sum `amount` (Xu) and `amount_vnd` (VND) per user
3. For each paying user, look up their `login_logs` and pick the **most frequent `os_name`**
4. Map to 3 platform buckets:
   - **iOS** → `os_name === 'iOS'`
   - **Android** → `os_name === 'Android'`
   - **Desktop** → all others where `device_type === 'desktop'` (Windows, macOS, Linux)
5. Aggregate per bucket: user count, % of total paying users, total Xu, total VND

### Return type

```typescript
interface PlatformPaymentStat {
  platform: 'iOS' | 'Android' | 'Desktop';
  user_count: number;
  percentage: number;        // % of total paying users
  total_xu: number;
  total_vnd: number;
}
```

---

## UI Design

**Component:** `src/components/admin/analytics/platform-payment-breakdown.tsx`

- Section heading: **"Nền tảng thanh toán"**
- Recharts `PieChart` (donut style, consistent with existing device breakdown component)
- Summary table below chart:

| Nền tảng | Người dùng | % | Tổng Xu |
|----------|-----------|---|---------|
| iOS      | 24        | 48% | 12,000 Xu |
| Android  | 18        | 36% | 9,000 Xu  |
| Desktop  | 8         | 16% | 4,000 Xu  |

---

## Wiring

In `src/app/admin/analytics/page.tsx`:
- Pass existing `paymentRequests` and `loginLogs` arrays into the new analytics function
- Pass result to the new component — no layout changes needed beyond inserting the new section

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/analytics.ts` | Add `computePlatformPaymentBreakdown()` |
| `src/components/admin/analytics/platform-payment-breakdown.tsx` | New component |
| `src/app/admin/analytics/page.tsx` | Call new function, render new component |

---

## Out of Scope

- Tracking platform at the exact moment of payment (would require schema change)
- Per-package breakdown by platform
- Time series (platform trends over time)
