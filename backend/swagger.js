import swaggerJSDoc from "swagger-jsdoc";

const endpoints = [
  {
    method: "post",
    path: "/api/auth/register",
    tag: "Auth",
    secured: false,
    requestBodyRef: "#/components/schemas/RegisterRequest",
    responses: {
      201: { description: "Parent registered successfully" },
      400: { description: "User already exists" },
      403: { description: "Role is not allowed" },
      500: { description: "Internal server error" }
    }
  },
  {
    method: "post",
    path: "/api/auth/login",
    tag: "Auth",
    secured: false,
    requestBodyRef: "#/components/schemas/LoginRequest",
    responses: {
      200: { description: "Login successful" },
      400: { description: "Invalid credentials" },
      500: { description: "Internal server error" }
    }
  },

  { method: "get", path: "/api/users", tag: "Users", secured: true },
  { method: "get", path: "/api/users/:id", tag: "Users", secured: true },
  { method: "put", path: "/api/users/:id", tag: "Users", secured: true },
  { method: "delete", path: "/api/users/:id", tag: "Users", secured: true },

  { method: "post", path: "/api/children", tag: "Children", secured: true },
  { method: "get", path: "/api/children/parent/:parentId", tag: "Children", secured: true },
  { method: "get", path: "/api/children/:id", tag: "Children", secured: true },
  { method: "put", path: "/api/children/:id", tag: "Children", secured: true },
  { method: "delete", path: "/api/children/:id", tag: "Children", secured: true },

  { method: "post", path: "/api/vaccinations", tag: "Vaccinations", secured: true },
  { method: "get", path: "/api/vaccinations/child/:childId", tag: "Vaccinations", secured: true },
  { method: "put", path: "/api/vaccinations/:id", tag: "Vaccinations", secured: true },
  { method: "delete", path: "/api/vaccinations/:id", tag: "Vaccinations", secured: true },

  { method: "post", path: "/api/reminders", tag: "Reminders", secured: true },
  { method: "get", path: "/api/reminders/user/:userId", tag: "Reminders", secured: true },
  { method: "put", path: "/api/reminders/:id", tag: "Reminders", secured: true },
  { method: "delete", path: "/api/reminders/:id", tag: "Reminders", secured: true },

  { method: "post", path: "/api/medical-visits", tag: "Medical Visits", secured: true },
  { method: "get", path: "/api/medical-visits/child/:childId", tag: "Medical Visits", secured: true },
  { method: "get", path: "/api/medical-visits/:id", tag: "Medical Visits", secured: true },
  { method: "put", path: "/api/medical-visits/:id", tag: "Medical Visits", secured: true },
  { method: "delete", path: "/api/medical-visits/:id", tag: "Medical Visits", secured: true },

  { method: "post", path: "/api/prescriptions", tag: "Prescriptions", secured: true },
  { method: "get", path: "/api/prescriptions/visit/:visitId", tag: "Prescriptions", secured: true },
  { method: "put", path: "/api/prescriptions/:id", tag: "Prescriptions", secured: true },
  { method: "delete", path: "/api/prescriptions/:id", tag: "Prescriptions", secured: true },

  { method: "post", path: "/api/medical-documents", tag: "Medical Documents", secured: true },
  { method: "get", path: "/api/medical-documents/visit/:visitId", tag: "Medical Documents", secured: true },
  { method: "delete", path: "/api/medical-documents/:id", tag: "Medical Documents", secured: true },

  { method: "post", path: "/api/growth-records", tag: "Growth Records", secured: true },
  { method: "get", path: "/api/growth-records/child/:childId", tag: "Growth Records", secured: true },
  { method: "put", path: "/api/growth-records/:id", tag: "Growth Records", secured: true },
  { method: "delete", path: "/api/growth-records/:id", tag: "Growth Records", secured: true },

  { method: "get", path: "/api/growth-analytics/child/:childId", tag: "Growth Analytics", secured: true },

  { method: "post", path: "/api/nutrition-recommendations", tag: "Nutrition Recommendations", secured: true },
  { method: "get", path: "/api/nutrition-recommendations", tag: "Nutrition Recommendations", secured: true },
  { method: "put", path: "/api/nutrition-recommendations/:id", tag: "Nutrition Recommendations", secured: true },
  { method: "delete", path: "/api/nutrition-recommendations/:id", tag: "Nutrition Recommendations", secured: true },

  { method: "post", path: "/api/daily-care-tips", tag: "Daily Care Tips", secured: true },
  { method: "get", path: "/api/daily-care-tips", tag: "Daily Care Tips", secured: true },
  { method: "put", path: "/api/daily-care-tips/:id", tag: "Daily Care Tips", secured: true },
  { method: "delete", path: "/api/daily-care-tips/:id", tag: "Daily Care Tips", secured: true },

  { method: "post", path: "/api/emergency-contacts", tag: "Emergency Contacts", secured: true },
  { method: "get", path: "/api/emergency-contacts/parent/:parentId", tag: "Emergency Contacts", secured: true },
  { method: "put", path: "/api/emergency-contacts/:id", tag: "Emergency Contacts", secured: true },
  { method: "delete", path: "/api/emergency-contacts/:id", tag: "Emergency Contacts", secured: true },

  { method: "post", path: "/api/doctor-contacts", tag: "Doctor Contacts", secured: true },
  { method: "get", path: "/api/doctor-contacts/parent/:parentId", tag: "Doctor Contacts", secured: true },
  { method: "put", path: "/api/doctor-contacts/:id", tag: "Doctor Contacts", secured: true },
  { method: "delete", path: "/api/doctor-contacts/:id", tag: "Doctor Contacts", secured: true },

  { method: "post", path: "/api/health-checks", tag: "Health Checks", secured: true },
  { method: "get", path: "/api/health-checks/child/:childId", tag: "Health Checks", secured: true },
  { method: "put", path: "/api/health-checks/:id", tag: "Health Checks", secured: true },
  { method: "delete", path: "/api/health-checks/:id", tag: "Health Checks", secured: true },

  { method: "get", path: "/api/settings", tag: "Settings", secured: true },
  { method: "put", path: "/api/settings", tag: "Settings", secured: true },

  { method: "get", path: "/api/audit-logs", tag: "Audit Logs", secured: true }
];

