// asyncHandler dùng để bắt lỗi bất đồng bộ trong các middleware hoặc route handler
// nó sẽ tự động chuyển lỗi đến middleware xử lý lỗi tiếp theo
// dùng thay thế try-catch trong các route handler
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};