const axios = require("axios");

module.exports = {
  createTask: async function (context, events) {
    try {
      const response = await axios.post("http://localhost:4000/api/tasks", {
        originalPath:
          "https://media.glamour.es/photos/63a091a79377035b9e81f2eb/3:2/w_1920,c_limit/Zra%20jersey%20con%20falda%20lentejuelas.jpeg",
      });

      const taskId = response.data.taskId;
      context.vars.taskId = taskId;

      console.log(`Task ID: ${taskId}`);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      throw error;
    }
  },
};
