# Production integration

Replace the local profile with server-side sessions and a secure identity provider. Never treat localStorage as authentication.

Connect booking forms to a scheduling backend that owns availability, conflict checks, time-zone conversion and confirmation status. Keep the current “Requested” state until the provider confirms a slot.

Attendance or instructor systems—not booking creation—should create verified completed hours. Preserve a visibly distinct source label for self-reported entries.

Move test attempts to authenticated storage if cross-device history is needed. Validate and version the question bank server-side for a selected jurisdiction. Do not add credentials to this repository.
