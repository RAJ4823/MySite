import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { trackEvent } from '../utils/analytics';
import { calculateReadTime } from '../utils/readTime';

export default function BlogCard({ blog }) {
    const imgSrc = `${import.meta.env.VITE_BASE_URL || '/'}${blog.coverImage}`;
    const [readTime, setReadTime] = useState('...');

    useEffect(() => {
        // Fetch markdown content to calculate read time
        const fetchReadTime = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL || '/'}blogs/${blog.slug}.md`);
                if (response.ok) {
                    const text = await response.text();
                    setReadTime(calculateReadTime(text));
                }
            } catch {
                setReadTime('~5 min read');
            }
        };
        fetchReadTime();
    }, [blog.slug]);

    return (
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'rgba(16,14,24,0.85)',
                borderColor: 'rgba(124,58,237,0.3)',
                backdropFilter: 'blur(4px)',
                transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 10px 30px rgba(124,58,237,0.25)',
                    borderColor: 'rgba(124,58,237,0.5)',
                },
            }}
        >
            <CardActionArea
                component={Link}
                to={`/blogs/${blog.slug}`}
                onClick={() => trackEvent('blog_click', { slug: blog.slug })}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    flexGrow: 1,
                    borderRadius: 0,
                }}
            >
                {/* Cover Image */}
                <Box
                    sx={{
                        height: 180,
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'linear-gradient(135deg,#2a2345,#14121f)',
                    }}
                >
                    <img
                        src={imgSrc}
                        alt={blog.title}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))',
                        }}
                    />
                </Box>

                {/* Content */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Date & Read Time */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            {blog.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            •
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {readTime}
                        </Typography>
                    </Box>

                    {/* Title */}
                    <Typography
                        variant="h6"
                        color="primary.light"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {blog.shortTitle || blog.title}
                    </Typography>

                    {/* Excerpt */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {blog.excerpt}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {blog.tags?.slice(0, 4).map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                    fontSize: '0.7rem',
                                    height: 22,
                                    bgcolor: 'rgba(124,58,237,0.15)',
                                    color: 'primary.light',
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
