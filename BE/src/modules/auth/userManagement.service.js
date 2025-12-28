import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

// Các role được phép quản lý (không bao gồm staff và admin)
const MANAGABLE_ROLES = ['user', 'creator', 'brand'];

/**
 * Lấy danh sách users với phân trang và filter
 */
export const getAllUsers = async ({ page, limit, role, search }) => {
  const query = {
    isDeleted: false,
    roles: { $in: MANAGABLE_ROLES } // Chỉ lấy user, creator, brand
  };

  // Filter theo role nếu có
  if (role && MANAGABLE_ROLES.includes(role)) {
    query.roles = { $in: [role] };
  }

  // Tìm kiếm theo email hoặc username
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query)
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Lấy thông tin chi tiết một user
 */
export const getUserById = async (id) => {
  const user = await User.findOne({
    _id: id,
    isDeleted: false,
    roles: { $in: MANAGABLE_ROLES }
  }).select('-passwordHash').lean();

  return user;
};

/**
 * Tạo user mới
 */
export const createUser = async (userData) => {
  const { email, username, password, roles, bio, avatar, premiumStatus } = userData;

  // Validate email
  if (!email) {
    throw new Error('Email là bắt buộc');
  }

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) {
    throw new Error('Email đã tồn tại');
  }

  // Validate roles - chỉ cho phép user, creator, brand
  const validRoles = Array.isArray(roles) 
    ? roles.filter(r => MANAGABLE_ROLES.includes(r))
    : [roles].filter(r => MANAGABLE_ROLES.includes(r));

  if (validRoles.length === 0) {
    validRoles.push('user'); // Mặc định là user
  }

  // Hash password nếu có
  let passwordHash = null;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  } else {
    // Nếu không có password, tạo password mặc định
    passwordHash = await bcrypt.hash('Password123!', 10);
  }

  const user = await User.create({
    email,
    username: username || email.split('@')[0],
    passwordHash,
    roles: validRoles,
    bio: bio || '',
    avatar: avatar || '',
    premiumStatus: premiumStatus || 'free',
    provider: 'local',
    isVerified: false,
    isActive: true
  });

  const userObj = user.toObject();
  delete userObj.passwordHash;
  return userObj;
};

/**
 * Cập nhật thông tin user
 */
export const updateUser = async (id, updateData) => {
  const user = await User.findOne({
    _id: id,
    isDeleted: false,
    roles: { $in: MANAGABLE_ROLES }
  });

  if (!user) {
    return null;
  }

  // Cập nhật email nếu có và kiểm tra trùng
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await User.findOne({ 
      email: updateData.email, 
      isDeleted: false,
      _id: { $ne: id }
    });
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }
    user.email = updateData.email;
  }

  // Cập nhật username
  if (updateData.username !== undefined) {
    user.username = updateData.username;
  }

  // Cập nhật password nếu có
  if (updateData.password) {
    user.passwordHash = await bcrypt.hash(updateData.password, 10);
  }

  // Cập nhật roles (chỉ cho phép user, creator, brand)
  if (updateData.roles) {
    const validRoles = Array.isArray(updateData.roles)
      ? updateData.roles.filter(r => MANAGABLE_ROLES.includes(r))
      : [updateData.roles].filter(r => MANAGABLE_ROLES.includes(r));
    
    if (validRoles.length > 0) {
      user.roles = validRoles;
    }
  }

  // Cập nhật các trường khác
  if (updateData.bio !== undefined) user.bio = updateData.bio;
  if (updateData.avatar !== undefined) user.avatar = updateData.avatar;
  if (updateData.premiumStatus !== undefined) {
    if (['free', 'premium'].includes(updateData.premiumStatus)) {
      user.premiumStatus = updateData.premiumStatus;
    }
  }
  if (updateData.isActive !== undefined) user.isActive = updateData.isActive;
  if (updateData.isVerified !== undefined) user.isVerified = updateData.isVerified;

  await user.save();

  const userObj = user.toObject();
  delete userObj.passwordHash;
  return userObj;
};

/**
 * Xóa user (soft delete)
 */
export const deleteUser = async (id) => {
  const user = await User.findOne({
    _id: id,
    isDeleted: false,
    roles: { $in: MANAGABLE_ROLES }
  });

  if (!user) {
    return null;
  }

  user.isDeleted = true;
  await user.save();

  return { success: true };
};

