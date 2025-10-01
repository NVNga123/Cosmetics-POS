import axios from "axios";

export const createMomoPayment = async (orderInfo: string, amount: number) => {
    try {
        const res = await axios.post("http://localhost:8086/momo-payment", {
            orderInfo,
            amount,
        });

        if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
        }
    } catch (err) {
        console.error("Lỗi khi gọi BE:", err);
        throw err;
    }
};



