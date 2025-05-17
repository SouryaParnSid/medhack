import Dexie, { Table } from 'dexie';

export interface Patient {
  id?: string;
  name: string;
  age: number;
  symptoms: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  analysis?: string;
}

export class SwasthyaDB extends Dexie {
  patients!: Table<Patient>;

  constructor() {
    super('swasthyaDB');
    this.version(1).stores({
      patients: 'id, name, priority, timestamp'
    });
  }

  async addPatient(patient: Omit<Patient, 'id'>): Promise<string> {
    const id = await this.patients.add({
      ...patient,
      id: Date.now().toString()
    });
    return id.toString();
  }

  async getPatients(): Promise<Patient[]> {
    return await this.patients.orderBy('timestamp').reverse().toArray();
  }

  async getPatientsByPriority(priority: 'high' | 'medium' | 'low'): Promise<Patient[]> {
    return await this.patients
      .where('priority')
      .equals(priority)
      .reverse()
      .toArray();
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<void> {
    await this.patients.update(id, updates);
  }

  async deletePatient(id: string): Promise<void> {
    await this.patients.delete(id);
  }
}

export const db = new SwasthyaDB();
