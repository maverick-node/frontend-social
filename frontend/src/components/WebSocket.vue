<template>
    <div>
        <h1>WebSocket</h1>
        <div class="user-selection">
            <label for="receiver">Select User to Message:</label>
            <select v-model="receiver" id="receiver">
                <option value="">Select a user...</option>
                <option v-for="user in availableUsers" :key="user.username" :value="user.username">
                    {{ user.username }}
                </option>
            </select>
        </div>
        <div class="chat-container">
            <div class="messages" ref="messagesContainer">
                <div v-for="(msg, index) in messages" :key="index" class="message">
                    {{ msg }}
                </div>
            </div>
            <div class="input-container">
                <input 
                    v-model="message" 
                    @keyup.enter="sendMessage" 
                    placeholder="Type a message..." 
                    :disabled="!receiver"
                />
                <button @click="sendMessage" :disabled="!receiver || !message.trim()">Send</button>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchInfo } from '../api/getInfo.js';

export default {
    data() {
        return {
            socket: null,
            message: '',
            receiver: '',
            messages: [],
            availableUsers: [],
            currentMessage: {
                type: 'message',
                message: '',
                receiver: '',
                username: ''
            }
        };
    },
    
    async mounted() {
        // Get current user info
        try {
            const userInfo = await fetchInfo();
            this.currentMessage.username = userInfo.Username;
            console.log("Current user:", userInfo.Username);
            await this.fetchAvailableUsers();
        } catch (error) {
            console.error("Error fetching user info:", error);
        }

        // Use native WebSocket API
        this.socket = new WebSocket("ws://https://frontend-social-net.vercel.app:8080/ws");

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);
            
            if (data.error) {
                this.messages.push(`Error: ${data.error}`);
            } else {
                this.messages.push(`${data.username}: ${data.message}`);
            }
            this.scrollToBottom();
        };

        this.socket.onopen = () => {
            console.log("WebSocket connected");
            this.messages.push("Connected to chat server");
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.messages.push("Error: WebSocket connection failed");
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
            this.messages.push("Disconnected from server");
        };
    },
    methods: {
        async fetchAvailableUsers() {
            try {
                const response = await fetch('https://back-production-bb9b.up.railway.app/api/openchat', {
                    credentials: 'include'
                });
                if (response.ok) {
                    this.availableUsers = await response.json();
                    console.log("Available users:", this.availableUsers);
                } else {
                    console.error('Failed to fetch available users');
                }
            } catch (error) {
                console.error('Error fetching available users:', error);
            }
        },
        sendMessage() {
            if (this.socket && this.message.trim() !== "" && this.receiver) {
                if (this.socket.readyState !== WebSocket.OPEN) {
                    this.messages.push("Error: WebSocket is not connected");
                    return;
                }

                this.currentMessage.type = "message";
                this.currentMessage.receiver = this.receiver;
                this.currentMessage.message = this.message;
                
                console.log("Sending message:", this.currentMessage);
                try {
                    this.socket.send(JSON.stringify(this.currentMessage));
                    this.messages.push(`Sent to ${this.receiver}: ${this.message}`);
                    this.message = "";
                    this.scrollToBottom();
                } catch (error) {
                    console.error("Error sending message:", error);
                    this.messages.push("Error: Failed to send message");
                }
            } else if (!this.receiver) {
                this.messages.push("Error: Please select a receiver first");
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        }
    },
};
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 500px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 20px 0;
}

.messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
}

.message {
    margin: 5px 0;
    padding: 8px;
    border-radius: 4px;
    background-color: #f0f0f0;
}

.input-container {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
}

.input-container input {
    flex-grow: 1;
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.input-container button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.input-container button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.user-selection {
    margin: 20px 0;
}

.user-selection select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    min-width: 200px;
}
</style>