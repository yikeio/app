"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var router_1 = require("next/router");
var conversations_1 = require("@/api/conversations");
var prompts_1 = require("@/api/prompts");
var use_auth_1 = require("@/hooks/use-auth");
var use_localstorage_1 = require("@/hooks/use-localstorage");
var use_settings_1 = require("@/hooks/use-settings");
var utils_1 = require("@/utils");
var lucide_react_1 = require("lucide-react");
var swr_1 = require("swr");
var utils_2 = require("@/lib/utils");
var conversation_list_1 = require("@/components/chat/conversation-list");
var input_1 = require("@/components/chat/input");
var message_list_1 = require("@/components/chat/message-list");
var back_button_1 = require("@/components/head/back-button");
var logo_button_1 = require("@/components/head/logo-button");
var loading_1 = require("@/components/loading");
var button_1 = require("@/components/ui/button");
var label_1 = require("@/components/ui/label");
var tabs_1 = require("@/components/ui/tabs");
function ChatPage() {
    var _this = this;
    var router = router_1.useRouter();
    var _a = use_settings_1["default"](), settings = _a.settings, isSettingsLoading = _a.isLoading;
    var _b = react_1.useState(null), prompt = _b[0], setPrompt = _b[1];
    var _c = use_auth_1["default"](), hasLogged = _c.hasLogged, user = _c.user, redirectToLogin = _c.redirectToLogin;
    var _d = react_1.useState(false), showSidebar = _d[0], setShowSidebar = _d[1];
    var _e = react_1.useState(false), isStreaming = _e[0], setIsStreaming = _e[1];
    var _f = use_localstorage_1["default"]("selectedConversation", null), conversation = _f[0], setConversation = _f[1];
    var _g = use_localstorage_1["default"]("selectedHistoryTab", "current"), historyTab = _g[0], setHistoryTab = _g[1];
    var _h = react_1.useState([]), messages = _h[0], setMessages = _h[1];
    var _j = swr_1["default"]("conversations", function () { return conversations_1.getConversations(); }), conversations = _j.data, isConversationsLoading = _j.isLoading;
    var refreshMessages = function () { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conversation) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, conversations_1.getMessages(conversation.id)];
                case 1:
                    data = (_a.sent()).data;
                    console.log(data);
                    setMessages(data);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleToggleSidebar = function () {
        setShowSidebar(!showSidebar);
    };
    var handleUserSubmit = function () {
        // todo
    };
    var handleAbortAnswing = function () {
        // todo
    };
    var handleSelectConversation = function (conversation) {
        setConversation(conversation);
    };
    var handleChangeConversationHistoryTab = function (tab) {
        setHistoryTab(tab);
    };
    react_1.useEffect(function () {
        if (!hasLogged) {
            redirectToLogin();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLogged]);
    // 切换对话时，自动刷新消息
    react_1.useEffect(function () {
        if (isConversationsLoading) {
            return;
        }
        if (conversations === null || conversations === void 0 ? void 0 : conversations.data.length) {
            setConversation(conversations.data[0]);
        }
        else {
            conversations_1.createConversation((prompt === null || prompt === void 0 ? void 0 : prompt.name) || "新的聊天").then(function (res) {
                setConversation(res);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversations]);
    // 切换对话时，自动刷新消息
    react_1.useEffect(function () {
        conversation && refreshMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation]);
    react_1.useEffect(function () {
        setShowSidebar(utils_1.isScreenSizeAbove("md"));
    }, []);
    react_1.useEffect(function () {
        if (router.query.prompt_id) {
            prompts_1["default"].get(router.query.prompt_id).then(function (res) {
                setPrompt(res);
            });
        }
    }, [router.query.prompt_id]);
    if (!hasLogged || !user || isConversationsLoading || !conversation) {
        return React.createElement(loading_1["default"], { className: "min-h-screen" });
    }
    return (React.createElement("main", { className: "relative flex h-screen flex-1 justify-start overflow-y-auto overflow-x-hidden" },
        React.createElement("div", { className: utils_2.cn("flex h-screen w-[100vw] shrink-0 flex-col border-r lg:ml-0 lg:flex-1", {
                "-ml-72": showSidebar
            }) },
            React.createElement("header", { className: "flex shrink-0 items-center justify-between overflow-hidden border-b bg-white" },
                React.createElement(logo_button_1["default"], null),
                React.createElement("div", { className: "flex flex-1 gap-6 border-l p-2 md:p-4" },
                    React.createElement("div", { className: "flex flex-1 items-center gap-2 md:gap-4" },
                        React.createElement(back_button_1["default"], null),
                        React.createElement("div", { className: "max-w-[45vw] truncate text-lg " }, (prompt === null || prompt === void 0 ? void 0 : prompt.name) || "loading...")),
                    React.createElement("div", { className: "flex shrink-0 items-center gap-2 text-gray-500" }, hasLogged && (React.createElement(React.Fragment, null,
                        React.createElement(button_1.Button, { variant: "outline", className: "flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100" },
                            React.createElement(lucide_react_1.ShareIcon, { className: "h-4 w-4" })),
                        React.createElement(button_1.Button, { variant: "outline", className: utils_2.cn("flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100", {
                                "border-primary-300 bg-primary-100": utils_1.isMobileScreen() && showSidebar
                            }), title: "\u6253\u5F00/\u5173\u95ED\u8FB9\u680F", onClick: handleToggleSidebar },
                            React.createElement(lucide_react_1.PanelRightIcon, { className: "h-4 w-4" }))))))),
            React.createElement("div", { className: "flex-1" },
                React.createElement(message_list_1.MessageList, { messages: messages })),
            React.createElement("footer", { className: "sticky bottom-0 z-10 p-4 md:p-6 xl:p-12" },
                isStreaming && (React.createElement(button_1.Button, { className: "flex w-full items-center gap-2 md:w-auto", onClick: handleAbortAnswing },
                    React.createElement(lucide_react_1.StopCircleIcon, { size: 12 }),
                    React.createElement("span", null, "\u505C\u6B62\u751F\u6210"))),
                React.createElement(input_1["default"], { submitKey: settings.chat_submit_key, onSubmit: handleUserSubmit }))),
        React.createElement("aside", { className: utils_2.cn("mr-0 w-72 shrink-0 p-6 text-gray-700 transition-all delay-75", {
                "-mr-72": !showSidebar
            }) },
            prompt && (React.createElement("div", { className: "flex flex-col items-center gap-6 py-6" },
                React.createElement("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-5xl" }, prompt.logo),
                React.createElement("div", { className: "text-xl" }, prompt.name),
                React.createElement("div", { className: "text-gray-500" }, prompt.description),
                React.createElement("div", { className: "text-gray-500" }, "\u4F7F\u7528\u4EBA\u6570\uFF1A 59281 \u4EBA"))),
            React.createElement("div", { className: "flex flex-col gap-4 border-t py-6" },
                React.createElement(label_1.Label, { className: "mt-6" }, "\u5BF9\u8BDD\u5386\u53F2"),
                React.createElement(tabs_1.Tabs, { onValueChange: handleChangeConversationHistoryTab, value: historyTab },
                    React.createElement(tabs_1.TabsList, { className: "grid grid-cols-2 bg-primary-50" },
                        React.createElement(tabs_1.TabsTrigger, { value: "current" },
                            React.createElement("div", { className: "flex items-center gap-1" },
                                React.createElement("span", null, "\u5F53\u524D\u573A\u666F(5)"))),
                        React.createElement(tabs_1.TabsTrigger, { value: "all" },
                            React.createElement("div", { className: "flex items-center gap-1" },
                                React.createElement("span", null, "\u5168\u90E8\u573A\u666F(50)"))))),
                React.createElement(conversation_list_1.ConversationList, { conversations: conversations === null || conversations === void 0 ? void 0 : conversations.data, user: user, onSelect: handleSelectConversation })))));
}
exports["default"] = ChatPage;
