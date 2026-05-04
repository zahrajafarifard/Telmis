module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("StatusFactors", [
      {
        id: 1,
        status: "در انتظار تایید",
        createdAt: new Date(),
        updatedAt: new Date(),
        color: "#CA8A00",
        bgColor: "#FFF2D7",
      },
      {
        id: 2,
        status: "تایید شده",
        createdAt: new Date(),
        updatedAt: new Date(),
        color: "#1F861A",
        bgColor: "#CBF8CE",
      },
      {
        id: 3,
        status: "تحویل شده",
        createdAt: new Date(),
        updatedAt: new Date(),
        color: "#1E00CA",
        bgColor: "#D7E2FF",
      },
      {
        id: 4,
        status: "ارسال شده",
        createdAt: new Date(),
        updatedAt: new Date(),
        color: "#D25000",
        bgColor: "#FFD1AF",
      },
      {
        id: 5,
        status: "لغو شده",
        createdAt: new Date(),
        updatedAt: new Date(),
        color: "#6D6F72",
        bgColor: "#D9D9D9",
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("StatusFactors", null, {});
  },
};
