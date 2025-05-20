import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';


@Injectable()
export class ExpoService {
  expo: Expo;
  messagesToSend: ExpoPushMessage[];
  tickets: ExpoPushTicket[];
  receiptIds: string[];

  constructor() {
    this.expo = new Expo();
  }

  sendPushNotificationsBatch(user: User, message: ExpoPushMessage) {

    if (!user) {
      throw new Error("a user shoud be present");
    }

    if (!user.expoPushToken) {
      throw new Error("not token valid");
    }

    this.messagesToSend.push(message)
  }


  //TODO: plus tard, lancé via BullMQ dans un intervalle régulier
  async sendMessageNotification() {
    let chunks = this.expo.chunkPushNotifications(this.messagesToSend);

    for (let chunk of chunks) {
      try {
        let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        this.tickets.push(...ticketChunk);

      } catch (error) {
        console.error(error)
      }
    }
  }

  async getPushNotificationReceiptsAsync() {
    this.receiptIds = [];

    for (let ticket of this.tickets) {
      if (ticket.status === "ok" && ticket.id) {
        this.receiptIds.push(ticket.id);
      }
    }

    let receiptIdChunks = this.expo.chunkPushNotificationReceiptIds(this.receiptIds);

    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await this.expo.getPushNotificationReceiptsAsync(chunk);

        for (let receiptId in receipts) {
          const receipt = receipts[receiptId];

          if (receipt.status === 'ok') {
            continue;
          } else if (receipt.status === 'error') {
            console.error(`There was an error sending a notification: ${receipt.message}`);

            if (receipt.details?.error) {
              console.error(`The error code is ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

  }
}
