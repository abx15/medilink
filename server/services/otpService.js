const bcrypt = require('bcryptjs');
const OTPLog = require('../models/OTPLog');
const Notification = require('../models/Notification');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const { normalizePhoneNumber } = require('../utils/phoneUtils');

// Initialize Twilio client (only if credentials are provided)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Initialize Nodemailer transporter
let emailTransporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false // Helps with some SMTP providers
        }
    });
}

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via SMS
 */
const sendSMS = async (mobile, otp) => {
    try {
        const normalizedMobile = normalizePhoneNumber(mobile);

        if (!twilioClient) {
            console.log(`📱 [DEV MODE - SMS] ${normalizedMobile}: Your MedLink OTP is ${otp}`);
            return {
                success: true,
                message: 'OTP logged (development mode)'
            };
        }

        const message = await twilioClient.messages.create({
            body: `Your MedLink verification code is: ${otp}. Valid for 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: normalizedMobile
        });

        console.log(`✅ SMS Sent: ${message.sid} to ${normalizedMobile}`);
        return { success: true, messageId: message.sid };
    } catch (error) {
        console.error(`❌ SMS Delivery Failed:`, {
            error: error.message,
            code: error.code,
            mobile: mobile
        });
        return { success: false, error: error.message };
    }
};

/**
 * Send OTP via WhatsApp
 */
const sendWhatsApp = async (mobile, otp) => {
    try {
        const normalizedMobile = normalizePhoneNumber(mobile);

        if (!twilioClient || !process.env.TWILIO_WHATSAPP_NUMBER) {
            console.log(`📱 [DEV MODE - WhatsApp] ${normalizedMobile}: Your MedLink OTP is ${otp}`);
            return {
                success: true,
                message: 'OTP logged (development mode)'
            };
        }

        // WhatsApp requires 'whatsapp:' prefix for both from and to
        const from = process.env.TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:')
            ? process.env.TWILIO_WHATSAPP_NUMBER
            : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

        // Ensure recipient number also has prefix if not present (handled by twilio usually but good to be explicit for creating the 'to' address)
        const to = `whatsapp:${normalizedMobile}`;

        console.log(`⏳ Attempting WhatsApp to ${to} from ${from}`);

        const message = await twilioClient.messages.create({
            body: `Your MedLink verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
            from: from,
            to: to
        });

        console.log(`✅ WhatsApp Sent: SID=${message.sid} Status=${message.status} To=${to}`);
        return { success: true, messageId: message.sid };
    } catch (error) {
        console.error(`❌ WhatsApp Delivery Failed:`, {
            error: error.message,
            code: error.code,
            moreInfo: error.moreInfo,
            mobile: mobile
        });
        // Do not throw, return failure so other channels can proceed
        return { success: false, error: error.message };
    }
};

/**
 * Send OTP via Email
 */
