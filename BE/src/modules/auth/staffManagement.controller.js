import * as staffManagementService from './staffManagement.service.js';

/**
 * Lấy danh sách tất cả staff (chỉ admin)
 */
export const getAllStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const result = await staffManagementService.getAllStaff({
      page: parseInt(page),
      limit: parseInt(limit),
      search
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thông tin chi tiết một staff
 */
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await staffManagementService.getStaffById(id);
    if (!staff) {
      return res.status(404).json({ error: 'Không tìm thấy staff' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Tạo staff mới (chỉ admin)
 */
export const createStaff = async (req, res) => {
  try {
    const staffData = req.body;
    const staff = await staffManagementService.createStaff(staffData);
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật thông tin staff
 */
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const staff = await staffManagementService.updateStaff(id, updateData);
    if (!staff) {
      return res.status(404).json({ error: 'Không tìm thấy staff' });
    }
    res.json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa staff (soft delete)
 */
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await staffManagementService.deleteStaff(id);
    if (!result) {
      return res.status(404).json({ error: 'Không tìm thấy staff' });
    }
    res.json({ message: 'Xóa staff thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
