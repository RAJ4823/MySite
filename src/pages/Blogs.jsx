import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';
import Section from '../components/Section';
import { getAllBlogs } from '../data/blogs';
import useSEO from '../hooks/useSEO';

export default function BlogList() {
    const blogs = getAllBlogs();

    useSEO({
        title: 'Blogs',
        description: 'A space where I share ideas, stories, and things I’m learning—ranging from tech and building projects to travel, science, and anything else that sparks curiosity.',
        canonical: '/blogs',
    });

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Navbar />

            <Section id="blogs">
                {/* Header */}
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                    Blogs
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    A space where I share ideas, stories, and things I’m learning—ranging from tech and building projects to travel, science, and anything else that sparks curiosity.
                </Typography>

                {/* Blog Grid */}
                {blogs.length > 0 ? (
                    <>
                        <Grid container spacing={2}>
                            {blogs.map((blog) => (
                                <Grid size={{ xs: 12, sm: 6, md: 6 }} key={blog.slug}>
                                    <BlogCard blog={blog} />
                                </Grid>
                            ))}
                        </Grid>

                        <Box
                            sx={{
                                mt: 8,
                                mb: 2,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                More blogs to come...
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <Box
                        sx={{
                            py: 8,
                            textAlign: 'center',
                            bgcolor: 'rgba(255,255,255,0.02)',
                            borderRadius: 2,
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            No blog posts yet. Check back soon!
                        </Typography>
                    </Box>
                )}
            </Section>

            <Footer />
        </Box>
    );
}

