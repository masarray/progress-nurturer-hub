const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby9PRznogJcmuzsJ7NaiSX4i4m--zW1CAiOMigPF0MTvj3ydWxNZEdkIx9YKAGXhwmK/exec';

export interface QurbanGroup {
  groupName: string;
  filledSlots: number;
  totalSlots: number;
  fillPct: number;
  paymentProgressPct: number;
  paymentProgressColor: string;
  status: string;
}

export interface PublicData {
  summary: {
    'Saldo Kas': number;
    'Total Pemasukan': number;
    'Total Pengeluaran': number;
    'Saldo Operasional': number;
    'Saldo Ramadhan': number;
  };
  qurban: {
    totalNominal: number;
    progressPct: number;
    progressColor: string;
    remainingNominal: number;
    totalFilled: number;
    totalSlots: number;
    totalGroups: number;
    totalEmpty: number;
    groups: QurbanGroup[];
  };
  seasonal: {
    heroEvent: string;
  };
}

export function loadJsonp(url: string, timeoutMs = 15000): Promise<PublicData> {
  return new Promise((resolve, reject) => {
    const callbackName = `dkmJsonp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement('script');
    const joiner = url.includes('?') ? '&' : '?';

    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    let finished = false;

    function cleanup() {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      try {
        delete (window as any)[callbackName];
      } catch {
        (window as any)[callbackName] = undefined;
      }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    (window as any)[callbackName] = (payload: PublicData) => {
      if (finished) return;
      finished = true;
      cleanup();
      resolve(payload);
    };

    script.onerror = () => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(new Error('Gagal memuat data dari server'));
    };

    timeoutHandle = setTimeout(() => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(new Error('Request timeout — coba lagi nanti'));
    }, timeoutMs);

    script.src = `${url}${joiner}callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

export async function loadPublicData(): Promise<PublicData> {
  return loadJsonp(`${APPS_SCRIPT_URL}?api=public`);
}