const requestBodyByOperation = {
  "put /api/users/:id": "#/components/schemas/UserUpdateRequest",

  "post /api/children": "#/components/schemas/ChildRequest",
  "put /api/children/:id": "#/components/schemas/ChildRequest",

  "post /api/vaccinations": "#/components/schemas/VaccinationRequest",
  "put /api/vaccinations/:id": "#/components/schemas/VaccinationStatusUpdateRequest",

  "post /api/reminders": "#/components/schemas/ReminderRequest",
  "put /api/reminders/:id": "#/components/schemas/ReminderRequest",

  "post /api/medical-visits": "#/components/schemas/MedicalVisitRequest",
  "put /api/medical-visits/:id": "#/components/schemas/MedicalVisitRequest",

  "post /api/prescriptions": "#/components/schemas/PrescriptionRequest",
  "put /api/prescriptions/:id": "#/components/schemas/PrescriptionRequest",

  "post /api/medical-documents": "#/components/schemas/MedicalDocumentRequest",

  "post /api/growth-records": "#/components/schemas/GrowthRecordRequest",
  "put /api/growth-records/:id": "#/components/schemas/GrowthRecordRequest",

  "post /api/nutrition-recommendations": "#/components/schemas/NutritionRecommendationRequest",
  "put /api/nutrition-recommendations/:id": "#/components/schemas/NutritionRecommendationRequest",

  "post /api/daily-care-tips": "#/components/schemas/DailyCareTipRequest",
  "put /api/daily-care-tips/:id": "#/components/schemas/DailyCareTipRequest",

  "post /api/emergency-contacts": "#/components/schemas/EmergencyContactRequest",
  "put /api/emergency-contacts/:id": "#/components/schemas/EmergencyContactRequest",

  "post /api/doctor-contacts": "#/components/schemas/DoctorContactRequest",
  "put /api/doctor-contacts/:id": "#/components/schemas/DoctorContactRequest",

  "post /api/health-checks": "#/components/schemas/HealthCheckRequest",
  "put /api/health-checks/:id": "#/components/schemas/HealthCheckRequest",

  "put /api/settings": "#/components/schemas/SettingsUpdateRequest"
};

const toOpenApiPath = (path) => path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");

const extractPathParams = (path) => {
  const matches = path.match(/:([A-Za-z0-9_]+)/g) || [];
  return matches.map((match) => {
    const name = match.slice(1);
    return {
      name,
      in: "path",
      required: true,
      schema: { type: "string" }
    };
  });
};

