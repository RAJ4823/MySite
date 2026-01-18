import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getBlogBySlug } from '../data/blogs';
import { trackEvent } from '../utils/analytics';
import useSEO from '../hooks/useSEO';
import { calculateReadTime } from '../utils/readTime';
import { useMediaQuery } from '@mui/material';


const createMarkdownComponents = (toc, TableOfContents) => ({
    // Code blocks with syntax highlighting
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                    margin: '1.5rem 0',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                }}
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code
                className={className}
                style={{
                    background: 'rgba(124,58,237,0.15)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                }}
                {...props}
            >
                {children}
            </code>
        );
    },
    // Headings - with IDs for TOC navigation
    h1: ({ children }) => {
        const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
            <Typography id={id} variant="h4" component="h1" sx={{ fontWeight: 800, mt: 0, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {children}
            </Typography>
        );
    },
    h2: ({ children }) => {
        const text = String(children);
        // Detect "Table of Contents" heading and replace with dynamic TOC
        if (text.toLowerCase() === 'table of contents') {
            return <TableOfContents toc={toc} />;
        }
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
            <Typography id={id} variant="h5" component="h2" sx={{ fontWeight: 700, mt: 1, mb: 2, color: 'primary.light' }}>
                {children}
            </Typography>
        );
    },
    h3: ({ children }) => {
        const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
            <Typography id={id} variant="h6" component="h3" sx={{ fontWeight: 700, mt: 1, mb: 1.5 }}>
                {children}
            </Typography>
        );
    },
    h4: ({ children }) => (
        <Typography variant="h6" component="h4" sx={{ fontWeight: 600, mt: 1, mb: 1 }}>
            {children}
        </Typography>
    ),
    // Paragraphs - handle badge images inline
    p: ({ children, node }) => {
        // Check if paragraph contains only images (badges)
        const hasOnlyImages = node?.children?.every(
            child => child.type === 'element' && child.tagName === 'img'
        );
        if (hasOnlyImages) {
            return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}>
                    {children}
                </Box>
            );
        }
        return (
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: 'text.primary' }}>
                {children}
            </Typography>
        );
    },
    // Links
    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#9F67F6', textDecoration: 'underline' }}
        >
            {children}
        </a>
    ),
    // Lists
    ul: ({ children }) => (
        <Box component="ul" sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}>
            {children}
        </Box>
    ),
    ol: ({ children }) => (
        <Box component="ol" sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}>
            {children}
        </Box>
    ),
    li: ({ children }) => (
        <Typography component="li" variant="body1" sx={{ lineHeight: 1.8 }}>
            {children}
        </Typography>
    ),
    // Blockquotes
    blockquote: ({ children }) => (
        <Box
            component="blockquote"
            sx={{
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                pl: 2,
                py: 1,
                my: 2,
                bgcolor: 'rgba(124,58,237,0.1)',
                borderRadius: '0 8px 8px 0',
                '& p': { mb: 0 },
            }}
        >
            {children}
        </Box>
    ),
    // Tables
    table: ({ children }) => (
        <Box sx={{ overflowX: 'auto', mb: 2 }}>
            <Box
                component="table"
                sx={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    '& th, & td': {
                        border: '1px solid rgba(255,255,255,0.1)',
                        px: 2,
                        py: 1,
                        textAlign: 'left',
                    },
                    '& th': {
                        bgcolor: 'rgba(124,58,237,0.2)',
                        fontWeight: 600,
                    },
                    '& tr:nth-of-type(even)': {
                        bgcolor: 'rgba(255,255,255,0.02)',
                    },
                }}
            >
                {children}
            </Box>
        </Box>
    ),
    // Horizontal rule
    hr: () => (
        <Box
            component="hr"
            sx={{
                border: 'none',
                height: '1px',
                bgcolor: 'rgba(255,255,255,0.1)',
                my: 4,
            }}
        />
    ),
    // Images - inline for badges, block for regular images
    img: ({ src, alt }) => {
        const isBadge = src?.includes('img.shields.io') || src?.includes('badge');
        return (
            <Box
                component="img"
                src={src}
                alt={alt}
                loading="lazy"
                sx={{
                    maxWidth: '100%',
                    height: isBadge ? 'auto' : 'auto',
                    borderRadius: isBadge ? 1 : 2,
                    my: isBadge ? 0 : 2,
                    display: isBadge ? 'inline-block' : 'block',
                }}
            />
        );
    },
});

