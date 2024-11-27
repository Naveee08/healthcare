"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";

// CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    // Revalidate the admin page to show the updated appointment
    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("Error while creating a new appointment:", error.message || error);
    throw new Error("Failed to create an appointment. Please try again.");
  }
};

// GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "Error while retrieving recent appointments:",
      error.message || error
    );
    throw new Error("Failed to fetch recent appointments. Please try again.");
  }
};

// SEND SMS NOTIFICATION
export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    // Sending SMS using Appwrite's messaging service
    const message = await messaging.createSms(ID.unique(), content, [], [
      userId,
    ]);
    return parseStringify(message);
  } catch (error) {
    console.error("Error while sending SMS notification:", error.message || error);
    throw new Error("Failed to send SMS notification. Please try again.");
  }
};

// UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Update the appointment document in the database
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment)
      throw new Error("Failed to update the appointment.");

    // Create the SMS message based on the appointment status
    const smsMessage = `Greetings from CarePulse. ${
      type === "schedule"
        ? `Your appointment is confirmed for ${formatDateTime(
            appointment.schedule!,
            timeZone
          ).dateTime} with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform that your appointment for ${formatDateTime(
            appointment.schedule!,
            timeZone
          ).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`
    }.`;

    // Send SMS notification to the user
    await sendSMSNotification(userId, smsMessage);

    // Revalidate the admin page to reflect changes
    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("Error while updating the appointment:", error.message || error);
    throw new Error("Failed to update the appointment. Please try again.");
  }
};

// GET APPOINTMENT BY ID
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error("Error while retrieving the appointment:", error.message || error);
    throw new Error("Failed to retrieve the appointment. Please try again.");
  }
};
