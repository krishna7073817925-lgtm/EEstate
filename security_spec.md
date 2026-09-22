# Security Specification

## 1. Data Invariants
1. **Public Property Listings**: Any client (guest or logged in) can browse and view property details.
2. **Owner-only Property Mutations**: Only an authenticated user matching `ownerId` can create, update, or delete a property listing. The `ownerId` cannot be forged or altered.
3. **Identity Verification on Viewing Bookings**: Users can only create viewing appointments under their own verified `userId`.
4. **Booking Confidentiality**: Viewing bookings can only be listed and viewed by the client who scheduled it or the property owner.
5. **User Profile Protection**: Users can only read and write their own profile document.
6. **Input Boundary Enforcement**: String lengths, prices, bed/bath numbers, and categories must adhere strictly to valid bounds to prevent resource poisoning or state corruption.

## 2. Dirty Dozen Security Payloads
1. `PROP_SPOOF_OWNER`: Malicious user attempting to create property with someone else's UID. (Must reject).
2. `PROP_UNAUTH_DELETE`: Malicious user attempting to delete another host's property. (Must reject).
3. `PROP_UNAUTH_UPDATE`: Malicious user modifying price or details of another agent's property. (Must reject).
4. `PROP_OVERSIZE_STRING`: Listing with a 2MB title or description string. (Must reject).
5. `PROP_NEGATIVE_PRICE`: Listing with a negative price or invalid category. (Must reject).
6. `BOOKING_SPOOF_USER`: Client scheduling viewing under another user's `userId`. (Must reject).
7. `BOOKING_SNOOP_ALL`: Unauthorized user querying all viewing bookings across the database. (Must reject).
8. `USER_SPOOF_PROFILE`: User writing to `/users/anotherUserId`. (Must reject).
9. `USER_INJECT_SYSTEM_ROLE`: User attempting to grant themselves system admin rights. (Must reject).
10. `ANON_PROPERTY_WRITE`: Unauthenticated visitor attempting to write property document. (Must reject).
11. `MALFORMED_DOC_ID`: Attempting to use path ID longer than 128 characters or special exploit characters. (Must reject).
12. `ORPHAN_BOOKING`: Booking without required propertyId or date. (Must reject).
