# CrisisTrade

## Overview

CrisisTrade is a web-based disaster marketplace for citizens, volunteers, local organizations, and community groups during apocalypse or emergency situations. It helps people exchange supplies, request urgent assistance, donate free resources, and find safe exchange points when normal shops, delivery services, supply chains, and money-based transactions are no longer reliable. For the hackathon MVP it is scoped to four independent feature boards: Marketplace Trades, Emergency Requests, Donations, and Safe Exchange Points.

## Goals

1. Allow users to create, view, update, delete, and track marketplace trade posts, including simple reputation points for completed trades.
2. Allow users to create, view, update, delete, and track urgent emergency request posts.
3. Allow users to create, view, update, delete, and track donation / free-item posts.
4. Allow users to create, view, update, delete, and track safe exchange point posts.
5. Help users quickly browse and filter posts by area, urgency, item type, and status where relevant.

## Core User Flow

1. User opens CrisisTrade and lands on the main dashboard.
2. User chooses one of the four boards: Marketplace Trades, Emergency Requests, Donations, or Safe Exchange Points.
3. User browses posts on the selected board.
4. User filters posts by location, urgency, item category, or status where the board supports those fields.
5. User creates a new post by entering the required details.
6. Other users view the post and decide whether they can trade, donate, help, or meet at a safe exchange point.
7. The original user edits, deletes, or updates the post status when information changes or the need is resolved.
8. When a marketplace trade is completed, the related users receive reputation points inside the Marketplace Trades feature.

## Features

### Marketplace Trades

- Create trade posts listing what the user has, what they want in return, area, urgency, contact notes, and status.
- View, edit, delete, and update trade posts.
- Trade statuses: `available`, `pending exchange`, `completed`, `unavailable`.
- Includes simple reputation points: when a trade is marked `completed`, the related users' reputation increases.
- Reputation is shown inside the Marketplace Trades experience only — it is not a separate board.

### Emergency Requests

- Create urgent request posts for essential supplies or assistance, even with nothing to trade.
- View, edit, delete, and update request posts.
- Fields: item or help needed, area, urgency level, contact notes, status.
- Request statuses: `open`, `helped`, `closed`.

### Donations

- Create donation posts for free supplies or resources.
- View, edit, delete, and update donation posts.
- Fields: item details, pickup area, available time, quantity or limit per person, contact notes, status.
- Donation statuses: `available`, `reserved`, `finished`.
- Posts must clearly show that listed supplies are free — no payment, trading, banking, or currency logic.

### Safe Exchange Points

- Create posts for public locations useful for trades, donation pickup, or aid distribution.
- View, edit, delete, and update exchange point posts.
- Fields: place name, area, location type, open time, safety status, facilities, notes, operational status.
- Exchange point statuses: `safe`, `crowded`, `closed`, `unsafe`.

## Scope

### In Scope

- A web application with four independent CRUD feature modules (one per team member):
  - `backend/src/modules/marketplace-trades/` + `frontend/src/modules/marketplace-trades/`
  - `backend/src/modules/emergency-requests/` + `frontend/src/modules/emergency-requests/`
  - `backend/src/modules/donations/` + `frontend/src/modules/donations/`
  - `backend/src/modules/exchange-points/` + `frontend/src/modules/exchange-points/`
- Main dashboard or navigation that clearly separates the four boards.
- Post creation, listing, editing, deletion, and status updates for all four boards.
- Simple marketplace trade reputation points for completed trades.
- Basic filtering / searching by location, urgency, item type, and post status where relevant.
- Sample disaster-themed data for demo scenarios (water, food, medicine, batteries, shelter supplies, safe pickup locations).

### Integration Phase Scope (after individual boards are complete)

- A Rules and Regulations page that users must accept before entering the main app.
- Simple authentication: login, logout, current-user state, and connecting posts to the active user.
- An admin page for viewing, managing, or removing posts across all four boards.
- Auth and admin must **reuse** completed board functionality rather than change each board's core CRUD scope.

### Out of Scope During Individual Implementation

- Any feature outside the four boards.
- Authentication, accounts, roles, or permissions.
- Admin dashboard or moderation tools.
- Rules and regulations acceptance page.
- Real payment, currency exchange, banking, or crypto transactions.
- Real-time chat, private messaging, or push notifications.
- Complex moderation, identity verification, or fraud detection.
- Live map routing, GPS tracking, offline mesh networking, delivery/driver dispatch.
- Government identity verification, emergency-service integration, or official rescue coordination.

## Success Criteria

1. The homepage or main navigation clearly separates the four independent feature boards.
2. A user can create, view, edit, delete, and update the status of a marketplace trade post.
3. When a marketplace trade is completed, the related user's reputation points increase.
4. A user can create, view, edit, delete, and update the status of an emergency request post.
5. A user can create, view, edit, delete, and update the status of a donation post.
6. A user can create, view, edit, delete, and update the status of a safe exchange point post.
7. A user can filter or search posts by area, urgency, item type, or status where those fields apply.
8. The app includes sample disaster-themed data so judges can understand and test each board quickly.
