const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

const SECRET_KEY = "SECRET-key-ANSHUL";
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use(
  jsonServer.rewriter({
    "/roles/permissions": "/permissions",
    "/roles/permissions/:id": "/permissions/:id",
  }),
);

server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email or password required" });
  }

  const db = router.db;
  const user = db.get("users").find({ email }).value();

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  const role = db.get("roles").find({ id: user.roleId }).value();
  const permissions = db
    .get("permissions")
    .find({ roleId: user.roleId })
    .value();

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: role.name,
    },
    SECRET_KEY,
    { expiresIn: "8h" },
  );

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: role.name,
    },
    permissions,
  });
});

server.use((req, res, next) => {
  if (req.path === "/login" && req.method === "POST") return next();

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied, no token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

server.use(router);

server.listen(5000, () => {
  console.log(" JSON Server running at http://localhost:5000");
});
