const Post = require('../models/Post'); // Lấy danh sách tất cả users
const cloudinary = require('../config/cloudinary');
const { validate } = require('../config/validate');
const { body } = require('express-validator');
const { formatApiResponse } = require('../helpers/formatApiResponse');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll(); // Lấy tất cả bản ghi
        res.json(formatApiResponse(posts, 1));
    } catch (err) {
        res.status(500).json(formatApiResponse({ message: err.message }, 0));
    }
};

const getPostById = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await Post.findByPk(postId); // Lấy bản ghi theo ID
        if (!post) {
            return res.status(404).json(formatApiResponse({ message: 'Post not found' }, 0));
        }
        res.json(formatApiResponse(post, 1));
    } catch (err) {
        res.status(500).json(formatApiResponse({ message: err.message }, 0));
    }
};

const createPost = async (req, res) => {
    try {
        // Kiểm tra validation
        validate([
            body('content').optional().notEmpty().withMessage('Content cannot be empty if provided'),
            body('media').optional().isArray().withMessage('Media should be an array if provided')
        ])(req, res, async () => {
            const { content, media, is_public, user_id } = req.body;

            // Kiểm tra xem có ít nhất một trong hai trường là không rỗng (content hoặc media)
            if (!content && (!media || media.length === 0)) {
                return res.status(400).json(formatApiResponse({ message: 'Content or Media is required' }, 0));
            }

            // Biến lưu trữ URL của media sau khi tải lên
            let mediaUrls = null;

            // Nếu có media, tiến hành xử lý tải lên (ví dụ: upload lên Cloudinary)
            if (media && media.length > 0) {
                try {
                    mediaUrls = await uploadMedia(media); // Giả sử bạn có hàm uploadMedia để tải lên media
                } catch (error) {
                    return res.status(500).json(formatApiResponse({ message: 'Error uploading media', error: error.message }, 0));
                }
            }

            // Tạo bài viết
            const post = await Post.create({
                content: content || null,   // Nếu content rỗng thì set là null
                media: mediaUrls || null,    // Nếu không có media thì set là null
                is_public: is_public || true, // Mặc định công khai
                user_id: user_id,            // Giả sử đã có user_id từ req.body
            });

            // Trả về bài viết vừa tạo
            res.status(201).json(formatApiResponse(post, 1));
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(formatApiResponse({ message: err.message }, 0));
    }
};

// Hàm xử lý upload media lên Cloudinary (hoặc dịch vụ khác)
const uploadMedia = async (media) => {
    
    // Nếu media là một mảng, xử lý từng item
    const uploadPromises = media.map(async (file) => {
        try {
            // Giả sử bạn sử dụng Cloudinary để upload
            const result = await cloudinary.uploader.upload(file, { resource_type: 'auto' });
            return result.secure_url; // Trả về URL của tệp đã tải lên
        } catch (error) {
            throw new Error('Failed to upload media: ' + error.message);
        }
    });

    // Đợi tất cả các media được tải lên và trả về mảng URL
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls; // Trả về mảng URL của các media đã tải lên
};


module.exports = { getPosts, getPostById };