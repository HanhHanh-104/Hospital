// UserTable.jsx
const UserTable = ({ label, role, data, handleDelete }) => {
  const commonColumns = (
    <>
      <th className="p-2">Tên đăng nhập</th>
      <th className="p-2">Email</th>
      <th className="p-2">Trạng thái</th>
    </>
  );

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <table className="w-full border text-left mb-4">
        <thead>
          <tr className="bg-gray-100">
            {commonColumns}
            {role === "BACSI" && (
              <>
                <th className="p-2">Khoa</th>
                <th className="p-2">Chuyên môn</th>
                <th className="p-2">Chức vụ</th>
                <th className="p-2">Trình độ</th>
              </>
            )}
            {/* Add other roles here */}
            <th className="p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.maTK || user.tenDangNhap} className="border-b">
              <td className="p-2">{user.tenDangNhap}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.trangThai === 1 ? "Hoạt động" : "Đã khóa"}</td>
              {/* Add role-specific columns here */}
              <td className="p-2 space-x-2">
                <Link
                  to={`/admin/taikhoan/sua/${user.maTK}`}
                  className="text-yellow-600 hover:underline"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(user.maTK)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;