import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ExchangeRateHistory } from '@/models/Currency';

export const dynamic = 'force-dynamic';

// GET /api/currencies/history - Lấy lịch sử tỉ giá
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Lấy các tham số truy vấn từ URL
    const url = new URL(req.url);
    const currencyCode = url.searchParams.get('currencyCode');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    // Xây dựng điều kiện truy vấn
    const query: any = {};
    
    if (currencyCode) {
      query.currencyCode = currencyCode.toUpperCase();
    }
    
    if (startDate || endDate) {
      query.date = {};
      
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    // Thực hiện truy vấn
    const history = await ExchangeRateHistory.find(query)
      .sort({ date: -1 })
      .limit(100);
    
    return NextResponse.json({
      status: 'success',
      data: history,
      count: history.length
    });
  } catch (error: any) {
    console.error('Error fetching exchange rate history:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/currencies/history - Thêm lịch sử tỉ giá mới
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!body.currencyCode || !body.rate) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Tạo lịch sử tỉ giá mới
    const newHistory = new ExchangeRateHistory({
      currencyCode: body.currencyCode.toUpperCase(),
      date: body.date ? new Date(body.date) : new Date(),
      rate: body.rate,
      source: body.source || 'Manual'
    });
    
    await newHistory.save();
    
    return NextResponse.json({
      status: 'success',
      data: newHistory,
      message: 'Exchange rate history created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exchange rate history:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
