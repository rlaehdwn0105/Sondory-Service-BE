export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Soundory API 명세서",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "kdj-project",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./src/swagger/*.swagger.js"], // 이 부분에 경로가 포함되어야 함
};
