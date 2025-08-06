"use client";
import DatePickerInput from "./C";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Choose End Date</h1>
      <DatePickerInput />
    </main>
  );
}