const paths = endpoints.reduce((acc, endpoint) => {
  const openApiPath = toOpenApiPath(endpoint.path);
  const operationKey = `${endpoint.method} ${endpoint.path}`;
  const requestBodyRef = endpoint.requestBodyRef || requestBodyByOperation[operationKey];
  if (!acc[openApiPath]) {
    acc[openApiPath] = {};
  }

  acc[openApiPath][endpoint.method] = {
    tags: [endpoint.tag],
    summary: `${endpoint.method.toUpperCase()} ${endpoint.path}`,
    parameters: extractPathParams(endpoint.path),
    ...(requestBodyRef
      ? {
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: requestBodyRef
                }
              }
            }
          }
        }
      : {}),
    responses: endpoint.responses || {
      200: {
        description: "Success"
      }
    },
    ...(endpoint.secured
      ? {
          security: [{ bearerAuth: [] }]
        }
      : {})
  };

  return acc;
}, {});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BabyNest API",
      version: "1.0.0",
      description: "Interactive API documentation for the BabyNest backend."
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Aanish" },
            email: { type: "string", format: "email", example: "aanish@example.com" },
            password: { type: "string", format: "password", example: "StrongPass123" },
            phone: { type: "string", example: "+911234567890" },
            role: {
              type: "string",
              enum: ["parent"],
              description: "Only parent registration is allowed"
            }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "aanish@example.com" },
            password: { type: "string", format: "password", example: "StrongPass123" }
          }
        },
        UserUpdateRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Aanish Kumar" },
            email: { type: "string", format: "email", example: "aanish@example.com" },
            phone: { type: "string", example: "+911234567890" }
          }
        },
        ChildRequest: {
          type: "object",
          required: ["parentId", "name", "birthDate", "gender"],
          properties: {
            parentId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            name: { type: "string", example: "Baby Aarav" },
            birthDate: { type: "string", format: "date", example: "2024-01-10" },
            gender: { type: "string", example: "male" },
            medicalConditions: { type: "string", example: "None" },
            allergies: { type: "string", example: "Peanuts" }
          }
        },
        VaccinationRequest: {
          type: "object",
          required: ["childId", "name", "recommendedAge", "status"],
          properties: {
            childId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            name: { type: "string", example: "MMR" },
            recommendedAge: { type: "string", example: "9 months" },
            status: { type: "string", example: "pending" },
            administeredDate: { type: "string", format: "date", example: "2026-03-21" }
          }
        },
        VaccinationStatusUpdateRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", example: "completed" },
            administeredDate: { type: "string", format: "date", example: "2026-03-21" }
          }
        },
        ReminderRequest: {
          type: "object",
          required: ["userId", "childId", "type", "message", "remindAt"],
          properties: {
            userId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            childId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            type: { type: "string", example: "vaccination" },
            message: { type: "string", example: "MMR vaccine due tomorrow" },
            remindAt: { type: "string", format: "date-time", example: "2026-03-22T10:00:00.000Z" }
          }
        },
        MedicalVisitRequest: {
          type: "object",
          required: ["childId", "doctorName", "visitDate"],
          properties: {
            childId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            doctorName: { type: "string", example: "Dr. Sharma" },
            visitDate: { type: "string", format: "date", example: "2026-03-21" },
            notes: { type: "string", example: "Routine check-up" }
          }
        },
        PrescriptionRequest: {
          type: "object",
          required: ["visitId", "medication", "instructions"],
          properties: {
            visitId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            medication: { type: "string", example: "Paracetamol syrup" },
            instructions: { type: "string", example: "5 ml twice daily after food" }
          }
        },
        MedicalDocumentRequest: {
          type: "object",
          required: ["visitId", "fileUrl", "fileType"],
          properties: {
            visitId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            fileUrl: { type: "string", example: "https://example.com/report.pdf" },
            fileType: { type: "string", example: "pdf" }
          }
        },
        GrowthRecordRequest: {
          type: "object",
          required: ["childId", "date", "height", "weight"],
          properties: {
            childId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            date: { type: "string", format: "date", example: "2026-03-21" },
            height: { type: "number", example: 78.5 },
            weight: { type: "number", example: 10.8 }
          }
        },
        NutritionRecommendationRequest: {
          type: "object",
          required: ["ageInMonths", "dietTips"],
          properties: {
            ageInMonths: { type: "number", example: 12 },
            dietTips: { type: "string", example: "Include mashed fruits and soft vegetables" }
          }
        },
        DailyCareTipRequest: {
          type: "object",
          required: ["ageInMonths", "tip"],
          properties: {
            ageInMonths: { type: "number", example: 12 },
            tip: { type: "string", example: "Maintain a regular sleep routine" }
          }
        },
        EmergencyContactRequest: {
          type: "object",
          required: ["parentId", "name", "relation", "phone"],
          properties: {
            parentId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            name: { type: "string", example: "Riya Singh" },
            relation: { type: "string", example: "Aunt" },
            phone: { type: "string", example: "+911234567891" }
          }
        },
        DoctorContactRequest: {
          type: "object",
          required: ["parentId", "name", "specialization", "phone", "hospital"],
          properties: {
            parentId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            name: { type: "string", example: "Dr. Mehta" },
            specialization: { type: "string", example: "Pediatrics" },
            phone: { type: "string", example: "+911234567892" },
            hospital: { type: "string", example: "City Hospital" }
          }
        },
        HealthCheckRequest: {
          type: "object",
          required: ["childId", "date", "status"],
          properties: {
            childId: { type: "string", example: "69bdf4de502d20a1113ca12f" },
            date: { type: "string", format: "date", example: "2026-03-21" },
            status: { type: "string", example: "good" },
            notes: { type: "string", example: "No fever, active and healthy" }
          }
        },
        SettingsUpdateRequest: {
          type: "object",
          required: ["key", "value"],
          properties: {
            key: { type: "string", example: "maintenanceMode" },
            value: { type: "string", example: "false" }
          }
        }
      }
    },
    paths
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;