module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("admins", [
      {
        id: 1,
        username: "admin",
        mobile: "0935",
        password:
          "$2a$12$B/ZadkC5q05eyIG50iJ3KuaUt/ljUe7VVEFkPvxwpotUwyWy7wK1K",
        securityCode: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("admins", null, {});
  },
};