const sendEmail = async (email, otp, name = 'User') => {
    try {
        if (!emailTransporter) {
            console.log(`📧 [DEV MODE - Email] ${email}: Your MedLink OTP is ${otp}`);
            return {
                success: true,
                message: 'OTP logged (development mode)'
            };
        }

        const mailOptions = {
            from: `"MedLink Security" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `${otp} is your MedLink verification code`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 32px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">🏥 MedLink</h1>
                        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px; font-weight: 500;">Digital Health Infrastructure</p>
                    </div>
                    <div style="padding: 40px 32px; background: #ffffff;">
                        <h2 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 700;">Verify Your Identity</h2>
                        <p style="margin: 16px 0; color: #64748b; font-size: 16px; line-height: 24px;">Hello ${name},</p>
                        <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 24px;">Use the verification code below to complete your action on MedLink. This code will expire in 5 minutes.</p>
                        
                        <div style="margin: 32px 0; padding: 24px; background: #f8fafc; border: 2px dashed #0ea5e9; border-radius: 12px; text-align: center;">
                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; color: #0ea5e9; letter-spacing: 8px;">${otp}</span>
                        </div>
                        
                        <p style="margin: 0; color: #94a3b8; font-size: 14px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
                    </div>
                    <div style="padding: 24px; background: #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} MedLink Health Systems. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        const info = await emailTransporter.sendMail(mailOptions);
        console.log(`✅ Email Sent: ${info.messageId} to ${email}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Email Delivery Failed:`, {
            error: error.message,
            email: email
        });
        return { success: false, error: error.message };
    }
};

/**
 * Generate and send OTP to both mobile and email
 */
const sendOTP = async ({ email, mobile, purpose, recipientId, recipientModel, name }) => {
    try {
        const queryConditions = [];
        if (email) queryConditions.push({ email });
        if (mobile) queryConditions.push({ mobile });

        if (queryConditions.length === 0) {
            throw new Error('At least one identifier (email/mobile) must be provided.');
        }

        // 1. Check for cooldown (prevent spam)
        const lastOTP = await OTPLog.findOne({
            $or: queryConditions,
            purpose,
            createdAt: { $gt: new Date(Date.now() - 60 * 1000) } // 60s cooldown
        }).sort({ createdAt: -1 });

        if (lastOTP) {
            throw new Error('Please wait 60 seconds before requesting a new OTP.');
        }

        // 2. Generate and Store OTP
        const otp = generateOTP();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);
        const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        const otpLog = await OTPLog.create({
            email,
            mobile,
            otp: hashedOTP,
            purpose,
            expiresAt,
            maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS) || 3
        });

        // 3. Send via all channels concurrently
        const results = await Promise.allSettled([
            mobile ? sendSMS(mobile, otp) : Promise.resolve({ success: false, error: 'No mobile provided' }),
            mobile ? sendWhatsApp(mobile, otp) : Promise.resolve({ success: false, error: 'No mobile provided' }),
            email ? sendEmail(email, otp, name) : Promise.resolve({ success: false, error: 'No email provided' })
        ]);

        // 4. Record details for audit/debugging
        const notifications = [];
        results.forEach((result, index) => {
            const types = ['sms', 'whatsapp', 'email'];
            const type = types[index];
            const isFulfilled = result.status === 'fulfilled';
            const isSuccess = isFulfilled && result.value.success === true;

            // Only log if it was actually attempted
            if (isFulfilled && result.value.error !== 'No mobile provided' && result.value.error !== 'No email provided') {
                notifications.push({
                    recipient: {
                        model: recipientModel,
                        id: recipientId,
                        mobile: (type === 'email' ? undefined : mobile),
                        email: (type === 'email' ? email : undefined)
                    },
                    type: type,
                    content: `Your MedLink OTP is ******`, // Masked for security
                    purpose: 'otp',
                    status: isSuccess ? 'sent' : 'failed',
                    sentAt: isSuccess ? new Date() : undefined,
                    failureReason: isSuccess ? undefined : (isFulfilled ? result.value.error : result.reason?.message)
                });
            }
        });

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        return {
            success: true,
            message: 'OTP sent successfully',
            expiresAt,
            otpId: otpLog._id
        };
    } catch (error) {
        console.error('❌ sendOTP Master Error:', error.message);
        throw error; // Rethrow to let controller handle it
    }
};

/**
 * Verify OTP
 */
const verifyOTP = async ({ email, mobile, otp, purpose }) => {
    try {
        // Find latest valid OTP
        const otpLog = await OTPLog.findOne({
            $or: [
                email ? { email } : null,
                mobile ? { mobile } : null
            ].filter(Boolean),
            purpose,
            isVerified: false,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!otpLog) {
            return { success: false, message: 'OTP expired or not found.' };
        }

        if (otpLog.attempts >= otpLog.maxAttempts) {
            return { success: false, message: 'Max attempts reached. Request a new OTP.' };
        }

        otpLog.attempts += 1;

        const isMatch = await bcrypt.compare(otp, otpLog.otp);
        if (!isMatch) {
            await otpLog.save();
            return {
                success: false,
                message: `Invalid OTP. ${otpLog.maxAttempts - otpLog.attempts} attempts left.`
            };
        }

        otpLog.isVerified = true;
        otpLog.verifiedAt = new Date();
        await otpLog.save();

        console.log(`✅ OTP Verified for ${email || mobile}`);
        return { success: true, message: 'OTP verified successfully.' };
    } catch (error) {
        console.error('❌ verifyOTP Error:', error.message);
        throw error;
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    generateOTP
};

