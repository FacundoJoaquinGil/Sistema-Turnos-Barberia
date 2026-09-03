export const MOCK_ADMIN_SESSION_KEY =
  "barberia_admin_mock_session";

export const MOCK_ADMIN_CREDENTIALS = {
  email: "admin@barberia.com",
  password: "barberia123",
};

export const loginMockAdmin = (
  email: string,
  password: string,
) => {
  const isValid =
    email === MOCK_ADMIN_CREDENTIALS.email &&
    password === MOCK_ADMIN_CREDENTIALS.password;

  if (!isValid) {
    return false;
  }

  localStorage.setItem(
    MOCK_ADMIN_SESSION_KEY,
    JSON.stringify({
      email,
      loggedAt: new Date().toISOString(),
    }),
  );

  return true;
};

export const logoutMockAdmin = () => {
  localStorage.removeItem(
    MOCK_ADMIN_SESSION_KEY,
  );
};

export const isMockAdminAuthenticated = () => {
  return Boolean(
    localStorage.getItem(
      MOCK_ADMIN_SESSION_KEY,
    ),
  );
};