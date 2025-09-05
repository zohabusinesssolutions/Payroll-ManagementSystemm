import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { qr_data, timestamp, device_info } = body;

    if (!qr_data || !timestamp || !device_info) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (qr_data === 'E2209006') {
      return NextResponse.json({
        message: 'Attendance marked successfully',
        data: {
          employee_id: qr_data,
          timestamp,
          device_info,
        },
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Attendance API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
