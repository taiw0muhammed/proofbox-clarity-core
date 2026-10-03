# ProofBox Feature Expansion

## Goal
Expand the existing ProofBox MVP into a polished agreement-management workspace while preserving its current branding, navigation patterns, live records, confirmation flow, evidence uploads, QR verification, dark mode, and PDF export.

## Build plan
1. **Strengthen the shared product shell**
   - Expand desktop navigation for Templates, Calendar, Payments, Evidence, Activity, Scan, Notifications, and Profile.
   - Keep mobile navigation focused on Home, ProofBoxes, Create, Scan, and More; place secondary destinations in an accessible mobile menu.
   - Add reusable loading, error, empty-state, action-menu, progress, and sharing patterns.

2. **Add persistent product data**
   - Add per-user starred and recently viewed records.
   - Add safe archive/restore support without deleting records.
   - Add payment entries and reminders tied to records, with owner/participant access rules.
   - Keep all new data private to signed-in users who already have access to the related ProofBox.

3. **Upgrade ProofBox workflows**
   - Add richer search, status filters, archive filtering, and sorting.
   - Add star, archive, restore, duplicate, progress, and share actions.
   - Let templates prefill the existing creation flow without copying confirmations or history.
   - Expand the existing PDF to include evidence, confirmations, amendments, completion state, and verification QR.

4. **Add new product areas**
   - Templates with the eight requested starting points.
   - Calendar and reminder center using actual record dates and reminders.
   - Payments with totals, remaining balances, progress, history, and add-payment flow; no payment processing.
   - Evidence vault with search, file filters, record filters, and private previews.
   - Account activity grouped by date.
   - Scan page with camera support when available and manual verification fallback.

5. **Make the dashboard immediately useful**
   - Add attention items derived from real records, payments, reminders, and confirmations.
   - Add quick actions, starred records, recently viewed records, recent activity, and existing charts.
   - Never invent user statistics or records.

6. **Finish the first-run and communication experience**
   - Add skippable onboarding and persist completion.
   - Keep notification preferences and in-app alerts connected to live events.
   - Prepare branded transactional emails once a sender domain owned by the project is configured; a Gmail address can receive messages but cannot act as the sending domain.

7. **Quality pass**
   - Verify signed-in creation, starring, archive/restore, duplicate, payment, reminder, evidence, sharing, PDF, and verification flows.
   - Check mobile and desktop layouts, keyboard focus, touch targets, empty/loading/error states, metadata, and build health.

## Technical notes
- Continue using TanStack Start, Lovable Cloud, React Query, the current green semantic design tokens, and existing shadcn controls.
- New tables will include explicit grants and row-level access rules. Roles and private access will never be trusted from browser storage.
- Route files will be created with unique metadata in the same change as their navigation links.
- Email delivery remains blocked until a real owned sender domain is configured; `imamuhammed008@gmail.com` can be used as a recipient/account email only.
