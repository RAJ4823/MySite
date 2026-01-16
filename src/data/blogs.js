// Blog posts metadata registry
export const BLOGS_DATA = {
    'building-superchess': {
        slug: 'building-superchess',
        title: 'SuperChess: Building a Production-Grade, Real-Time Multiplayer Chess Platform from Scratch',
        shortTitle: 'Building SuperChess',
        excerpt: 'A deep-dive into building a full-stack, real-time chess platform—covering architecture, the technical hurdles, and how I solved each one.',
        date: 'Jan 2026',
        tags: ['React', 'Spring Boot', 'WebSocket', 'Stockfish'],
        coverImage: 'images/portfolio/super-chess.jpg',
        // Link to related project in projects.js
        projectKey: 'super-chess',
    },
};

// Helper to get blog by slug
export const getBlogBySlug = (slug) => BLOGS_DATA[slug] || null;

// Get all blogs as array sorted by date (newest first)
export const getAllBlogs = () => Object.values(BLOGS_DATA);

