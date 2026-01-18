// Blog posts metadata registry
export const BLOGS_DATA = {
    'building-superchess': {
        slug: 'building-superchess',
        title: 'Building SuperChess: A Production-Ready Real-Time Multiplayer Chess Platform',
        shortTitle: 'Building SuperChess',
        excerpt: 'How I built SuperChess from scratch with WebSockets, Stockfish AI integration, authentication, and the key engineering challenges I solved along the way.',
        date: 'Jan 2026',
        tags: ['React', 'Spring Boot', "PostgreSQL", "Stockfish", "OAuth2"],
        keywords: ['SuperChess Blog', 'Building SuperChess', 'SuperChess', 'Real Time Multiplayer Chess Platform', 'Chess Programming', 'Software Engineering', 'Full Stack Development'],
        coverImage: 'images/portfolio/super-chess.jpg',
        linkedinPostUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7416433298438156288?collapsed=1',
        projectKey: 'super-chess',
    },
};

// Helper to get blog by slug
export const getBlogBySlug = (slug) => BLOGS_DATA[slug] || null;

// Get all blogs as array sorted by date (newest first)
export const getAllBlogs = () => Object.values(BLOGS_DATA);

