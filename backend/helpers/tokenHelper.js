import JWT from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = async (user) => {
    // Use environment variable or fallback secret
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    return JWT.sign(
        { _id: user._id, role: user.role, name: user.name, email: user.email },
        jwtSecret,
        { expiresIn: '7d' }
    );
};
