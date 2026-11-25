import { NextResponse } from "next/server";

/** Every success response has the shape `{ success: true, message, data }`. */
export class ApiResponse {
  static ok<T>(message: string, data: T = null as T) {
    return NextResponse.json({ success: true, message, data }, { status: 200 });
  }

  static created<T>(message: string, data: T = null as T) {
    return NextResponse.json({ success: true, message, data }, { status: 201 });
  }
}
