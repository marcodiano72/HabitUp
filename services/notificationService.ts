// services/notificationService.ts
import * as Notifications from 'expo-notifications';
import { PlannedSession } from '../models/types';

export const NotificationService = {
  /**
   * Richiede i permessi per mostrare le notifiche sul dispositivo.
   * Ritorna true se i permessi sono concessi, false altrimenti.
   */
  requestPermission: async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.warn('Errore durante la richiesta dei permessi di notifica:', error);
      return false;
    }
  },

  /**
   * Programma una notifica locale per una sessione pianificata.
   * Ritorna l'ID della notifica generato dal sistema operativo, o undefined in caso di errore.
   */
  scheduleSessionNotification: async (
    session: PlannedSession,
    planName: string
  ): Promise<string | undefined> => {
    try {
      // Parsing della data: 'YYYY-MM-DD'
      const [year, month, day] = session.scheduledDate.split('-').map(Number);
      
      // Impostiamo di default alle 09:00 del mattino del giorno selezionato
      const triggerDate = new Date(year, month - 1, day, 9, 0, 0, 0);
      const now = new Date();

      // LOGICA DI TEST: Se la sessione è pianificata per oggi e sono già passate le 9:00 del mattino,
      // programmiamo la notifica per 10 secondi nel futuro. Questo consente ai professori/studenti
      // di testare il funzionamento istantaneamente senza dover attendere il giorno successivo.
      if (triggerDate.toDateString() === now.toDateString() && now.getHours() >= 9) {
        triggerDate.setTime(now.getTime() + 10000); // 10 secondi da adesso
      } else if (triggerDate <= now) {
        // Se la sessione è inserita per un giorno nel passato, non programmiamo alcuna notifica
        return undefined;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Ora di allenarsi! 🏋️‍♂️',
          body: `Oggi hai in programma la scheda: "${planName}"`,
          data: { sessionId: session.id },
          sound: true,
          badge: 1,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.warn('Errore durante la programmazione della notifica locale:', error);
      return undefined;
    }
  },

  /**
   * Cancella una notifica programmata in precedenza.
   */
  cancelNotification: async (notificationId: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.warn(`Errore durante la cancellazione della notifica ${notificationId}:`, error);
    }
  },
};
