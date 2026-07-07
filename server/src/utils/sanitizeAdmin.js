const sanitizeAdmin = (admin) => ({
  email: admin.email,
  role: 'admin'
});

export default sanitizeAdmin;