// Helper to generate TOC from markdown content
function generateTOC(markdown) {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const toc = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length; // 2 for ##, 3 for ###
        const text = match[2];
        // Skip the Table of Contents heading itself
        if (text.toLowerCase() === 'table of contents') continue;
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        toc.push({ level, text, id });
    }

    return toc;
}

// TOC Component
function TableOfContents({ toc }) {
    if (!toc || toc.length === 0) return null;

    return (
        <Box
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 1,
                bgcolor: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.light' }}>
                Table of Contents
            </Typography>
            <Box component="nav">
                {toc.map((item, index) => (
                    <Box
                        key={index}
                        component="a"
                        href={`#${item.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(item.id);
                            if (element) {
                                const navbarHeight = 100; // Account for sticky navbar
                                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                                window.scrollTo({
                                    top: elementPosition - navbarHeight,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        sx={{
                            display: 'block',
                            py: 0.5,
                            pl: item.level === 3 ? 2 : 0,
                            color: 'text.secondary',
                            textDecoration: 'none',
                            fontSize: item.level === 3 ? '0.9rem' : '1rem',
                            transition: 'color 0.2s',
                            '&:hover': {
                                color: 'primary.light',
                            },
                        }}
                    >
                        {item.level === 3 ? '└ ' : ''}{item.text}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default function BlogDetail() {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    // Generate TOC from content
    const toc = content ? generateTOC(content) : [];

    const blog = getBlogBySlug(slug);

    useSEO({
        title: `${blog?.shortTitle || blog?.title || 'Blog Not Found'} | Blogs`,
        description: blog?.excerpt || 'Blog Not Found',
        canonical: `/blogs/${slug}`,
        keywords: [
            'Raj Patel', 'iamraj', 'iamraj.dev', 'rajpatel', 'raj patel developer', 'raj patel portfolio',
            ...blog?.keywords,
            ...blog?.tags
        ],
    });

    useEffect(() => {
        if (!blog) {
            setError('Blog not found');
            setLoading(false);
            return;
        }

        trackEvent('blog_view', { slug });

        // Fetch markdown content
        const fetchContent = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL || '/'}blogs/${slug}.md`);
                if (!response.ok) throw new Error('Failed to load blog content');
                const text = await response.text();
                setContent(text);
            } catch (err) {
                setError('Failed to load blog content');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [slug, blog]);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh' }}>
                <Navbar />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress color="primary" />
                </Box>
            </Box>
        );
    }

    if (error || !blog) {
        return (
            <Box sx={{ minHeight: '100vh' }}>
                <Navbar />
                <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        {error || 'Blog not found'}
                    </Typography>
                    <Button component={Link} to="/blogs" variant="contained" color="primary">
                        Back to Blogs
                    </Button>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Navbar />

            <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
                {/* Blog Header */}
                <Box sx={{ mb: 4 }}>
                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {blog.tags?.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(124,58,237,0.15)',
                                    color: 'primary.light',
                                }}
                            />
                        ))}
                    </Box>

                    {/* Meta */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, color: 'text.secondary' }}>
                        <Typography variant="body2">{blog.date}</Typography>
                        <Typography variant="body2">•</Typography>
                        <Typography variant="body2">{calculateReadTime(content)}</Typography>
                    </Box>
                </Box>

                {/* Blog Content */}
                <Box
                    sx={{
                        p: { xs: 2, md: 4 },
                        borderRadius: 2,
                        bgcolor: 'rgba(16,14,24,0.85)',
                        border: '1px solid rgba(124,58,237,0.25)',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={createMarkdownComponents(toc, TableOfContents)}>
                        {content}
                    </ReactMarkdown>
                </Box>

                {blog.linkedinPostUrl && (
                    <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(124,58,237,0.1)', borderRadius: 2, textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            LinkedIn Post
                        </Typography>
                        <iframe src={blog.linkedinPostUrl} height="548px" width={isMobile ? '100%' : '504px'} frameBorder="0" allowFullScreen title="Embedded post"></iframe>
                    </Box>
                )}

                {/* Related Project Link */}
                {blog.projectKey && (
                    <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(124,58,237,0.1)', borderRadius: 2, textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Want to try it out?
                        </Typography>
                        <Button
                            href="https://superchess.iamraj.dev"
                            target="_blank"
                            rel="noopener"
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => trackEvent('blog_cta_click', { slug, action: 'visit_project' })}
                        >
                            Play SuperChess Now
                        </Button>
                    </Box>
                )}
            </Container>

            <Footer />
        </Box>
    );
}
