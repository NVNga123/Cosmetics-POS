import axios from "axios";
import type { Result } from "../types/result.ts";
import type {reportSumary} from "../types/report.ts";
import { API_URL, API_REPORT } from "../constants/apiConstants.ts";

export const saleReportApi = {
    /** Lấy bao cao tong  */
    getAllReport: async (): Promise<Result<reportSumary>> => {
        const response = await axios.get<Result<reportSumary>>(API_URL + API_REPORT);
        return response.data;
    },
}