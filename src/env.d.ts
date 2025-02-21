/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    user?: {
      id: string;
      name: string;
      email: string;
      userType: string;
      status: string;
      password: string;
      createdAt: Date;
    };
    permissions?: string[];
  }
} 