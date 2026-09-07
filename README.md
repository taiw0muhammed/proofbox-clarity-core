# ProofBox UI Foundation

Design and build the complete UI/UX foundation for a web app called ProofBox.



Product name: ProofBox

Tagline: Make agreements clear. Keep the proof.



IMPORTANT



This phase is UI/UX FIRST.



Do NOT build the Supabase database, authentication logic, AI API, backend workflows, or real data functionality yet.



Do not destroy or rewrite useful existing project files unnecessarily.



Focus on creating a polished, production-quality interface and reusable components. Use realistic mock data only where needed to demonstrate the interface.



The UI should be designed so that real Supabase functionality can be connected later without redesigning the screens.



---



PRODUCT CONCEPT



ProofBox is a shared record platform for everyday agreements and transactions.



People often make agreements through WhatsApp, SMS, calls, screenshots, bank transfers, paper notes, or memory.



ProofBox gives them one clear place to record:



- What was agreed

- Who was involved

- What was exchanged

- Amounts

- Dates

- Responsibilities

- Evidence

- Confirmation

- Changes

- Completion



It should feel like a modern trust and record-keeping product, not a traditional legal website.



Do not describe ProofBox as a contract generator.



---



DESIGN DIRECTION



Create a premium, modern, trustworthy interface inspired by the clarity of products like Linear, Notion and modern fintech applications.



The design should be:



- Minimal

- Professional

- Calm

- Trustworthy

- Modern

- Highly readable

- Mobile-first

- Responsive

- Fast-feeling

- Easy for non-technical users



Avoid:



- Generic AI-dashboard aesthetics

- Excessive gradients

- Excessive glassmorphism

- Overly colorful interfaces

- Corporate/legal-looking designs

- Huge amounts of text

- Cluttered dashboards



Use strong typography, excellent spacing, subtle borders, tasteful shadows, clear status indicators and excellent information hierarchy.



Create a consistent design system for:



- Typography

- Colors

- Buttons

- Cards

- Inputs

- Badges

- Modals

- Dropdowns

- Navigation

- Tables/lists

- Timelines

- Empty states

- Loading states

- Error states



Make accessibility and contrast a priority.



---



BRAND IDENTITY



Create a simple, memorable ProofBox visual identity.



The product should communicate:



Proof. Clarity. Trust. Simplicity.



Use a subtle visual language around records, verification, evidence and confirmation.



Create a clean ProofBox logo/icon that can work as:



- Website logo

- App icon

- Favicon

- Dashboard mark



Do not make the logo look like a courthouse, law firm or document scanner.



---



PAGES TO DESIGN



Create the following complete screens.



1. LANDING PAGE



Hero section:



Make agreements clear. Keep the proof.



Supporting text explaining that ProofBox helps people record agreements, attach evidence, confirm with the people involved and keep a clear history.



Primary CTA:



Create a ProofBox



Secondary CTA:



See how it works



Show a beautiful product preview/mockup of a ProofBox record.



Sections:



How it works



1. Create

2. Confirm

3. Keep the proof



Use cases



Borrowing

Payments

Sales

Rentals

Freelance work

Services

Deliveries

Personal commitments



Why ProofBox



Clear agreements

Shared confirmation

Evidence attached

History preserved

Reminders



Privacy section



Explain visually that users control who can see their records.



Finish with a strong CTA.



---



2. DASHBOARD



Create a premium dashboard.



Header:



Good morning, [Name]



Supporting text:



Your agreements, transactions and commitments in one place.



Primary button:



+ Create ProofBox



Statistics:



Active

Awaiting confirmation

Due soon

Completed



Create a prominent section:



Needs your attention



Example cards:



Camera Borrow

₦500,000 item value

Return due Sep 15

Awaiting confirmation



Logo Design

₦40,000 total

₦20,000 paid

Due Sep 12



Then:



Recent ProofBoxes



Display records as clean cards/list items with:



- Title

- Type

- Participant

- Date

- Amount/item

- Status

- Due date



Include search and filters.



---



3. CREATE PROOFBOX



This should be one of the most important screens in the application.



Start with:



What are you recording?



Create visually attractive selection cards:



- Borrow

- Payment

- Sale

- Rental

- Service

- Delivery

- Promise

- Custom



Then provide a large natural-language input:



