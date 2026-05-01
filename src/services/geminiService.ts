import { SYSTEM_INSTRUCTION } from "../constants";

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  console.error("GROQ_API_KEY is missing in your environment.");
}

// Smart fallback using local knowledge base if Groq API fails
function getLocalResponse(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes("ngành") || lower.includes("chuyên ngành") || lower.includes("nganh")) {
    return "Trường Đại học Ngân hàng TP.HCM (HUB) đào tạo từ xa với 5 ngành chính:\n\n" +
      "- **Ngôn ngữ Anh**: Chuyên ngành Tiếng Anh Thương mại.\n" +
      "- **Luật Kinh tế**: Chuyên sâu về pháp lý kinh tế.\n" +
      "- **Quản trị Kinh doanh**: Định hướng Digital Marketing.\n" +
      "- **Kế toán**: Định hướng Kế toán số (Digital Accounting).\n" +
      "- **Tài chính - Ngân hàng**: Định hướng Ngân hàng số và Chuỗi khối (Blockchain).";
  }
  if (lower.includes("học phí") || lower.includes("tiền") || lower.includes("hoc phi")) {
    return "Mức học phí hệ đào tạo từ xa của HUB (năm học 2025 - 2026) là **250.000 đồng/tín chỉ**. Ngoài ra, lệ phí xét tuyển là 150.000 đồng/hồ sơ.";
  }
  if (lower.includes("hạn nộp") || lower.includes("nộp hồ sơ") || lower.includes("thời gian tuyển sinh") || lower.includes("han nop")) {
    return "Thông tin tuyển sinh Đợt 1 năm 2026 của HUB:\n\n" +
      "- **Hạn nộp hồ sơ:** 30/03/2026.\n" +
      "- **Ngày khai giảng dự kiến:** Cuối tháng 04/2026.";
  }
  if (lower.includes("văn bằng") || lower.includes("bằng") || lower.includes("van bang")) {
    return "Văn bằng tốt nghiệp hệ đào tạo từ xa của HUB là bằng **Cử nhân** do Trường Đại học Ngân hàng TP.HCM cấp.\n" +
      "- Có giá trị pháp lý tương đương bằng chính quy.\n" +
      "- Được công nhận toàn quốc và đủ điều kiện để học tiếp lên Cao học.";
  }
  if (lower.includes("liên hệ") || lower.includes("hotline") || lower.includes("điện thoại") || lower.includes("địa chỉ")) {
    return "Bạn có thể liên hệ với HUB qua các thông tin sau:\n\n" +
      "- **Hotline:** 0866 005 800\n" +
      "- **Email:** daotaotuxa@hub.edu.vn\n" +
      "- **Website:** dtc.hub.edu.vn\n" +
      "- **Cơ sở DTC Thủ Đức:** 56 Hoàng Diệu 2, P. Linh Chiểu, TP. Thủ Đức (Tầng sảnh, Nhà Hiệu bộ)\n" +
      "- **Cơ sở DTC Sài Gòn:** 39 Hàm Nghi, P. Nguyễn Thái Bình, Q.1, TP.HCM (Tầng sảnh)";
  }
  if (lower.includes("thời gian") || lower.includes("bao lâu")) {
    return "Thời gian đào tạo hệ đào tạo từ xa của HUB kéo dài từ **24 tháng** (tùy thuộc vào số tín chỉ tích lũy hoặc được miễn giảm khi học văn bằng 2).";
  }

  return "Xin chào! Hiện tại tôi có thể hỗ trợ bạn thông tin về hệ Đào tạo từ xa của HUB bao gồm:\n" +
    "- **Học phí:** 250.000đ/tín chỉ.\n" +
    "- **Các ngành đào tạo:** 5 ngành (Ngôn ngữ Anh, Luật Kinh tế, Quản trị Kinh doanh, Kế toán, Tài chính Ngân hàng).\n" +
    "- **Hạn nộp hồ sơ đợt 1/2026:** 30/03/2026.\n\n" +
    "Bạn hãy hỏi cụ thể hơn hoặc chọn một trong các câu hỏi gợi ý để được hỗ trợ nhé!";
}

export async function getChatResponse(userMessage: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  if (!groqApiKey) {
    return getLocalResponse(userMessage);
  }

  // Format messages into OpenAI/Groq compatible chat completions payload
  const messages = history.map(h => ({
    role: h.role === "model" ? "assistant" : "user",
    content: h.parts[0]?.text || ""
  }));

  // Add the current user question
  messages.push({ role: "user", content: userMessage });

  // Add system prompt
  messages.unshift({ role: "system", content: SYSTEM_INSTRUCTION });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error response:", err);
      return getLocalResponse(userMessage);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getLocalResponse(userMessage);
  } catch (error) {
    console.error("Groq API Chat Error:", error);
    return getLocalResponse(userMessage);
  }
}
