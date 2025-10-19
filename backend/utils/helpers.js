
exports.generateRandomString = (length = 32) => {
    return require('crypto').randomBytes(length).toString('hex');
};

exports.calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
};

exports.sanitizeHtml = (html) => {
    // Basic HTML sanitization (use a library like DOMPurify for production)
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

exports.extractExcerpt = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
};

exports.isValidObjectId = (id) => {
    return require('mongoose').Types.ObjectId.isValid(id);
};
