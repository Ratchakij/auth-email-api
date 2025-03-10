import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds 
    res.cookie("token", token, {
        httpOnly: true, // ช่วยป้องกันไม่ให้ Javascript อ่าน Cookie ของเรา เพื่อป้องกันกรณี Cross-Site Scripting (XSS)
        /*
            secure: true, // ใช้ใน production เพื่อให้การส่ง Cookie มี HTTPS
            บังคับให้ระบบเรารับส่ง Cookie บน HTTPS (HTTP over SSL/TLS) ที่มีการเข้ารหัสข้อมูลเท่านั้น
            ทำให้การรับส่ง Cookie ระหว่าง Client Browser และ Server มีความปลอดภัยมากขึ้นเพราะไม่สามารถอ่าน Cookie ของเราระหว่างทางได้
        */
        secure: process.env.NODE_ENV === "production",
        /*
            sameSite: "strict", // ช่วยป้องกันการโจมตีแบบ Cross-Site Request Forgery (CSRF) ด้วยการป้องกันต้นทางของ Cookie ที่จะส่งมายัง Server
            มีด้วยกันสองแบบคือ Strict และ Lax
                Strict — Cookies ต้องถูกส่งมาจากต้นทางคือ Website ของเราเท่านั้น
                Lax — อนุญาตให้ส่ง Cookies จากต้นทาง Website อื่นได้ ผ่าน HTTP GET บน Address Bar เท่านั้น (เช่นการกด Link)
        */
        sameSite: "strict", // CSRF
        maxAge: maxAge,
    });

    return token;
};