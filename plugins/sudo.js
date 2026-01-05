const { Sparky , isPublic } = require("../lib/");
const util = require("util");
const axios = require("axios");
const fetch = require("node-fetch");
const fs = require("fs");
const {
    updatefullpp,
    getJson
} = require("./pluginsCore");


Sparky(
    {
        on: "text",
        fromMe: true,
    },
    async ({ client, m, args }) => {
        try {
            const sender = m.sender?.split("@")[0];
            const botNumber = client.user?.id?.split(":")[0]?.replace(/[^0-9]/g, "");
            if (!global.owner.includes(sender) && !global.owner.includes(botNumber)) return;
            args = args || "";
            if (typeof args !== "string") args = String(args);
            if (args.startsWith(">")) {
                try {
                    const code = args.slice(1).trim();
                    let evaled = await eval(`(async () => { ${code} })()`);
                    if (typeof evaled !== "string") evaled = util.inspect(evaled);
                    await m.reply(`\`\`\`${evaled}\`\`\``);
                } catch (err) {
                    await m.reply(`_${util.format(err)}_`);
                }
            }
        } catch (e) {
            console.error("Eval plugin error:", e);
        }
    }
);


Sparky(
    {
        name: "mee",
        fromMe: true,
       category: "sudo"
    },
    async ({
        m, client, args
    }) => {
m.sendMsg(m.jid , `_@${m.sender.split("@")[0]}_`  , {   mentions : [m.sender]} )
    })


    Sparky(
        {
            name: "setname",
            fromMe: true,
            desc: "",
            category: "sudo",
        },
        async ({client, m, args}) => {
            try{
    /////////////////////
        args = args || m.quoted?.text;
        if (!args) return await m.reply('_Need Name!*\n*Example: setname S P A R K Y._');
        await client.updateProfileName(args);
        await m.reply('_Profile name updated_');
    //////////////////////
            } catch (e) {
                console.log(e)
            }
        });
    
    Sparky(
        {
            name: "setbio",
            fromMe: true,
            desc: "",
            category: "sudo",
        },
        async ({client, m, args}) => {
            try{
    /////////////////////
        args = args || m.quoted?.text;
        if (!args) return await m.reply('_Need Status!*\n*Example: setbio Hey there! I am using WhatsApp._');
        await client.updateProfileStatus(args);
        await m.reply('_Profile status updated_');
    //////////////////////
            } catch (e) {
                console.log(e)
            }
        });

        Sparky(
            {
                name: "unblock",
                fromMe: true,
                desc: "",
                category: "sudo",
            },
            async ({client, m, args}) => {
                try{
        /////////////////////
            let jid = m.quoted.sender || m.jid;
            return await client.updateBlockStatus(jid, "unblock");
            return m.reply("_unblocked_");
        //////////////////////
                } catch (e) {
                    console.log(e)
                }
            });

    Sparky(
        {
            name: "block",
            fromMe: true,
            desc: "",
            category: "sudo",
        },
        async ({client, m, args}) => {
       await client.updateBlockStatus(m.jid, "block");
       return m.reply("_blocked_");
        });
        
        Sparky(
            {
                name: "fullpp",
                fromMe: true,
                category: "sudo",
                desc: "update profile in fullpp"
            }, async ({
                    m, client, args
                }) => {
                try {
                    if (!m.quoted || (!m.quoted.message.imageMessage))
                        return m.reply("_Reply to an Image_");
                    let media = await m.quoted.download();
                    await updatefullpp(m.user, media, client);
                    return await m.reply("_Profile Picture Updated_");
                } catch (e) {
                    console.log(e)
                }
            });
Sparky(
    {
        name: "qr",
        fromMe: true,
        desc: "Generate UPI QR code for payment",
        category: "sudo",
    },
    async ({client, m, args}) => {
        try {
            /////////////////////
            if (!args) return await m.reply('_Need amount!*\n*Example: qr 100*');
            
            // Validate amount (decimal supported)
            const amount = parseFloat(args);
            if (isNaN(amount) || amount <= 0) {
                return await m.reply('_Please enter a valid amount (decimal supported)_');
            }
            
            // Generate QR URL
            const qrUrl = `https://sabari-qr-api.vercel.app/api/upi-qr?amount=${amount}`;
            
            // Send QR image with caption
            const caption = `*Amount has to payable : ₹${amount}*`;
            
            await client.sendMessage(m.jid, {
                image: { url: qrUrl },
                caption: caption
            }, { quoted: m });
            
            //////////////////////
        } catch (e) {
            console.log(e);
            await m.reply('_Error generating QR code_');
        }
    }
);
