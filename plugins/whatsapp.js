const {
	Sparky,
	isPublic
} = require("../lib");

Sparky({
    name: "online",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's online privacy settings. Use *all* to allow all users or *match_last_seen* to only allow those who match your last seen."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* online all_\n_to change *online* privacy settings_`);
    const available_privacy = ['all', 'match_last_seen'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateOnlinePrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "lastseen",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's last seen privacy settings. Options include *all*, *contacts*, *contact_blacklist*, or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* lastseen all_\n_to change last seen privacy settings_`);
    const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateLastSeenPrivacy(args)
    await m.reply(`_Privacy settings *last seen* Updated to *${args}*_`);
});

Sparky({
    name: "profile",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's profile picture privacy settings. Options include *all*, *contacts*, *contact_blacklist*, or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* profile all_\n_to change *profile picture* privacy settings_`);
    const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateProfilePicturePrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "status",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's status privacy settings. Options include *all*, *contacts*, *contact_blacklist*, or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* status all_\n_to change *status* privacy settings_`);
    const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateStatusPrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "readreceipt",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's read receipt privacy settings. Options are *all* or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* readreceipt all_\n_to change *read and receipts message* privacy settings_`);
    const available_privacy = ['all', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateReadReceiptsPrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "groupadd",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's group addition privacy settings. Options include *all*, *contacts*, *contact_blacklist*, or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* groupadd all_\n_to change *group add* privacy settings_`);
    const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateGroupsAddPrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "getprivacy",
    fromMe: true,
    category: "whatsapp",
    desc: "Fetches and displays the privacy settings of the user, including online status, profile, last seen, read receipts, and more."
}, async ({ m, args, client }) => {
    const { readreceipts, profile, status, online, last, groupadd, calladd } = await client.fetchPrivacySettings(true);
    const msg = `Privacy Information:
---------------------
Name                 : ${client.user.name}
Online Status        : ${online}
Profile              : ${profile}
Last Seen            : ${last}
Read Receipts        : ${readreceipts}
Status Privacy       : ${status}
Group Addition       : ${groupadd}
Call Addition        : ${calladd}
`
    let img;
    try {
        img = {
            url: await client.profilePictureUrl(m.jid, 'image')
        };
    } catch (e) {
        img = {
            url: "https://i.ibb.co/sFjZh7S/6883ac4d6a92.jpg"
        };
    }
    await client.sendMessage(m.jid, {
        image: img,
        caption: msg
    })
});

Sparky({
    name: "dlt",
    fromMe: true,
    desc: "Deletes the replied message from the chat.",
    category: "whatsapp",
}, async ({ client, m }) => {
    try {
        if(!m.quoted) return m.reply("Reply to a message to delete it.");
        await client.sendMessage(m.jid, {
            delete: {
                remoteJid: m.jid,
                fromMe: false,
                id: m.quoted.key.id,
                participant: m.quoted.key.participant || m.quoted.key.remoteJid
            }
        });
        await client.sendMessage(m.jid, {
            delete: {
                remoteJid: m.jid,
                fromMe: true,
                id: m.quoted.key.id
            }
        });
        await client.sendMessage(m.jid, {
            delete: {
                remoteJid: m.jid,
                fromMe: true,
                id: m.key.id
            }
        });
    } catch (e) {}

});
// Store user sessions globally
if (!global.userSessions) global.userSessions = {};

// Followers service configuration
const followersConfig = {
    pricePerK: 138.60, // ₹ per 1000 followers
    minFollowers: 100,
    maxFollowers: 50000,
    serviceId: 48760
};

Sparky(
    {
        on: "message",
        fromMe: false,
    },
    async ({ client, m }) => {
        try {
            // Skip groups unless bot is mentioned
            if (m.isGroup && !m.mentionedJid?.includes(client.user.id)) {
                return;
            }
            
            // Skip bot messages and system messages
            if (m.fromMe || !m.message || m.message.protocolMessage) {
                return;
            }
            
            const sender = m.sender;
            const messageText = m.text?.trim() || "";
            const lowerText = messageText.toLowerCase();
            
            // Get user's name
            let userName = "";
            try {
                const contact = await client.getContact(sender);
                userName = contact.name || contact.pushname || contact.notify || sender.split("@")[0];
            } catch (e) {
                userName = sender.split("@")[0];
            }
            
            // Initialize user session if not exists
            if (!global.userSessions[sender]) {
                global.userSessions[sender] = {
                    stage: "new_user",
                    lastActive: Date.now(),
                    data: {}
                };
            }
            
            const userSession = global.userSessions[sender];
            userSession.lastActive = Date.now();
            
            // Function to calculate price
            const calculatePrice = (followersCount) => {
                return ((followersCount / 1000) * followersConfig.pricePerK).toFixed(2);
            };
            
            // Function to validate Instagram URL
            const validateInstagramURL = (url) => {
                const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
                const usernameRegex = /^[a-zA-Z0-9._]+$/;
                
                // If it's a URL
                if (url.includes('instagram.com')) {
                    return instagramRegex.test(url);
                }
                // If it's just a username
                else if (usernameRegex.test(url)) {
                    return `https://instagram.com/${url}`;
                }
                return false;
            };
            
            // Function to send service details
            const sendFollowersDetails = async () => {
                const detailsMessage = `📊 *Followers Service Details:*

💰 *Price:* ₹${followersConfig.pricePerK} per 1,000 followers

⚡ *Start Time:* Instant (One click)
🚀 *Speed:* 70k per day
📉 *Drop:* No Drop
🔄 *Refill:* 𝐋𝐢𝐟𝐞𝐭𝐢𝐦𝐞 Refill ♻️
🆔 *Service ID:* ${followersConfig.serviceId}

*Important Instructions:*
Before ordering, make sure your Instagram account is public and the *"Flagged for Review"* option is turned off.

❗️*HOW TO TURN OFF "FLAGGED FOR REVIEW"*
1. Go to Instagram Settings
2. Select "Invite and Follow Friends"
3. Disable "Flagged for Review"

⚠️ *Terms & Conditions:*
- No refund after the order is placed
- No refill if the profile is made private or the username is changed
- Minimum order: ${followersConfig.minFollowers} followers
- Maximum order: ${followersConfig.maxFollowers.toLocaleString()} followers

📝 *Ready to order?*
Please enter the number of followers you want (between ${followersConfig.minFollowers} and ${followersConfig.maxFollowers.toLocaleString()}):`;

                await client.sendMessage(m.jid, {
                    text: detailsMessage
                }, { quoted: m });
                
                userSession.stage = "awaiting_followers_count";
                userSession.data.service = "followers";
            };
            
            // Handle different stages
            switch (userSession.stage) {
                case "new_user":
                case "awaiting_service":
                    // Check if user selected followers
                    if (lowerText === '1' || lowerText === 'followers' || 
                        lowerText.includes('follower')) {
                        await sendFollowersDetails();
                    }
                    // Show service menu for other messages
                    else if (!['2','3','4','likes','views','comments','menu','help'].includes(lowerText)) {
                        const serviceMenu = `👋 Heyy *${userName}!*
    
🎉 *Welcome to Second Spot!* 🏪

*Which of the Instagram Services you need?*

📊 *Services Menu:*
1️⃣ *Followers* - Increase followers count
2️⃣ *Likes* - Boost post engagement  
3️⃣ *Views* - Increase video views
4️⃣ *Comments* - Get genuine comments

📝 *How to Order:*
Send the *service name* or the *number*
Example: "followers" or "1"`;
                        
                        await client.sendMessage(m.jid, {
                            text: serviceMenu
                        }, { quoted: m });
                        userSession.stage = "awaiting_service";
                    }
                    break;
                    
                case "awaiting_followers_count":
                    // Parse followers count
                    const followersCount = parseInt(messageText.replace(/[^0-9]/g, ''));
                    
                    if (isNaN(followersCount)) {
                        await client.sendMessage(m.jid, {
                            text: `❌ *Invalid number!*
Please enter a valid number between ${followersConfig.minFollowers} and ${followersConfig.maxFollowers.toLocaleString()}:`
                        }, { quoted: m });
                        return;
                    }
                    
                    if (followersCount < followersConfig.minFollowers || 
                        followersCount > followersConfig.maxFollowers) {
                        await client.sendMessage(m.jid, {
                            text: `❌ *Out of range!*
Minimum: ${followersConfig.minFollowers} followers
Maximum: ${followersConfig.maxFollowers.toLocaleString()} followers

Please enter a valid amount:`
                        }, { quoted: m });
                        return;
                    }
                    
                    // Calculate price
                    const totalPrice = calculatePrice(followersCount);
                    
                    // Store in session
                    userSession.data.followersCount = followersCount;
                    userSession.data.totalPrice = totalPrice;
                    userSession.stage = "awaiting_instagram_url";
                    
                    // Send price confirmation and ask for Instagram URL
                    const priceMessage = `✅ *Order Summary:*
👥 Followers: ${followersCount.toLocaleString()}
💰 Price: ₹${totalPrice}
📊 Rate: ₹${followersConfig.pricePerK} per 1,000 followers

📝 *Now please provide your Instagram profile URL:*
Format: https://instagram.com/username
Example: https://instagram.com/sabari.yy

*Or just send your Instagram username:*`;
                    
                    await client.sendMessage(m.jid, {
                        text: priceMessage
                    }, { quoted: m });
                    break;
                    
                case "awaiting_instagram_url":
                    // Validate Instagram URL
                    const validatedURL = validateInstagramURL(messageText);
                    
                    if (!validatedURL) {
                        await client.sendMessage(m.jid, {
                            text: `❌ *Invalid Instagram URL/Username!*
Please provide a valid Instagram URL or username.

*Correct Format:* https://instagram.com/username
*Example:* https://instagram.com/sabari.yy

*Or just send your username:* instagram_username`
                        }, { quoted: m });
                        return;
                    }
                    
                    // Store Instagram URL (ensure it's a full URL)
                    const finalURL = validatedURL === true ? messageText : validatedURL;
                    userSession.data.instagramURL = finalURL;
                    userSession.stage = "awaiting_payment";
                    
                    // Generate QR code and send payment request
                    const orderSummary = `📋 *Order Confirmation:*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${userName}
👥 *Service:* Followers
📈 *Quantity:* ${userSession.data.followersCount.toLocaleString()} followers
💰 *Total Amount:* ₹${userSession.data.totalPrice}
🔗 *Instagram:* ${finalURL}
🆔 *Service ID:* ${followersConfig.serviceId}
━━━━━━━━━━━━━━━━━━━━

*Please proceed with payment:*`;
                    
                    // Send order summary
                    await client.sendMessage(m.jid, {
                        text: orderSummary
                    }, { quoted: m });
                    
                    // Generate and send QR code
                    const qrUrl = `https://sabari-qr-api.vercel.app/api/upi-qr?amount=${userSession.data.totalPrice}`;
                    const qrCaption = `📱 *Scan to Pay*
💰 *Amount:* ₹${userSession.data.totalPrice}
━━━━━━━━━━━━━━━━━━━━
*After payment:* 
1️⃣ Take a screenshot of payment
2️⃣ Send the screenshot here
3️⃣ Our admin will verify
4️⃣ Order will be placed immediately

⚠️ *Keep payment proof ready!*`;
                    
                    await client.sendMessage(m.jid, {
                        image: { url: qrUrl },
                        caption: qrCaption
                    }, { quoted: m });
                    
                    // Send final instructions
                    await client.sendMessage(m.jid, {
                        text: `✅ *Payment QR Sent!*
━━━━━━━━━━━━━━━━━━━━
📸 *Next Steps:*
1. Complete the payment using the QR code
2. Take a clear screenshot of payment confirmation
3. Send the screenshot to this chat
4. Our admin will verify within minutes
5. Your order will start processing immediately

💡 *Note:* Please don't delete this chat until order is complete.`
                    }, { quoted: m });
                    break;
                    
                case "awaiting_payment":
                    // Handle payment proof (image or text)
                    if (m.message.imageMessage || m.message.documentMessage) {
                        // User sent an image (likely payment proof)
                        await client.sendMessage(m.jid, {
                            text: `✅ *Payment Proof Received!*
━━━━━━━━━━━━━━━━━━━━
Thank you for sending the payment proof.

👨‍💼 *Admin Notification Sent*
Our admin will verify your payment shortly.

⏳ *Status:* Payment Verification in Progress

📋 *Your Order Details:*
• Service: Followers
• Quantity: ${userSession.data.followersCount.toLocaleString()}
• Amount: ₹${userSession.data.totalPrice}
• Instagram: ${userSession.data.instagramURL}

🔄 You will receive order confirmation once verified.

Thank you for choosing *Second Spot!* 🏪`
                        }, { quoted: m });
                        
                        // Reset session or move to next stage
                        userSession.stage = "payment_verification_pending";
                    } else if (lowerText === 'cancel') {
                        await client.sendMessage(m.jid, {
                            text: `❌ *Order Cancelled*
Your followers order has been cancelled.

Type "menu" to see other services or "followers" to start again.`
                        }, { quoted: m });
                        delete global.userSessions[sender];
                    }
                    break;
                    
                case "payment_verification_pending":
                    if (lowerText === 'status') {
                        await client.sendMessage(m.jid, {
                            text: `📊 *Order Status*
━━━━━━━━━━━━━━━━━━━━
⏳ *Status:* Payment Verification in Progress
📅 *Submitted:* Just now
👨‍💼 *Action:* Admin verification pending

Please wait patiently. You'll receive confirmation soon.

💡 *Note:* Verification usually takes 5-15 minutes.`
                        }, { quoted: m });
                    }
                    break;
            }
            
            // Clean old sessions (older than 24 hours)
            const now = Date.now();
            for (const user in global.userSessions) {
                if (now - global.userSessions[user].lastActive > 86400000) { // 24 hours
                    delete global.userSessions[user];
                }
            }
            
        } catch (e) {
            console.error("Followers service error:", e);
            try {
                await client.sendMessage(m.jid, {
                    text: "❌ *An error occurred!*
Please type 'followers' to start again or 'menu' for other services."
                }, { quoted: m });
            } catch (err) {
                console.error("Error sending error message:", err);
            }
        }
    }
);