Or describe what happened



Placeholder:



“I lent Ahmed my camera worth ₦500,000 today. He will return it on Friday and cover any damage.”



Button:



Create ProofBox



For now, this can be a visual/mock interaction only. Do not connect an AI API yet.



Also provide a manual form option.



---



4. PROOFBOX DETAILS



Design the main ProofBox record page.



Example:



Camera Borrow



Status:

Awaiting confirmation



₦500,000 estimated value



Agreement



Owner:

Muhammed



Borrower:

Ahmed



Item:

Sony camera



Borrowed:

September 7, 2026



Return:

September 15, 2026



Responsibility:

Borrower covers damage beyond normal wear.



Participants



Show participant cards and confirmation status.



Example:



Muhammed

✓ Confirmed Sep 7



Ahmed

Waiting for confirmation



Evidence



Display uploaded evidence as attractive thumbnails/cards:



- Camera photos

- Receipt

- Document

- Screenshot



Timeline



Create a beautiful chronological timeline:



Created

Evidence added

Ahmed invited

Muhammed confirmed

Waiting for Ahmed



Actions



Confirm

Add evidence

Share

Amend

Mark completed

Report dispute



The interface should clearly communicate that confirmed information is preserved.



---



5. CONFIRMATION SCREEN



Create a focused confirmation experience.



Header:



Review before you confirm



Show the entire agreement in a clean summary.



Include:



I have reviewed these details and confirm that they accurately represent what was agreed.



Button:



Confirm ProofBox



Secondary:



Request changes



Make this screen feel deliberate and trustworthy.



---



6. CONFIRMED STATE



Design what happens after everyone confirms.



Show:



ProofBox Confirmed



A clear confirmation indicator.



Show:



Confirmed by all participants



With timestamps.



Explain visually:



The original agreement is now preserved. Future changes will appear as amendments rather than silently replacing the original record.



Make this one of the strongest trust moments in the UI.



---



7. TIMELINE



Create a polished timeline component that can later be reused throughout the application.



Events should visually distinguish:



- Created

- Invited

- Evidence added

- Confirmed

- Amended

- Reminder

- Completed

- Disputed



Use timestamps and participant names.



---



8. NOTIFICATIONS



Create a notification center.



Examples:



Ahmed confirmed Camera Borrow



2 minutes ago



Camera Borrow is due in 3 days



1 hour ago



You were invited to a ProofBox



Yesterday



Group notifications intelligently.



---



9. PROFILE / SETTINGS



Create:



Profile information

Account settings

Notification preferences

Privacy

Security

Data/export section

Logout



Keep it simple.



---



10. MOBILE EXPERIENCE



The application must be designed mobile-first.



Create responsive layouts for:



- Dashboard

- Create ProofBox

- ProofBox details

- Confirmation

- Notifications



Use a mobile bottom navigation where appropriate:



Home

ProofBoxes

Create

Notifications

Profile



The Create button should be visually prominent.



---



COMPONENT SYSTEM



Create reusable components rather than designing every screen independently.



Important components:



- ProofBoxCard

- StatusBadge

- ParticipantCard

- EvidenceCard

- Timeline

- ConfirmationPanel

- DueDateIndicator

- SearchBar

- FilterDropdown

- EmptyState

- NotificationItem

- CreateTypeCard

- PrimaryButton

- SecondaryButton

- Modal

- Toast

- MobileNavigation



Make sure the components share a consistent visual language.



---



MOCK DATA



Use realistic mock examples involving:



- Borrowed camera

- Laptop rental

- Logo design service

- ₦ payment

- Phone sale

- Equipment delivery



Use Nigerian Naira where amounts are shown.



Do not use fake functionality that appears to be connected to a backend.



---



FINAL QUALITY REQUIREMENT



Before finishing, check every page for:



- Responsive behavior

- Consistent spacing

- Typography hierarchy

- Accessibility

- Empty states

- Loading states

- Error states

- Hover/focus states

- Mobile usability

- Visual consistency



The final result should look like a real startup product that could be shown to judges or users, not a generic generated dashboard.



Again: UI/UX first. Do not implement Supabase, authentication, AI, or backend functionality in this phase.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://proofbox-clarity-core.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d8152e03-7ff3-4e9f-b2a4-e4712805940e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
