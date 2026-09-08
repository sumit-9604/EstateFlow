const fs = require('fs');
const path = require('path');

exports.logInteraction = (clientId, agentId, action) => {
    const logEntry = `${new Date().toISOString()} - Client: ${clientId} - Agent: ${agentId} - Action: ${action}\n`;
    const logPath = path.join(__dirname, '../logs/interactions.log');
    
    fs.appendFile(logPath, logEntry, (err) => {
        if (err) console.error("Failed to log interaction:", err);
    });
};