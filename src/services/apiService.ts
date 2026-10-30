/**
 * SmartLab LIMS - Server API Service & Error Handling Engine
 * 
 * Demonstrates:
 * 1. Error Handling (Server API bilan ishlash)
 * 2. try { ... } - Asosiy server so'rovi bajarilishi
 * 3. throw new Error(...) - Xatolikni sun'iy/real ravishda otish va kodni to'xtatish
 * 4. catch (error) - Xatolikni ushlab xavfsiz qayta ishlash
 * 5. finally { ... } - Har qanday holatda ham loader va taymerlarni to'xtatish
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  executionTimeMs: number;
}

export const apiService = {
  /**
   * Server holatini tekshirish so'rovi (try-catch-finally va throw namoyishi)
   */
  async checkServerHealth(): Promise<ApiResponse<{ cpu: number; ram: number; ping: number }>> {
    const startTime = Date.now();
    let isSuccess = false;
    let errorMsg = '';
    let resultData;

    try {
      // Async server delay (1.5 soniya)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 20% ehtimollik bilan sun'iy server xatoligi otish (throw error)
      const randomFail = Math.random() < 0.15;
      if (randomFail) {
        throw new Error("503 Service Unavailable: Serverda yuqori yuklama aniqlandi!");
      }

      isSuccess = true;
      resultData = {
        cpu: Math.floor(15 + Math.random() * 20),
        ram: Math.floor(40 + Math.random() * 15),
        ping: Math.floor(12 + Math.random() * 15)
      };
    } catch (err: any) {
      isSuccess = false;
      errorMsg = err.message || "Server bilan bog'lanishda noma'lum xatolik!";
      console.error("[API Error Caught]:", err);
    } finally {
      // Finally bloki har qanday holatda ishlaydi (loader to'xtatiladi)
    }

    return {
      success: isSuccess,
      data: resultData,
      error: errorMsg,
      timestamp: new Date().toLocaleTimeString(),
      executionTimeMs: Date.now() - startTime
    };
  },

  /**
   * LIS Apparatini sinovdan o'tkazish (throw error bilan)
   */
  async testLisEquipmentConnection(lisName: string, ipAddress: string): Promise<ApiResponse<{ status: string; packets: number }>> {
    const startTime = Date.now();
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));

      if (!ipAddress || ipAddress.endsWith('.130')) {
        // PCR apparat offline holatda - throw bilan xatolik otamiz
        throw new Error(`[TCP/IP Error]: ${lisName} (${ipAddress}:9100) apparati bilan aloqa o'rnatilmadi! Port yopiq yoki shnur uzilgan.`);
      }

      return {
        success: true,
        data: { status: 'ONLINE_READY', packets: 64 },
        timestamp: new Date().toLocaleTimeString(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Apparat bilan ulanishda xatolik yuz berdi!",
        timestamp: new Date().toLocaleTimeString(),
        executionTimeMs: Date.now() - startTime
      };
    }
  },

  /**
   * SMS Gateway API tokenini tekshirish
   */
  async testSmsToken(provider: string, token: string): Promise<ApiResponse<{ provider: string; credits: number }>> {
    const startTime = Date.now();
    try {
      await new Promise(resolve => setTimeout(resolve, 1600));

      if (!token || token.length < 20) {
        throw new Error(`[SMS API Error 401]: ${provider.toUpperCase()} API Token yaroqsiz yoki eskirgan!`);
      }

      return {
        success: true,
        data: { provider, credits: 1450 },
        timestamp: new Date().toLocaleTimeString(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "SMS Provider API so'rovida xatolik!",
        timestamp: new Date().toLocaleTimeString(),
        executionTimeMs: Date.now() - startTime
      };
    }
  },

  /**
   * Cloud Zaxira Sinxronizatsiyasi
   */
  async syncCloudData(): Promise<ApiResponse<{ syncedRecords: number }>> {
    const startTime = Date.now();
    try {
      await new Promise(resolve => setTimeout(resolve, 2200));
      return {
        success: true,
        data: { syncedRecords: 14850 },
        timestamp: new Date().toLocaleTimeString(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Cloud sinxronizatsiyada xatolik!",
        timestamp: new Date().toLocaleTimeString(),
        executionTimeMs: Date.now() - startTime
      };
    }
  }
};
