# Functionality

Browser `localStorage` keys use the `dl-` prefix. The application stores a local profile, booking requests, self-reported completed practice, completed test attempts and an in-progress test.

Bookings prevent overlaps against the same student's locally stored active requests. This does not represent global inventory. Requested time never counts as completed practice.

Mock tests draw unique question IDs, preserve answers during navigation and refresh, separate incorrect from unanswered, calculate score from the total, and save a full answer review. Readiness remains unclassified until three completed attempts exist.
