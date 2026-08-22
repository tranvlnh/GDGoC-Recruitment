export async function verifyTurnstileToken(
    token?: string | null,
    remoteIp?: string,
): Promise<{ success: boolean; error?: string }> {
    const secretKey =
        process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
        process.env.TURNSTILE_SECRET_KEY;

    // If no secret key is configured, bypass check in dev/test environment
    if (!secretKey) {
        if (process.env.NODE_ENV !== "production") {
            console.warn(
                "[Turnstile] CLOUDFLARE_TURNSTILE_SECRET_KEY is not configured. Bypassing Turnstile verification in non-production mode.",
            );
            return { success: true };
        }
        console.warn(
            "[Turnstile] Warning: No secret key configured in production. Turnstile check skipped.",
        );
        return { success: true };
    }

    if (!token || typeof token !== "string" || !token.trim()) {
        return {
            success: false,
            error: "Vui lòng hoàn thành xác thực bảo mật trước khi gửi đơn.",
        };
    }

    try {
        const formData = new URLSearchParams();
        formData.append("secret", secretKey);
        formData.append("response", token);
        if (remoteIp) {
            formData.append("remoteip", remoteIp);
        }

        const res = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        if (!res.ok) {
            console.error(
                "[Turnstile] Siteverify endpoint returned HTTP status:",
                res.status,
            );
            return {
                success: false,
                error: "Không thể kết nối đến máy chủ bảo mật Cloudflare.",
            };
        }

        const data = (await res.json()) as {
            success: boolean;
            "error-codes"?: string[];
            challenge_ts?: string;
            hostname?: string;
        };

        if (data.success) {
            return { success: true };
        }

        console.error(
            "[Turnstile] Verification failed with error codes:",
            data["error-codes"],
        );
        return {
            success: false,
            error: "Xác thực bảo mật Cloudflare không thành công hoặc đã hết hạn. Vui lòng thử lại.",
        };
    } catch (error) {
        console.error("[Turnstile] Exception during verification:", error);
        return {
            success: false,
            error: "Đã xảy ra lỗi khi kiểm tra bảo mật. Vui lòng thử lại.",
        };
    }
}
