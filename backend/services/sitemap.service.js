const Category = require('../models/Category.model');
const Content = require('../models/Content.model');

exports.getSitemapData = async () => {
    const categories = await Category.find({}, 'name slug').sort({ name: 1 });
    const contents = await Content.find({}, 'title slug createdAt').sort({ createdAt: -1 }).limit(10); // Adjust limit as needed

    // You can add more data here, like popular tags, etc.
    const popularTags = [
        { name: 'react', slug: 'react' },
        { name: 'javascript', slug: 'javascript' },
        { name: 'web-development', slug: 'web-development' },
    ];

    return {
        categories: categories.map(cat => ({ name: cat.name, slug: cat.slug })),
        contents: contents.map(content => ({ title: content.title, slug: content.slug, createdAt: content.createdAt })),
        popularTags: popularTags.map(tag => ({ name: tag.name, slug: tag.slug })),
        // Add more sitemap relevant data here
    };
};
