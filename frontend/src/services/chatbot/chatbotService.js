import axiosClient from "../../api/axiosClient";

/**
 * Gửi tin nhắn kèm ngữ cảnh trang
 */
export const sendMessage = async (message, pageContext = 'home') => {
  // Gửi object { message, pageContext }
  const response = await axiosClient.post("/chatbot", { message, pageContext });
  return response.data.data; // Trả về dữ liệu sạch
};

export const uploadImage = async (base64Image, prompt, pageContext = 'home') => {
  const response = await axiosClient.post("/chatbot/upload", { 
    image: base64Image, 
    prompt,
    pageContext
  });
  return response.data.data;
};

export const getHistory = async () => {
  const response = await axiosClient.get("/chatbot/history");
  return response.data; // { success: true, data: [...] }
};