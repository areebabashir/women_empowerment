# Participant Management System

This document describes the comprehensive participant management system implemented in the admin dashboard for both events and programs.

## Overview

The participant management system provides a complete solution for managing participants across events and programs, including:

- **Event Participants Management**: Add, view, and remove participants from specific events
- **Program Participants Management**: Add, view, and remove participants from specific programs
- **Unified Dashboard**: View all events and programs with their participant counts
- **CSV Export**: Export participant data for reporting and analysis
- **User Integration**: Seamlessly integrate with existing user management system

## Features

### 1. Event Participants Management (`/Admin/Event/Participants/:eventId`)

**Features:**
- View all participants for a specific event
- Add new participants from available users
- Remove participants from the event
- Export participant list as CSV
- Search and filter participants
- Pagination for large participant lists

**API Endpoints Used:**
- `GET /api/events/:eventId/getallparticipants` - Get participants for specific event
- `POST /api/events/:eventId/participants` - Add participant to event
- `DELETE /api/events/:eventId/participants` - Remove participant from event
- `GET /api/users/getalluser` - Get all users for adding participants

### 2. Program Participants Management (`/Admin/Program/Participants/:programId`)

**Features:**
- View all participants for a specific program
- Add new participants from available users
- Remove participants from the program
- Export participant list as CSV
- Search and filter participants
- Pagination for large participant lists

**API Endpoints Used:**
- `GET /api/programs/:programId/participants` - Get participants for specific program
- `POST /api/programs/add/:programId/participants` - Add participant to program
- `DELETE /api/programs/:programId/deleteparticipants` - Remove participant from program
- `GET /api/users/getalluser` - Get all users for adding participants

### 3. Unified Participant Dashboard (`/Admin/Participants`)

**Features:**
- Overview of all events and programs with participant counts
- Statistics and analytics
- Quick access to manage participants for any event or program
- Search and filter across all events and programs
- Export all participants data as CSV
- Sort by participant count, name, or date

**API Endpoints Used:**
- `GET /api/events/getalleventwithparticipants` - Get all events with participants
- `GET /api/programs/getallprogramwithparticipants` - Get all programs with participants

## Navigation

### Sidebar Navigation
- Added "Participants" link in the sidebar navigation
- Icon: `faUserFriends`
- Route: `/Admin/Participants`

### Quick Actions Dashboard
- Added participant management quick action cards on the main dashboard
- Direct links to participant management, events, and programs

### Event/Program Management Pages
- Updated existing event and program cards to link to participant management
- Replaced modal popups with dedicated participant management pages

## Components

### 1. EventParticipants.jsx
**Location:** `src/Admin/event/EventParticipants.jsx`

**Key Features:**
- Event details display
- Participant list with search and pagination
- Add participants modal with user selection
- Remove participants with confirmation
- CSV export functionality
- Responsive design

### 2. ProgramParticipants.jsx
**Location:** `src/Admin/program/ProgramParticipants.jsx`

**Key Features:**
- Program details display
- Participant list with search and pagination
- Add participants modal with user selection
- Remove participants with confirmation
- CSV export functionality
- Responsive design

### 3. ParticipantDashboard.jsx
**Location:** `src/Admin/Dashboard/ParticipantDashboard.jsx`

**Key Features:**
- Statistics cards showing totals
- Grid view of all events and programs
- Search and filter functionality
- Sort options (participants, name, date)
- Export all participants data
- Quick access to individual management pages

## API Integration

### Required Backend Endpoints

The system expects the following API endpoints to be implemented on the backend:

#### Event Participants
```javascript
// Get participants for specific event
GET /api/events/:eventId/getallparticipants
Response: { participants: [...] }

// Add participant to event
POST /api/events/:eventId/participants
Body: { participantId: "user_id" }

// Remove participant from event
DELETE /api/events/:eventId/participants
Body: { participantId: "user_id" }

// Get all events with participants
GET /api/events/getalleventwithparticipants
Response: { events: [{ participants: [...] }] }
```

