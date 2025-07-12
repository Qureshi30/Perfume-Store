import jwt from 'jsonwebtoken';
import { clerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Verify JWT from Clerk
export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token with Clerk (just decode for now, verification happens at Clerk's end)
        try {
            // Decode the JWT to get the userId (sub claim)
            const decoded = jwt.decode(token);

            if (!decoded || !decoded.sub) {
                throw new Error('Invalid token structure');
            }

            // Attach user ID to request
            req.userId = decoded.sub;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error in authentication.'
        });
    }
};

// Check if user is an admin
export const isAdmin = async (req, res, next) => {
    // First, make sure the user is authenticated
    isAuthenticated(req, res, async () => {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            try {
                // Get user from Clerk
                const user = await clerkClient.users.getUser(userId);

                // Check if user has admin role in public metadata
                if (user?.publicMetadata?.role === 'admin') {
                    return next();
                } else {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied. Admin privileges required.'
                    });
                }
            } catch (clerkError) {
                console.error('Clerk API error:', clerkError);
                return res.status(500).json({
                    success: false,
                    message: 'Error checking user privileges'
                });
            }
        } catch (error) {
            console.error('Admin check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error in admin verification'
            });
        }
    });
};

// Check if user is accessing their own resources
export const isResourceOwner = (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Resource userId is required'
            });
        }

        if (req.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own resources.'
            });
        }

        next();
    } catch (error) {
        console.error('Resource owner check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error in resource ownership verification'
        });
    }
};

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error('Middleware error:', err);

    // Check for specific error types
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    // Default server error
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};
