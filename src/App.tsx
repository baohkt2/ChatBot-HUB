import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare, Send, RefreshCw, Sparkles, BookOpen,
  Phone, Mail, MapPin, ExternalLink, GraduationCap,
  Award, FileText, ChevronRight, Info, CheckCircle
} from "lucide-react";
import { getChatResponse } from "./services/geminiService";

// Helper to parse simple markdown bold and bullet points
const parseBold = (str: string, isUser: boolean = false) => {
  const parts = str.split(/(\*\*.*?\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className={`font-bold ${isUser ? "text-white" : "text-slate-900"}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderFormattedText = (text: string, isUser: boolean = false) => {
  if (!text) return null;
  const textColor = isUser ? "text-white" : "text-slate-700";
  const headingColor = isUser ? "text-white" : "text-blue-900";
  return text.split('\n').map((line, lineIndex) => {
    // Header
    if (line.trim().startsWith('### ')) {
      return (
        <h3 key={lineIndex} className={`text-lg font-bold ${headingColor} mt-4 mb-2`}>
          {parseBold(line.trim().substring(4), isUser)}
        </h3>
      );
    }
    if (line.trim().startsWith('## ')) {
      return (
        <h2 key={lineIndex} className={`text-xl font-extrabold ${headingColor} mt-5 mb-2 border-b border-slate-100 pb-1`}>
          {parseBold(line.trim().substring(3), isUser)}
        </h2>
      );
    }
    // Bullet points
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const content = line.trim().substring(2);
      return (
        <li key={lineIndex} className={`ml-5 list-disc mb-1.5 ${textColor} leading-relaxed`}>
          {parseBold(content, isUser)}
        </li>
      );
    }
    // Normal paragraph
    return (
      <p key={lineIndex} className={`mb-2 ${textColor} leading-relaxed min-h-[1.2em]`}>
        {parseBold(line, isUser)}
      </p>
    );
  });
};

export default function App() {
  const [messages, setMessages] = useState<{ role: "user" | "model"; content: string }[]>([
    {
      role: "model",
      content: "Xin chào! Tôi là **HUB AI Bot**, trợ lý ảo tư vấn tuyển sinh hệ Đào tạo từ xa của **Trường Đại học Ngân hàng TP.HCM (HUB)**.\n\nTôi có thể giúp bạn giải đáp các thắc mắc về chương trình đào tạo, ngành học, học phí, văn bằng và thủ tục xét tuyển. Bạn cần tôi hỗ trợ thông tin gì hôm nay?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "info" | "majors" | "contact">("chat");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Add user message
    const userMsg = { role: "user" as const, content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map to Gemini history format
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const reply = await getChatResponse(trimmed, history);

      setMessages(prev => [...prev, { role: "model", content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "model", content: "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "model",
        content: "Xin chào! Tôi là **HUB AI Bot**, trợ lý ảo tư vấn tuyển sinh hệ Đào tạo từ xa của **Trường Đại học Ngân hàng TP.HCM (HUB)**.\n\nTôi có thể giúp bạn giải đáp các thắc mắc về chương trình đào tạo, ngành học, học phí, văn bằng và thủ tục xét tuyển. Bạn cần tôi hỗ trợ thông tin gì hôm nay?"
      }
    ]);
  };

  const suggestedQuestions = [
    "Hạn nộp hồ sơ đợt 1/2026 là khi nào?",
    "Học phí hệ đào tạo từ xa của HUB là bao nhiêu?",
    "HUB đào tạo từ xa những ngành nào?",
    "Văn bằng hệ đào tạo từ xa có giá trị thế nào?",
    "Hình thức học tập và thời gian đào tạo ra sao?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 flex flex-col antialiased">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100/60 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center shadow-md shadow-blue-900/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight tracking-wide flex items-center gap-2">
                TRƯỜNG ĐẠI HỌC NGÂN HÀNG TP.HCM
                <span className="hidden sm:inline px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-900 rounded-full border border-blue-200">HUB</span>
              </h1>
              <p className="text-sm font-semibold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                CỔNG THÔNG TIN TƯ VẤN TUYỂN SINH ĐÀO TẠO TỪ XA
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200/80 transition-all text-xs font-medium cursor-pointer shadow-sm hover:shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Xóa hội thoại
          </button>
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <main className="max-w-7xl w-full mx-auto p-4 flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 overflow-hidden">
        {/* Left column (Mobile navigation or Quick info tabs) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* Navigation Tabs (Rich aesthetics) */}
          <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 flex md:flex-col flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === "chat"
                ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-900"
                }`}
            >
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              <span>Hỏi đáp AI</span>
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === "info"
                ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-900"
                }`}
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span>Thông tin tuyển sinh</span>
            </button>
            <button
              onClick={() => setActiveTab("majors")}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === "majors"
                ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-900"
                }`}
            >
              <Award className="w-5 h-5 flex-shrink-0" />
              <span>Các ngành đào tạo</span>
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === "contact"
                ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-900"
                }`}
            >
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span>Liên hệ HUB</span>
            </button>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Tóm tắt Đào tạo từ xa HUB
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/60 flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-medium">Học phí</span>
                <span className="text-sm font-extrabold text-blue-900">250.000đ<span className="text-xs text-slate-500 font-normal"> / tín chỉ</span></span>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/60 flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-medium">Ngành đào tạo</span>
                <span className="text-sm font-extrabold text-blue-900">05 Ngành</span>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/60 flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-medium">Hạn nộp đợt 1</span>
                <span className="text-sm font-extrabold text-blue-900">30/03/2026</span>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/60 flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-medium">Hình thức</span>
                <span className="text-sm font-extrabold text-blue-900">Online 100%</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <strong className="text-blue-900">Bằng Cử nhân:</strong> Do Trường Đại học Ngân hàng TP.HCM cấp, giá trị pháp lý tương đương bằng chính quy, được công nhận toàn quốc và đủ điều kiện học lên cao học.
            </div>
          </div>
        </div>

        {/* Right column (Dynamic View Based on Tab) */}
        <div className="md:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[520px] md:h-[620px] overflow-hidden">
          {activeTab === "chat" && (
            <>
              {/* Chat messages */}
              <div className="flex-1 p-5 overflow-y-auto bg-slate-50/40 flex flex-col gap-5">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border ${msg.role === "user"
                      ? "bg-blue-100 border-blue-200 text-blue-900"
                      : "bg-blue-900 border-blue-900 text-white"
                      }`}>
                      {msg.role === "user" ? "B" : "H"}
                    </div>
                    <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"
                      }`}>
                      <span className="text-xs font-semibold text-slate-400">
                        {msg.role === "user" ? "Bạn" : "HUB AI Bot"}
                      </span>
                      <div className={`p-4 rounded-2xl shadow-sm ${msg.role === "user"
                        ? "bg-blue-900 text-white rounded-tr-none text-right-safe"
                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                        }`}>
                        {renderFormattedText(msg.content, msg.role === "user")}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center flex-shrink-0 border border-blue-900">
                      H
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500">AI đang xử lý thông tin</span>
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200"></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-300"></span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Pills */}
              <div className="p-4 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto flex-nowrap scrollbar-none flex-shrink-0">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="flex-shrink-0 bg-blue-50/70 hover:bg-blue-100/80 text-blue-900 text-xs font-bold px-3 py-2 rounded-xl border border-blue-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Input Section */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 flex-shrink-0"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hãy đặt câu hỏi về tuyển sinh hệ đào tạo từ xa của HUB..."
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-12 h-12 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition cursor-pointer flex-shrink-0 shadow shadow-blue-900/10 hover:shadow-md"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

          {activeTab === "info" && (
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 select-none bg-slate-50/30">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-900" />
                <h2 className="text-xl font-extrabold text-blue-900">Tổng quan Hệ Đào tạo từ xa</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Chương trình học
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Đào tạo linh hoạt tích hợp nền tảng trực tuyến tiên tiến. Chương trình chuẩn chính quy, mang tính thực tiễn cao.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Văn bằng cử nhân
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Trường Đại học Ngân hàng TP.HCM cấp. Có giá trị pháp lý tương đương bằng chính quy, được công nhận toàn quốc.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Hình thức học tập
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    100% Trực tuyến trên nền tảng của HUB, giúp người học vừa đi làm vừa nâng cao trình độ.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Thời gian tuyển sinh
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-blue-900">Đợt 1 năm 2026:</strong><br />
                    - Hạn nộp hồ sơ: 30/03/2026<br />
                    - Khai giảng: Cuối tháng 04/2026
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                <h3 className="text-sm font-bold text-slate-800">Thông tin chi tiết</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                    <span className="font-medium">Lệ phí xét tuyển</span>
                    <span className="font-bold text-blue-900">150.000đ / hồ sơ</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                    <span className="font-medium">Học phí (Năm học 2025-2026)</span>
                    <span className="font-bold text-blue-900">250.000đ / tín chỉ</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-medium">Thời gian học tối thiểu</span>
                    <span className="font-bold text-blue-900">Từ 24 tháng</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "majors" && (
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 select-none bg-slate-50/30">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-blue-900" />
                <h2 className="text-xl font-extrabold text-blue-900">Các Ngành Đào Tạo</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed -mt-3">
                HUB đào tạo 5 ngành trọng điểm với chuyên môn cao, định hướng ứng dụng và hiện đại.
              </p>

              <div className="flex flex-col gap-4">
                <div className="bg-white p-4 rounded-xl border-l-4 border-l-blue-900 border border-slate-100 shadow-sm flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-blue-900">Ngôn ngữ Anh</h3>
                  <p className="text-xs text-slate-500 font-medium">Mã ngành: 7220201</p>
                  <p className="text-xs text-slate-600 mt-1">Chuyên ngành Tiếng Anh Thương mại. Đạt chuẩn năng lực bậc 5/6 Khung năng lực ngoại ngữ Việt Nam.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border-l-4 border-l-blue-900 border border-slate-100 shadow-sm flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-blue-900">Luật Kinh tế</h3>
                  <p className="text-xs text-slate-500 font-medium">Mã ngành: 7380107</p>
                  <p className="text-xs text-slate-600 mt-1">Chuyên sâu về pháp lý kinh tế, hơn 25 năm kinh nghiệm đào tạo uy tín của HUB.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border-l-4 border-l-blue-900 border border-slate-100 shadow-sm flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-blue-900">Quản trị Kinh doanh</h3>
                  <p className="text-xs text-slate-500 font-medium">Mã ngành: 7340101</p>
                  <p className="text-xs text-slate-600 mt-1">Định hướng Digital Marketing, tiếp cận xu hướng chuyển đổi số của doanh nghiệp.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border-l-4 border-l-blue-900 border border-slate-100 shadow-sm flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-blue-900">Kế toán</h3>
                  <p className="text-xs text-slate-500 font-medium">Mã ngành: 7340301</p>
                  <p className="text-xs text-slate-600 mt-1">Định hướng Digital Accounting (Kế toán số), ứng dụng công nghệ hiện đại.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border-l-4 border-l-blue-900 border border-slate-100 shadow-sm flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-blue-900">Tài chính - Ngân hàng</h3>
                  <p className="text-xs text-slate-500 font-medium">Mã ngành: 7340201</p>
                  <p className="text-xs text-slate-600 mt-1">Định hướng Ngân hàng số và Chuỗi khối (Blockchain), bắt kịp kỷ nguyên tài chính số.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 select-none bg-slate-50/30">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-blue-900" />
                <h2 className="text-xl font-extrabold text-blue-900">Liên Hệ Hỗ Trợ</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed -mt-3">
                Liên hệ trực tiếp với bộ phận tuyển sinh đào tạo từ xa của HUB.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500">Hotline</h4>
                    <p className="text-sm font-bold text-slate-800">0866 005 800</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500">Email hỗ trợ</h4>
                    <p className="text-sm font-bold text-slate-800">daotaotuxa@hub.edu.vn</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500">Website</h4>
                    <p className="text-sm font-bold text-slate-800">dtc.hub.edu.vn</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-900" />
                    Địa chỉ nộp hồ sơ
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-600">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <strong className="text-blue-900">Cơ sở DTC Thủ Đức</strong><br />
                      56 Hoàng Diệu 2, P. Linh Chiểu, TP. Thủ Đức (Tầng sảnh, Nhà Hiệu bộ)
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <strong className="text-blue-900">Cơ sở DTC Sài Gòn</strong><br />
                      39 Hàm Nghi, P. Nguyễn Thái Bình, Q.1, TP.HCM (Tầng sảnh)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="py-4 text-center text-xs font-medium text-slate-400 bg-white border-t border-slate-100/80 select-none flex-shrink-0 mt-auto">
        &copy; 2026 Trường Đại học Ngân hàng TP.HCM. Bản quyền thuộc về HUB.
      </footer>
    </div>
  );
}