#### Program Participants
```javascript
// Get participants for specific program
GET /api/programs/:programId/participants
Response: { participants: [...] }

// Add participant to program
POST /api/programs/add/:programId/participants
Body: { participantId: "user_id" }

// Remove participant from program
DELETE /api/programs/:programId/deleteparticipants
Body: { participantId: "user_id" }

// Get all programs with participants
GET /api/programs/getallprogramwithparticipants
Response: { programs: [{ participants: [...] }] }
```

#### User Management
```javascript
// Get all users (for adding participants)
GET /api/users/getalluser
Headers: { Authorization: "Bearer token" }
Response: { users: [...] }
```

## Data Structure

### Participant Object
```javascript
{
  _id: "participant_id",
  name: "Participant Name",
  email: "participant@email.com",
  phone: "1234567890",
  role: "member|volunteer|donor",
  enrollmentDate: "2023-01-01T00:00:00.000Z"
}
```

### Event/Program with Participants
```javascript
{
  _id: "event_id",
  name: "Event Name",
  description: "Event description",
  date: "2023-01-01",
  location: "Event location",
  participants: [participant_objects],
  participantCount: 10
}
```

## Usage Instructions

### For Administrators

1. **Access Participant Management:**
   - Navigate to `/Admin/Participants` for the unified dashboard
   - Or use the "Participants" link in the sidebar

2. **Manage Event Participants:**
   - Go to Events page (`/Admin/Events`)
   - Click the participants icon on any event card
   - Or navigate directly to `/Admin/Event/Participants/:eventId`

3. **Manage Program Participants:**
   - Go to Programs page (`/Admin/Program`)
   - Click the participants icon on any program card
   - Or navigate directly to `/Admin/Program/Participants/:programId`

4. **Add Participants:**
   - Click "Add Participants" button
   - Select users from the available list
   - Click "Add" to enroll them

5. **Remove Participants:**
   - Click the remove icon next to any participant
   - Confirm the action

6. **Export Data:**
   - Click "Export CSV" to download participant data
   - Use "Export All Participants" for comprehensive data export

### For Developers

1. **Adding New Features:**
   - Extend the participant management components
   - Add new API endpoints as needed
   - Update the data structures accordingly

2. **Customization:**
   - Modify the UI components in the respective `.jsx` files
   - Update the API integration in the components
   - Customize the CSV export format

3. **Integration:**
   - Ensure all required API endpoints are implemented
   - Test the participant management flow
   - Verify user authentication and authorization

## Security Considerations

- All participant management routes are protected with authentication
- User role filtering ensures only appropriate users can be added as participants
- Confirmation dialogs prevent accidental participant removal
- API calls include proper authorization headers

## Performance Considerations

- Pagination implemented for large participant lists
- Search functionality with debouncing
- Efficient data loading with proper error handling
- Responsive design for mobile and desktop usage

## Future Enhancements

Potential improvements and additional features:

1. **Bulk Operations:**
   - Bulk add/remove participants
   - Import participants from CSV

2. **Advanced Analytics:**
   - Participant engagement metrics
   - Attendance tracking
   - Performance analytics

3. **Communication Features:**
   - Send notifications to participants
   - Email integration
   - SMS notifications

4. **Advanced Filtering:**
   - Filter by participant role
   - Filter by enrollment date
   - Advanced search options

5. **Reporting:**
   - Detailed participant reports
   - Custom report generation
   - Scheduled report delivery

## Troubleshooting

### Common Issues

1. **Participants not loading:**
   - Check API endpoint availability
   - Verify authentication tokens
   - Check network connectivity

2. **Cannot add participants:**
   - Ensure user exists in the system
   - Check user role permissions
   - Verify API endpoint implementation

3. **Export not working:**
   - Check browser download settings
   - Verify data availability
   - Check console for errors

### Debug Information

- All API calls are logged to the console
- Error messages are displayed to users
- Loading states provide feedback during operations

## Support

For technical support or questions about the participant management system:

1. Check the browser console for error messages
2. Verify API endpoint availability
3. Test with different user accounts
4. Review the network tab for API call issues

---

This participant management system provides a comprehensive solution for managing participants across events and programs, with a focus on usability, performance, and extensibility. 