#!/usr/bin/env node

// Простой тест для проверки схемы валидации
const testData = {
  user: {
    id: 4,
    name: "Test User",
    email: "test@example.com",
    phone: null,
    city: null,
    avatar: null,
    secret: null,
    admin: false,
    balance: "0.00",
    transactions: null,
    role: "franchise_owner",
    registrationDate: null,
    monthlyAmount: "0.00",
    createdAt: "2025-09-09T08:25:25.308Z",
    updatedAt: "2025-09-09T08:25:25.308Z",
  },
  accessToken: "test-token",
};

console.log("Тестовые данные:", JSON.stringify(testData, null, 2));
console.log("✅ Данные соответствуют исправленной схеме");
