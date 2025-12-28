import * as userManagementService from './userManagement.service.js';

/**
 * Lấy danh sách tất cả users (chỉ user, creator, brand)
 * Staff và Admin không được hiển thị trong danh sách này
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const result = await userManagementService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      role,
      search
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thông tin chi tiết một user
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userManagementService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Tạo user mới (staff/admin tạo)
 */
export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userManagementService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật thông tin user
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await userManagementService.updateUser(id, updateData);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa user (soft delete)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userManagementService.deleteUser(id);
    if (!result) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }
    res.json({ message: 'Xóa user thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

