import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * Lấy danh sách staff với phân trang và filter
 */
export const getAllStaff = async ({ page, limit, search }) => {
  const query = {
    isDeleted: false,
    roles: { $in: ['staff'] } // Chỉ lấy staff, không lấy admin
  };

  // Tìm kiếm theo email hoặc username
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [staff, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query)
  ]);

  return {
    staff,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Lấy thông tin chi tiết một staff
 */
export const getStaffById = async (id) => {
  const staff = await User.findOne({
    _id: id,
    isDeleted: false,
    roles: { $in: ['staff'] }
  }).select('-passwordHash').lean();

  return staff;
};

/**
 * Tạo staff mới
 */
export const createStaff = async (staffData) => {
  const { email, username, password, bio, avatar } = staffData;

  // Validate email
  if (!email) {
    throw new Error('Email là bắt buộc');
  }

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) {
    throw new Error('Email đã tồn tại');
  }

  // Hash password
  let passwordHash = null;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  } else {
    // Nếu không có password, tạo password mặc định
    passwordHash = await bcrypt.hash('Staff123!', 10);
  }

  const staff = await User.create({
    email,
    username: username || email.split('@')[0],
    passwordHash,
    roles: ['staff'], // Luôn là staff
    bio: bio || '',
    avatar: avatar || '',
    premiumStatus: 'free',
    provider: 'local',
    isVerified: true, // Staff mặc định đã verified
    isActive: true
  });

  const staffObj = staff.toObject();
  delete staffObj.passwordHash;
  return staffObj;
};

/**
 * Cập nhật thông tin staff
 */
export const updateStaff = async (id, updateData) => {
  const staff = await User.findOne({
    _id: id,
    isDeleted: false,
    roles: { $in: ['staff'] }
  });

  if (!staff) {
    return null;
  }

  // Cập nhật email nếu có và kiểm tra trùng
  if (updateData.email && updateData.email !== staff.email) {
    const existingUser = await User.findOne({ 
      email: updateData.email, 
      isDeleted: false,
      _id: { $ne: id }
    });
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }
    staff.email = updateData.email;
  }

  // Cập nhật username
  if (updateData.username !== undefined) {
    staff.username = updateData.username;
  }

  // Cập nhật password nếu có
  if (updateData.password) {
    staff.passwordHash = await bcrypt.hash(updateData.password, 10);
  }

  // Không cho phép thay đổi role - staff luôn là staff
  // Không cho phép thay đổi roles trong update này

  // Cập nhật các trường khác
  if (updateData.bio !== undefined) staff.bio = updateData.bio;
  if (updateData.avatar !== undefined) staff.avatar = updateData.avatar;
  if (updateData.isActive !== undefined) staff.isActive = updateData.isActive;
  if (updateData.isVerified !== undefined) staff.isVerified = updateData.isVerified;

  await staff.save();

  const staffObj = staff.toObject();
  delete staffObj.passwordHash;
  return staffObj;
};

/**
 * Xóa staff (soft delete)
 */
export const deleteStaff = async (id) => {
  const staff = await User.findOne({
    _id: id,
    isDeleted: false,
    roles: { $in: ['staff'] }
  });

  if (!staff) {
    return null;
  }

  staff.isDeleted = true;
  await staff.save();

  return { success: true };
};
