# Functionality

Browser `localStorage` keys use the `dl-` prefix. The application stores a local profile, booking requests, self-reported completed practice, completed test attempts and an in-progress test.

Bookings prevent overlaps against the same student's locally stored active requests. This does not represent global inventory. Requested time never counts as completed practice.

Mock tests draw unique question IDs, preserve answers during navigation and refresh, separate incorrect from unanswered, calculate score from the total, and save a full answer review. Readiness remains unclassified until three completed attempts exist.

The public theory previews provide immediate answer feedback and a working “Another question” control. The full assessment supports optional timing, direct question navigation, answer changes and reconciled results.

The schedule has real previous/next month navigation, date and time selection, a live request summary, reset behavior and local request persistence. Displayed times are examples, not live availability.

Single sessions create booking requests. Multi-session and combined packages create package enquiries with a preferred starting date; they do not pretend that one form submission schedules every included appointment.

Theme and RTL preferences persist locally. The responsive navigation supports keyboard focus management, Escape-to-close and outside-click dismissal.
