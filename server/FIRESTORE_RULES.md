# Firestore Security Rules

This document describes the recommended Firestore security rules to prevent users from modifying their own `role` field, which could lead to privilege escalation attacks.

## Recommended Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - prevent role self-modification
    match /users/{userId} {
      // Allow read only for the authenticated user themselves
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow create for new users (first registration)
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Allow update ONLY if 'role' field is not being changed
      allow update: if request.auth != null 
                    && request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'doctorId']);
      
      // Never allow delete from client side
      allow delete: if false;
    }
    
    // Doctors collection - read-only for clients
    match /doctors/{doctorId} {
      allow read: if true; // Public doctor profiles
      allow write: if false; // Only server can modify
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      // Users can read their own appointments
      allow read: if request.auth != null 
                  && (resource.data.patientId == request.auth.uid 
                      || resource.data.doctorId == request.auth.token.doctorId);
      
      // Only server can create/update/delete
      allow write: if false;
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true; // Public reviews
      allow write: if false; // Only server can modify
    }
  }
}
```

## How to Apply

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Paste the rules above
5. Click **Publish**

## Notes

- These rules assume all write operations go through the backend server using Admin SDK
- Admin SDK bypasses all security rules
- Client-side Firebase SDK operations will be restricted by these rules
