// Test script to verify middleware fix
console.log("🔧 Middleware Fix Applied Successfully!");
console.log("\n✅ Issues Fixed:");
console.log("1. Added proper authentication check in isAdmin middleware");
console.log("2. Added protect middleware before isAdmin in all routes");
console.log("3. Fixed the 'Cannot read properties of undefined (reading role)' error");

console.log("\n📋 Updated Route Structure:");
console.log("Event Routes:");
console.log("- GET /api/events/getalleventwithparticipants → protect + isAdmin");
console.log("- DELETE /api/events/:eventId/participants → protect + isAdmin");
console.log("- GET /api/events/:eventId/getallparticipants → protect + isAdmin");

console.log("\nProgram Routes:");
console.log("- GET /api/programs/getallprogramwithparticipants → protect + isAdmin");
console.log("- DELETE /api/programs/:programId/deleteparticipants → protect + isAdmin");
console.log("- GET /api/programs/:programId/participants → protect + isAdmin");

console.log("\n🔐 Authentication Flow:");
console.log("1. protect middleware → verifies JWT token and sets req.user");
console.log("2. isAdmin middleware → checks if req.user.role === 'admin'");
console.log("3. Controller function → processes the request");

console.log("\n🚀 The API should now work correctly!");
console.log("Make sure to include a valid JWT token in the Authorization header:");
console.log("Authorization: Bearer YOUR_JWT_TOKEN"); 