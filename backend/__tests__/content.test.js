
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Content = require('../models/Content.model');
const User = require('../models/User.model');
const Category = require('../models/Category.model');

describe('Content Routes', () => {
    let token;
    let user;
    let category;

    beforeAll(async () => {
        // Connect to a test database
        const url = 'mongodb://127.0.0.1/test_db';
        await mongoose.connect(url);

        // Create a user
        user = new User({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'admin' });
        await user.save();

        // Create a category
        category = new Category({ name: 'Test Category', slug: 'test-category' });
        await category.save();
    });

    beforeEach(async () => {
        // Get a fresh token before each test
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password',
            });
        token = res.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Content.deleteMany();
    });

    describe('GET /api/contents/latest', () => {
        it('should get the latest content', async () => {
            // Create some content
            await Content.create([
                { title: 'Latest 1', body: 'body', author: user._id, status: 'published', publishAt: new Date(), category: category._id },
                { title: 'Latest 2', body: 'body', author: user._id, status: 'published', publishAt: new Date(), category: category._id },
            ]);

            const res = await request(app).get('/api/contents/latest');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toEqual(2);
            expect(res.body.data[0].title).toEqual('Latest 2');
        });
    });

    describe('GET /api/contents/trending', () => {
        it('should get trending content', async () => {
            // Create some content
            await Content.create([
                { title: 'Trending 1', body: 'body', author: user._id, status: 'published', views: 100, category: category._id },
                { title: 'Trending 2', body: 'body', author: user._id, status: 'published', views: 200, category: category._id },
            ]);

            const res = await request(app).get('/api/contents/trending');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toEqual(2);
            expect(res.body.data[0].title).toEqual('Trending 2');
        });
    });

    describe('GET /api/contents/popular', () => {
        it('should get popular content', async () => {
            // Create some content
            await Content.create([
                { title: 'Popular 1', body: 'body', author: user._id, status: 'published', isPopular: true, category: category._id },
                { title: 'Popular 2', body: 'body', author: user._id, status: 'published', isPopular: true, category: category._id },
                { title: 'Not Popular', body: 'body', author: user._id, status: 'published', isPopular: false, category: category._id },
            ]);

            const res = await request(app).get('/api/contents/popular');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toEqual(2);
        });
    });

    describe('GET /api/contents/featured', () => {
        it('should get featured content', async () => {
            // Create some content
            await Content.create([
                { title: 'Featured 1', body: 'body', author: user._id, status: 'published', isFeatured: true, featuredOrder: 1, category: category._id },
                { title: 'Featured 2', body: 'body', author: user._id, status: 'published', isFeatured: true, featuredOrder: 2, category: category._id },
                { title: 'Not Featured', body: 'body', author: user._id, status: 'published', isFeatured: false, category: category._id },
            ]);

            const res = await request(app).get('/api/contents/featured');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toEqual(2);
            expect(res.body.data[0].title).toEqual('Featured 2');
        });
    });

    describe('PUT /api/contents/:id/flags', () => {
        it('should update content flags', async () => {
            // Create some content
            const content = await Content.create({ title: 'Content', body: 'body', author: user._id, status: 'published', category: category._id });

            const res = await request(app)
                .put(`/api/contents/${content._id}/flags`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    isFeatured: true,
                    isPopular: true,
                    featuredOrder: 10,
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.isFeatured).toEqual(true);
            expect(res.body.data.isPopular).toEqual(true);
            expect(res.body.data.featuredOrder).toEqual(10);
        });
    });
});
