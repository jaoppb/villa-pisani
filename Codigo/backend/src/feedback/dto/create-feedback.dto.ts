// src/feedback/dto/create-feedback.dto.ts
export class CreateFeedbackDto {
    body: string;
    senderId?: number;  // Opcional, depende da lógica de feedback anônimo
    status?: boolean;
  }
  