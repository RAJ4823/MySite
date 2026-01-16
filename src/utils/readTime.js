// Calculate reading time based on word count
// Average reading speed: 200-250 words per minute
// Using 200 wpm for technical content (slower reading)

export function calculateReadTime(text) {
    if (!text) return '1 min read';

    // Remove code blocks (they take longer to read/understand)
    const textWithoutCode = text.replace(/```[\s\S]*?```/g, '');

    // Count words
    const words = textWithoutCode.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Add extra time for code blocks (estimate 30 seconds per code block)
    const codeBlocks = (text.match(/```[\s\S]*?```/g) || []).length;
    const codeReadingMinutes = codeBlocks * 0.5;

    // Calculate reading time (200 words per minute for technical content)
    const readingMinutes = Math.ceil(wordCount / 200 + codeReadingMinutes);

    // Minimum 1 minute
    const finalMinutes = Math.max(1, readingMinutes);

    return `${finalMinutes} min read`;
}

// Get word count for display
export function getWordCount(text) {
    if (!text) return 0;
    const textWithoutCode = text.replace(/```[\s\S]*?```/g, '');
    return textWithoutCode.trim().split(/\s+/).filter(word => word.length > 0).length;
}
