import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import prisma from "@/lib/prisma";

if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

    initializeApp({
        credential: cert(serviceAccount)
    });
}

export const kirimNotifikasiKeAdmin = async (
    pesanan: any,
    judul: string,
    pesan: string,
    data?: Record<string, string>
) => {
    try {
        const adminUsers = await prisma.user.findMany({
            where: {
                role: 'ADMIN',
                fcmToken: { not: null }
            },
        });

        const adminTokens = adminUsers
            .map(admin => admin.fcmToken)
            .filter((token): token is string => token !== null);

        if (adminTokens.length > 0) {
            const messaging = getMessaging();

            const sendPromises = adminTokens.map(token =>
                messaging.send({
                    token,
                    notification: {
                        title: judul,
                        body: pesan,
                    },
                    data: {
                        orderId: pesanan.id.toString(),
                        ...data
                    },
                    android: {
                        notification: {
                            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                            channelId: 'pesanan_notification',
                            priority: 'high',
                        },
                    },
                })
            );

            const responses = await Promise.all(sendPromises);
            console.log('Berhasil mengirim notifikasi ke admin:', responses);
            return responses;
        }
    } catch (error) {
        console.error('Error mengirim notifikasi:', error);
        throw error;
    }
};