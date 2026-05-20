const sendBtn = document.getElementById("sendBtn");

const userInput = document.getElementById("userInput");

const chatBox = document.getElementById("chatBox");

/* CHAT STORAGE */

let chats = {};

let chatCounter = 1;

let currentChatId = "chat1";

/* INITIAL CHAT */

chats[currentChatId] = `
    <div class="bot-message">

        <div class="message-top">

            <img src="logo.png">

            <span>Zenova AI</span>

        </div>

        <div class="message-text">

            Hello 👋 <br><br>

            I am Zenova AI. Ask me anything.

        </div>

    </div>
`;

/* SEND BUTTON */

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();
    }
});

/* SEND MESSAGE */

async function sendMessage(){

    const message = userInput.value.trim();

    if(message === "") return;

    /* USER MESSAGE */

    const userDiv = document.createElement("div");

    userDiv.classList.add("user-message");

    userDiv.innerHTML = `
        <div class="message-text">
            ${message}
        </div>
    `;

    chatBox.appendChild(userDiv);

    userInput.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    /* SAVE CHAT */

    saveCurrentChat();

    /* CREATE HISTORY */

    createHistoryItem(message);

    /* TYPING */

    const typingDiv = document.createElement("div");

    typingDiv.classList.add("bot-message");

    typingDiv.id = "typing";

    typingDiv.innerHTML = `
        <div class="message-top">

            <img src="logo.png">

            <span>Zenova AI</span>

        </div>

        <div class="message-text">

            Typing...

        </div>
    `;

    chatBox.appendChild(typingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    try{

        const response = await fetch("http://127.0.0.1:5000/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                message:message
            })
        });

        const data = await response.json();

        document.getElementById("typing").remove();

        /* BOT RESPONSE */

        const botDiv = document.createElement("div");

        botDiv.classList.add("bot-message");

        botDiv.innerHTML = `
            <div class="message-top">

                <img src="logo.png">

                <span>Zenova AI</span>

            </div>

            <div class="message-text">

                ${data.response}

            </div>
        `;

        chatBox.appendChild(botDiv);

        chatBox.scrollTop = chatBox.scrollHeight;

        /* SAVE AGAIN */

        saveCurrentChat();

    }catch(error){

        document.getElementById("typing").remove();

        const errorDiv = document.createElement("div");

        errorDiv.classList.add("bot-message");

        errorDiv.innerHTML = `
            <div class="message-top">

                <img src="logo.png">

                <span>Zenova AI</span>

            </div>

            <div class="message-text">

                Backend connection failed.

            </div>
        `;

        chatBox.appendChild(errorDiv);

        saveCurrentChat();
    }
}

/* SAVE CHAT */

function saveCurrentChat(){

    chats[currentChatId] = chatBox.innerHTML;
}

/* CREATE HISTORY */

function createHistoryItem(text){

    const history = document.querySelector(".history");

    /* CHECK IF ALREADY EXISTS */

    if(document.querySelector(`[data-chat="${currentChatId}"]`)){

        return;
    }

    /* SAVE CHAT ID */

    const savedChatId = currentChatId;

    /* CREATE HISTORY ITEM */

    const item = document.createElement("div");

    item.classList.add("history-item");

    item.setAttribute("data-chat", savedChatId);

    item.innerHTML = `💬 ${text.substring(0,25)}...`;

    history.prepend(item);

    /* OPEN CHAT */

    item.addEventListener("click", () => {

        openChat(savedChatId);

    });
}

/* OPEN CHAT */

function openChat(chatId){

    /* SAVE CURRENT */

    saveCurrentChat();

    /* SWITCH */

    currentChatId = chatId;

    /* LOAD CHAT */

    if(chats[chatId]){

        chatBox.innerHTML = chats[chatId];

    }

    chatBox.scrollTop = chatBox.scrollHeight;

    /* ACTIVE EFFECT */

    document.querySelectorAll(".history-item")
    .forEach(item => {

        item.classList.remove("active");

    });

    const activeItem = document.querySelector(
        `[data-chat="${chatId}"]`
    );

    if(activeItem){

        activeItem.classList.add("active");

    }
}

/* NEW CHAT */

document.querySelector(".new-chat")
.addEventListener("click", () => {

    /* SAVE OLD CHAT */

    saveCurrentChat();

    /* NEW CHAT ID */

    chatCounter++;

    currentChatId = `chat${chatCounter}`;

    /* CLEAR CHAT */

    chatBox.innerHTML = `
        <div class="bot-message">

            <div class="message-top">

                <img src="logo.png">

                <span>Zenova AI</span>

            </div>

            <div class="message-text">

                Hello 👋 <br><br>

                New chat started 🚀

            </div>

        </div>
    `;

    chats[currentChatId] = chatBox.innerHTML;

    /* REMOVE ACTIVE */

    document.querySelectorAll(".history-item")
    .forEach(item => {

        item.classList.remove("active");

    });
});

/* SETTINGS */

const settingsBtn = document.getElementById("settingsBtn");

const settingsPanel = document.getElementById("settingsPanel");

const closeSettings = document.getElementById("closeSettings");

settingsBtn.addEventListener("click", () => {

    settingsPanel.classList.add("active");

});

closeSettings.addEventListener("click", () => {

    settingsPanel.classList.remove("active");

});

/* PROFILE */

const profileBtn = document.getElementById("profileBtn");

const profilePanel = document.getElementById("profilePanel");

const closeProfile = document.getElementById("closeProfile");

profileBtn.addEventListener("click", () => {

    profilePanel.classList.add("active");

});

closeProfile.addEventListener("click", () => {

    profilePanel.classList.remove("active");

});

/* LOGIN */

const loginBtn = document.getElementById("loginBtn");

const loginModal = document.getElementById("loginModal");

loginBtn.addEventListener("click", () => {

    loginModal.classList.add("active");

});

/* SIGNUP */

const signupBtn = document.getElementById("signupBtn");

const signupModal = document.getElementById("signupModal");

signupBtn.addEventListener("click", () => {

    signupModal.classList.add("active");

});

/* CLOSE MODALS */

window.addEventListener("click", (e) => {

    if(e.target === loginModal){

        loginModal.classList.remove("active");
    }

    if(e.target === signupModal){

        signupModal.classList.remove("active");
    }
});

/* LOGOUT */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    window.location.href = "index.html";

});