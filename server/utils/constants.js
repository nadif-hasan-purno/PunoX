const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
};

const STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

const DEFAULT_JWT_EXPIRE_HOURS = 8;

const getCookieOptions = () => {
  const hours = parseInt(
    process.env.JWT_COOKIE_EXPIRE_HOURS || DEFAULT_JWT_EXPIRE_HOURS,
    10
  );
  const maxAge = Number.isNaN(hours)
    ? DEFAULT_JWT_EXPIRE_HOURS * 60 * 60 * 1000
    : hours * 60 * 60 * 1000;

  return {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
};

module.exports = { ROLES, STATUS, getCookieOptions };
