const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: 'ID bài viết',
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID của người dùng đăng bài',
        references: {
            model: 'users',  // Liên kết với bảng users
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Nội dung bài đăng',
    },
    media: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Danh sách media đính kèm (hình ảnh, video)',
    },
    likes_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'Số lượt thích bài đăng',
    },
    comments_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'Số lượt bình luận bài đăng',
    },
    is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Quyền riêng tư của bài đăng (true: công khai, false: chỉ mình tôi)',
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Đánh dấu bài viết đã bị xóa (soft delete)',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Thời gian tạo bài viết',
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        comment: 'Thời gian cập nhật bài viết',
    },
}, {
    tableName: 'posts',
    timestamps: false,  // Chúng ta sẽ sử dụng `created_at` và `updated_at` thay vì `timestamps: true`
    comment: 'Bảng lưu thông tin bài đăng',
});

// Quan hệ giữa bảng `posts` và `users`
Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = Post;
