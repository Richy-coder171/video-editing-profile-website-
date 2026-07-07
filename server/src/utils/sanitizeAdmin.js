const sanitizeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  createdAt: admin.createdAt
});

export default sanitizeAdmin;
